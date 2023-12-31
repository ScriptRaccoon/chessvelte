import type { Color, Coord } from "$shared/types"
import type { Move } from "$src/types.server"
import type { Board } from "$src/controllers/Board"
import { Piece } from "$src/controllers/Piece"

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
			board,
		)
	}
}
