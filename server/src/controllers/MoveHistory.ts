import { Move } from "../types"
import type { Piece } from "./Piece"

export class MoveHistory {
	private moves: Move[] = []
	constructor() {
		this.moves = []
	}
	push(move: Move) {
		this.moves.push(move)
	}

	get_last(): Move | undefined {
		if (this.moves.length > 0) {
			return this.moves.at(-1)
		}
	}

	clear() {
		this.moves = []
	}

	contains_piece(piece: Piece) {
		return this.moves.some((move) => move.piece.id === piece.id)
	}
}
