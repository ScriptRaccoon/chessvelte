import type { Game_State, Move_Info, Coord_Key } from "$shared/types"
import type { Move, Possible_Moves } from "$server/types.server"
import { is_valid_promotion_choice, key, map_object } from "$shared/utils"
import { SimpleDB } from "$shared/SimpleDB"

import { Board } from "./Board"
import { Player } from "./Player"
import { PlayerGroup } from "./PlayerGroup"
import { MoveHistory } from "./MoveHistory"
import { CaptureHistory } from "./CaptureHistory"
import { StatusManager } from "./StatusManager"

/**
 * This class represents a chess game. It is responsible for storing the state of the game
 * and for handling all the game logic.
 */
export class Game {
	private static db = new SimpleDB<Game>()

	public static get_or_create_by_id(id: string): Game {
		if (Game.db.has(id)) return Game.db.get(id)!
		return new Game(id)
	}

	#id: string
	public player_group = new PlayerGroup()
	private board = new Board()
	private move_history = new MoveHistory()
	private capture_history = new CaptureHistory()
	public status = new StatusManager()
	private possible_moves: Possible_Moves = {}
	private number_of_possible_moves: number = 0

	constructor(id: string) {
		this.#id = id
		this.compute_possible_moves()
		Game.db.add(id, this)
	}

	// GETTERS

	public get state(): Game_State {
		return {
			current_color: this.status.current_color,
			is_started: this.status.is_started,
			is_ended: this.status.is_ended,
			pieces: this.board.pieces,
			captured_pieces: this.capture_history.pieces,
			player_names: this.player_group.player_names,
			last_move: this.last_move,
			possible_moves: this.possible_moves_state,
		}
	}

	private get possible_moves_state(): Record<Coord_Key, Move_Info[]> {
		return map_object(this.possible_moves, (moves) =>
			moves.map(({ start, end, type }) => ({ start, end, type })),
		)
	}

	public get id(): string {
		return this.#id
	}

	private get last_move(): Move_Info | null {
		const last = this.move_history.get_last()
		if (!last) return null
		const { start, end, type } = last
		return { start, end, type }
	}

	// METHODS

	public add_player(
		socket_id: string,
		client_id: string,
		name: string,
	): { success: boolean; is_new: boolean; player?: Player } {
		const result = this.player_group.add(socket_id, client_id, name)
		if (
			result.success &&
			this.status.status === "waiting" &&
			this.player_group.is_full
		) {
			this.status.start()
		}
		return result
	}

	public execute_move(move_attempt: Move_Info): void {
		const { start, end, promotion_choice } = move_attempt
		const moves = this.possible_moves[key(start)]
		const move = moves.find((move) => key(move.end) === key(end))
		if (!move) return
		if (move.type === "promotion") {
			if (!is_valid_promotion_choice(promotion_choice)) return
			move.promotion_choice = promotion_choice
		}
		this.apply_move(move)
		this.status.switch_color()
		this.compute_possible_moves()
		if (this.number_of_possible_moves === 0) {
			this.handle_ending()
		}
	}

	private apply_move(move: Move): void {
		this.move_history.push(move)
		const capture = this.board.apply_move(move)
		if (capture) this.capture_history.add(capture)
	}

	private handle_ending(): void {
		const color = this.status.current_color
		const checked = this.board.is_check(color)
		this.status.end_with(checked ? `checkmate-${color}` : "stalemate")
	}

	public reset(): void {
		this.status.reset()
		this.capture_history.clear()
		this.move_history.clear()
		this.board.reset()
		this.compute_possible_moves()
	}

	private compute_possible_moves(): void {
		let counter = 0
		const all_moves: Possible_Moves = {}
		for (const coord of this.board.coords) {
			const piece = this.board.get(coord)
			if (!piece || piece.color !== this.status.current_color) continue
			const moves = piece.get_save_moves(coord, this.board, this.move_history)
			all_moves[key(coord)] = moves
			counter += moves.length
		}
		this.number_of_possible_moves = counter
		this.possible_moves = all_moves
	}
}
