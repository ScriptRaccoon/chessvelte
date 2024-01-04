import type { Move_Info } from "$shared/types"
import type { Move } from "$server/types.server"
import type { Piece } from "./Piece"

/**
 * This class keeps track of all the moves that have been made in the game.
 */
export class MoveHistory {
	private moves: Move[] = []

	constructor() {
		this.moves = []
	}

	public push(move: Move): void {
		this.moves.push(move)
	}

	public get last_move(): Move | null {
		return this.moves[this.moves.length - 1] ?? null
	}

	public get last_move_info(): Move_Info | null {
		const last = this.last_move
		if (!last) return null
		const { start, end, type } = last
		return { start, end, type }
	}

	public clear(): void {
		this.moves = []
	}

	public contains_piece(piece: Piece): boolean {
		return this.moves.some((move) => move.piece.id === piece.id)
	}
}
