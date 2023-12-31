import type { Coord, Color, Piece_State, Piece_Type } from "$shared/types"
import type { Capture, Move, Piece_Map } from "../types.server"
import type { Piece } from "./Piece"
import { INITIAL_CONFIG } from "../pieces/pieces.config"
import { create_piece } from "../pieces/create"
import { deep_copy, typed_keys, key, unkey } from "$shared/utils"

/**
 * This class represents a chess board. It is responsible for storing and updating
 * the positions of the chess pieces.
 */
export class Board {
	private map: Piece_Map

	constructor(map: Piece_Map | null = null) {
		this.map = map ?? deep_copy(INITIAL_CONFIG)
	}

	get pieces(): Piece_State[] {
		return this.coords
			.map((coord) => {
				const piece = this.get(coord)!
				return piece.state(coord)
			})
			.sort((p, q) => p.id.localeCompare(q.id))
	}

	public copy(): Board {
		return new Board(deep_copy(this.map))
	}

	public get(coord: Coord): Piece | undefined {
		return this.map[key(coord)]
	}

	public has(coord: Coord): boolean {
		return key(coord) in this.map
	}

	public set(coord: Coord, piece: Piece): void {
		this.map[key(coord)] = piece
	}

	public remove(coord: Coord): void {
		delete this.map[key(coord)]
	}

	public reset(): void {
		this.map = deep_copy(INITIAL_CONFIG)
	}

	public get coords(): Coord[] {
		return typed_keys(this.map).map(unkey)
	}

	public apply_move(move: Move): Capture | undefined {
		if (move.capture) {
			this.remove(move.capture.coord)
		}
		this.remove(move.start)
		if (move.type === "promotion") {
			if (move.promotion_choice) {
				const new_piece = create_piece(move.promotion_choice, move.piece.color)
				this.set(move.end, new_piece)
			}
		} else if (move.type === "castle") {
			this.set(move.end, move.piece)
			if (move.associated_move) this.apply_move(move.associated_move)
		} else {
			this.set(move.end, move.piece)
		}
		return move.capture
	}

	private coord_by_type(type: Piece_Type, color: Color): Coord | undefined {
		return this.coords.find((coord) => {
			const piece = this.get(coord)
			return piece?.type === type && piece.color === color
		})
	}

	public is_check(color: Color): boolean {
		const king_coord = this.coord_by_type("king", color)
		if (!king_coord) return false

		return this.coords.some((coord) => {
			const piece = this.get(coord)
			return (
				piece !== undefined &&
				piece.color !== color &&
				piece.attacks(coord, this, king_coord)
			)
		})
	}
}
