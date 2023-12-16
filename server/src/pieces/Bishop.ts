import type { Color, Coord } from "../../../shared/types.js"
import type { Board } from "../controllers/Board.js"
import type { Move } from "../types.js"
import { Piece } from "../controllers/Piece.js"

export class Bishop extends Piece {
	constructor(color: Color) {
		super("bishop", color)
	}

	copy(): Bishop {
		return new Bishop(this.color)
	}

	get_moves(coord: Coord, board: Board): Move[] {
		return this.directional_moves(
			[
				[+1, +1],
				[+1, -1],
				[-1, +1],
				[-1, -1],
			],
			coord,
			board
		)
	}
}
