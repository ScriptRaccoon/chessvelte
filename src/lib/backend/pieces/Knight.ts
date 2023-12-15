import type { Coord, Move, Color } from "../../types"
import type { Board } from "../controllers/Board"
import { is_valid } from "../../utils"
import { Piece } from "../controllers/Piece"

export class Knight extends Piece {
	constructor(color: Color) {
		super("knight", color)
	}

	copy(): Knight {
		return new Knight(this.color)
	}

	get_moves(coord: Coord, board: Board): Move[] {
		const [row, col] = coord

		const ends: Coord[] = [
			[row + 1, col + 2],
			[row - 1, col + 2],
			[row + 2, col + 1],
			[row - 2, col + 1],
			[row + 1, col - 2],
			[row - 1, col - 2],
			[row + 2, col - 1],
			[row - 2, col - 1]
		]

		const moves: Move[] = []

		for (const end of ends) {
			if (!is_valid(end)) continue
			const other_piece = board.get(end)
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

		return moves
	}
}
