import type { Coord, Coord_Key, Color, Board_Map } from "$shared/types"
import { INITIAL_CONFIG } from "../pieces/pieces.config"
import { deep_copy, typed_keys, key, unkey } from "$shared/utils"
import type { Piece } from "./Piece"
import { create_piece } from "../pieces/create"
import { Capture, Move } from "../types"

type Map = Record<Coord_Key, Piece | undefined>

export class Board {
	private map: Map

	constructor(map: Map | null = null) {
		this.map = map ?? deep_copy(INITIAL_CONFIG)
	}

	get reduced_map(): Board_Map {
		return Object.fromEntries(
			Object.entries(this.map).map(([coord, piece]) => [
				coord,
				piece!.to_display(),
			])
		)
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
			if (move.promotion_type) {
				const new_piece = create_piece(
					move.promotion_type,
					move.piece.color
				)
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

	public is_check(color: Color): boolean {
		const king_coord = this.coords.find((coord) => {
			const king = this.get(coord)
			return king?.type === "king" && king.color === color
		})
		if (!king_coord) return false
		for (const coord of this.coords) {
			const piece = this.get(coord)
			if (!piece || piece.color === color) continue
			const moves = piece.get_moves(coord, this, null, false)
			for (const move of moves) {
				const is_attacking = key(move.end) === key(king_coord)
				if (is_attacking) return true
			}
		}
		return false
	}
}
