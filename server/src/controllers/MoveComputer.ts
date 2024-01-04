import type { Possible_Moves_Info } from "$shared/types"
import type { Possible_Moves } from "$server/types.server"
import type { Board } from "./Board"
import type { MoveHistory } from "./MoveHistory"
import type { StatusManager } from "./StatusManager"
import { key, map_object } from "$shared/utils"

export class MoveComputer {
	private _amount: number = 0
	private _moves: Possible_Moves = {}

	constructor(
		private board: Board,
		private status: StatusManager,
		private move_history: MoveHistory,
	) {}

	public get amount(): number {
		return this._amount
	}

	public get moves(): Possible_Moves {
		return this._moves
	}

	public get moves_info(): Possible_Moves_Info {
		return map_object(this._moves, (moves) =>
			moves.map(({ start, end, type }) => ({ start, end, type })),
		)
	}

	public update(): void {
		let counter = 0
		const all_moves: Possible_Moves = {}
		const color = this.status.current_color
		for (const coord of this.board.coords) {
			const piece = this.board.get(coord)
			if (!piece || piece.color !== color) continue
			const moves = piece.get_save_moves(coord, this.board, this.move_history)
			all_moves[key(coord)] = moves
			counter += moves.length
		}
		this._amount = counter
		this._moves = all_moves
	}
}
