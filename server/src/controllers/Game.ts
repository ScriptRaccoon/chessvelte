import type { Game_State, Move_Info } from "$shared/types"
import type { Move } from "$server/types.server"
import { SimpleDB } from "$shared/SimpleDB"

import { Board } from "./Board"
import { Player } from "./Player"
import { PlayerGroup } from "./PlayerGroup"
import { MoveHistory } from "./MoveHistory"
import { CaptureHistory } from "./CaptureHistory"
import { StatusManager } from "./StatusManager"
import { MoveComputer } from "./MoveComputer"

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
	public status = new StatusManager()
	public player_group = new PlayerGroup()
	private board = new Board()
	private move_history = new MoveHistory()
	private capture_history = new CaptureHistory()
	private move_computer = new MoveComputer(
		this.board,
		this.status,
		this.move_history,
	)

	constructor(id: string) {
		this.#id = id
		Game.db.add(id, this)
		this.move_computer.update()
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
			last_move: this.move_history.last_move_info,
			possible_moves: this.move_computer.moves_info,
		}
	}

	public get id(): string {
		return this.#id
	}

	// METHODS

	public add_player(
		socket_id: string,
		client_id: string,
		name: string,
	): { success: boolean; is_new: boolean; player?: Player } {
		const result = this.player_group.add(socket_id, client_id, name)
		const will_start =
			result.success &&
			this.status.status === "waiting" &&
			this.player_group.is_full
		if (will_start) this.status.start()
		return result
	}

	public execute_move(move_info: Move_Info): void {
		const move = this.move_computer.find_move(move_info)
		if (move) this.process_move(move)
	}

	private process_move(move: Move): void {
		this.move_history.push(move)
		const capture = this.board.apply_move(move)
		if (capture) this.capture_history.add(capture)
		this.status.switch_color()
		this.move_computer.update()
		if (this.move_computer.amount === 0) {
			this.handle_ending()
		}
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
		this.move_computer.update()
	}
}
