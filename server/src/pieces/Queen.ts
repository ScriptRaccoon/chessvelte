import type { Color, Coord } from "$shared/types"
import type { Board } from "../controllers/Board"
import type { Move } from "../types.server"
import { Piece } from "../controllers/Piece"

export class Queen extends Piece {
	constructor(color: Color) {
		super("queen", color)
	}

	copy(): Queen {
		return new Queen(this.color)
	}

	get_moves(coord: Coord, board: Board): Move[] {
		return this.directional_moves(
			[
				[+1, 0],
				[-1, 0],
				[0, +1],
				[0, -1],
				[+1, +1],
				[+1, -1],
				[-1, +1],
				[-1, -1],
			],
			coord,
			board,
		)
	}
}
