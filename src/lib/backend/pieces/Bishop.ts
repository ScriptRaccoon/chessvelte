import type { Color, Coord, Move } from "$lib/types"
import type { Board } from "../controllers/Board"
import { Piece } from "../controllers/Piece"

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
				[-1, -1]
			],
			coord,
			board
		)
	}
}
