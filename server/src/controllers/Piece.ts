import type { MoveHistory } from "./MoveHistory"
import type { Board } from "./Board"
import type { Color, Coord, Piece_Type, Piece_State } from "$shared/types"
import type { Move } from "../types.server"
import { SIZE, PIECE_VALUES } from "$shared/config"
import { generate_short_id, is_valid } from "$shared/utils"

/**
 * This abstract class represents a generic chess piece.
 * It is extended by the concrete classes Pawn, Rook, Knight, Bishop, Queen and King.
 */
export abstract class Piece {
	constructor(
		public type: Piece_Type,
		public color: Color,
		public value: number = PIECE_VALUES[type],
		public id: string = generate_short_id(4),
	) {}

	public state(coord: Coord): Piece_State {
		return {
			type: this.type,
			color: this.color,
			value: this.value,
			id: this.id,
			coord,
		}
	}

	public abstract copy(): any

	public abstract get_moves(
		coord: Coord,
		board: Board,
		move_history: MoveHistory | null,
		include_special_moves: boolean,
	): Move[]

	public get_save_moves(
		coord: Coord,
		board: Board,
		move_history: MoveHistory | null = null,
	): Move[] {
		const moves = this.get_moves(coord, board, move_history, true)
		return moves.filter((move) => {
			const copy = board.copy()
			copy.apply_move(move)
			return !copy.is_check(this.color)
		})
	}

	private *moves_in_direction(
		direction: [number, number],
		coord: Coord,
		board: Board,
	): Generator<Move, void, void> {
		const [row, col] = coord
		const [x, y] = direction

		for (let i = 1; i < SIZE; i++) {
			const target: Coord = [row + x * i, col + y * i]
			if (!is_valid(target)) break

			const other_piece = board.get(target)

			if (!other_piece)
				yield {
					start: coord,
					end: target,
					piece: this,
					type: "regular",
				}

			if (other_piece && other_piece.color != this.color)
				yield {
					start: coord,
					end: target,
					piece: this,
					type: "regular",
					capture: {
						coord: target,
						piece: other_piece,
					},
				}

			if (other_piece) break
		}
	}

	public directional_moves(
		directions: [number, number][],
		coord: Coord,
		board: Board,
	): Move[] {
		return directions.flatMap((direction) =>
			Array.from(this.moves_in_direction(direction, coord, board)),
		)
	}
}
