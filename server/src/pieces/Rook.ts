import type { Color, Coord } from "../../../shared/types.js"
import type { Move } from "../types.js"
import { Piece } from "../controllers/Piece.js"
import type { Board } from "../controllers/Board.js"

export class Rook extends Piece {
	constructor(color: Color) {
		super("rook", color)
	}

	copy(): Rook {
		return new Rook(this.color)
	}

	get_moves(coord: Coord, board: Board): Move[] {
		return this.directional_moves(
			[
				[+1, 0],
				[-1, 0],
				[0, +1],
				[0, -1],
			],
			coord,
			board
		)
	}
}
