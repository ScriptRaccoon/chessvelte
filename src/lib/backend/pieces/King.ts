import type { Color, Coord, Move } from "../../types"
import type { Board } from "../controllers/Board"
import type { MoveHistory } from "../controllers/MoveHistory"
import { Piece } from "../controllers/Piece"
import { COLS } from "../../config"
import { inner_range, is_valid } from "../../utils"

export class King extends Piece {
	constructor(color: Color) {
		super("king", color)
	}

	copy(): King {
		return new King(this.color)
	}

	get_moves(
		coord: Coord,
		board: Board,
		move_history: MoveHistory | null,
		include_special_moves: boolean
	): Move[] {
		const [row, col] = coord

		const moves: Move[] = []

		const directions = [
			[+1, 0],
			[-1, 0],
			[0, +1],
			[0, -1],
			[+1, +1],
			[+1, -1],
			[-1, +1],
			[-1, -1]
		]

		for (const direction of directions) {
			const [y, x] = direction

			const end: Coord = [row + y, col + x]
			if (!is_valid(end)) continue

			const other_piece = board.get(end)
			if (other_piece?.color === this.color) continue

			if (!other_piece) {
				moves.push({
					start: coord,
					end,
					piece: this,
					type: "regular"
				})
			} else if (other_piece.color != this.color) {
				moves.push({
					start: coord,
					end,
					piece: this,
					type: "regular",
					capture: {
						coord: end,
						piece: other_piece
					}
				})
			}
		}

		if (include_special_moves) {
			moves.push(...this.castle_moves(coord, board, move_history))
		}

		return moves
	}

	castle_moves(
		coord: Coord,
		board: Board,
		move_history: MoveHistory | null
	): Move[] {
		if (move_history?.contains_piece(this)) return []
		if (board.is_check(this.color)) return []

		const [row, col] = coord
		const moves: Move[] = []

		for (const rook_col of [0, COLS.length - 1]) {
			const rook = board.get([row, rook_col])
			if (!rook || rook.type !== "rook" || move_history?.contains_piece(rook))
				continue

			const range = inner_range(rook_col, col)
			if (range.some((_col) => board.has([row, _col]))) continue

			const jump_coord: Coord = [row, rook_col == 0 ? col - 1 : col + 1]
			const copy = board.copy()
			copy.remove(coord)
			copy.set(jump_coord, this)
			const jump_via_check = copy.is_check(this.color)
			if (jump_via_check) continue

			const rook_move: Move = {
				start: [row, rook_col],
				end: jump_coord,
				piece: rook,
				type: "regular"
			}

			const king_move: Move = {
				start: coord,
				end: [row, rook_col == 0 ? col - 2 : col + 2],
				piece: this,
				type: "castle",
				associated_move: rook_move
			}

			moves.push(king_move)
		}
		return moves
	}
}
