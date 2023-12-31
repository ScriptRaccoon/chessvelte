import type { Color, Coord } from "$shared/types"
import type { Board } from "$src/controllers/Board"
import type { Move } from "$src/types.server"
import { Piece } from "$src/controllers/Piece"

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
			board,
		)
	}
}
