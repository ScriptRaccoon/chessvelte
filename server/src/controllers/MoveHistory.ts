import { Move } from "$src/types.server"
import type { Piece } from "./Piece"

/**
 * This class keeps track of all the moves that have been made in the game.
 */
export class MoveHistory {
	private moves: Move[] = []
	constructor() {
		this.moves = []
	}
	public push(move: Move) {
		this.moves.push(move)
	}

	public get_last(): Move | undefined {
		if (this.moves.length > 0) {
			return this.moves.at(-1)
		}
	}

	public clear() {
		this.moves = []
	}

	public contains_piece(piece: Piece) {
		return this.moves.some((move) => move.piece.id === piece.id)
	}
}
