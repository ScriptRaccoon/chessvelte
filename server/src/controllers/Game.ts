import type {
	Color,
	Coord_Key,
	Game_Status,
	Game_State,
	Piece_State,
	Move_State,
	Possible_Moves_State,
} from "$shared/types"
import { Capture, Move } from "../types.server"
import { OUTCOME_MESSAGES, PROMOTION_PIECE_TYPES } from "$shared/config"
import { get_other_color, key, map_object } from "$shared/utils"
import { SimpleDB } from "$shared/SimpleDB"

import { MoveHistory } from "./MoveHistory"
import { Board } from "./Board"
import { Player } from "./Player"
import { PlayerGroup } from "./PlayerGroup"

/**
 * This class represents a chess game. It is responsible for storing the state of the game
 * and for handling all the game logic.
 */
export class Game {
	private static db = new SimpleDB<Game>()

	public static get_or_create_by_id(id: string): Game {
		if (Game.db.has(id)) return this.db.get(id)!
		return new Game(id)
	}

	#id: string
	private move_history: MoveHistory = new MoveHistory()
	private board: Board = new Board()
	private status: Game_Status = "waiting"
	private possible_moves: Record<Coord_Key, Move[]> = {}
	private number_of_possible_moves: number = 0
	private captures: Capture[] = []
	private is_ended: boolean = false
	private current_color: Color = "white"
	private player_group = new PlayerGroup()
	private during_draw_offer: boolean = false

	constructor(id: string) {
		this.#id = id
		this.compute_possible_moves()
		Game.db.add(id, this)
	}

	// GETTERS

	public get state(): Game_State {
		return {
			current_color: this.current_color,
			board_state: this.board.state,
			captured_pieces: this.captured_pieces,
			is_started: this.is_started,
			is_ended: this.has_ended,
			player_names: this.player_group.player_names,
			last_move: this.last_move,
			possible_moves: this.possible_moves_state,
		}
	}

	private get possible_moves_state(): Possible_Moves_State {
		return map_object(this.possible_moves, (moves) =>
			moves.map(({ start, end, type }) => ({ start, end, type })),
		)
	}

	public get id(): string {
		return this.#id
	}

	public get has_ended(): boolean {
		return this.is_ended
	}

	public get is_during_draw_offer(): boolean {
		return this.during_draw_offer
	}

	private get is_started(): boolean {
		return this.status !== "waiting"
	}

	public get is_playing(): boolean {
		return this.is_started && !this.is_ended
	}

	public get start_messages(): string[] | null {
		return this.player_group.start_messages
	}

	public get list_of_sockets(): string[] {
		return this.player_group.keys
	}

	public get outcome(): string {
		return OUTCOME_MESSAGES[this.status]
	}

	private get captured_pieces(): Piece_State[] {
		return this.captures.map((capture) => capture.piece.state)
	}

	private get last_move(): Move_State | null {
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
			this.status === "waiting" &&
			this.player_group.is_full
		) {
			this.status = "playing"
		}
		return result
	}

	public get_player(socket_id: string): Player | undefined {
		return this.player_group.get(socket_id)
	}

	public is_allowed_to_move(socket_id: string): boolean {
		return (
			this.is_playing &&
			this.get_player(socket_id)?.color === this.current_color
		)
	}

	public execute_move(move_attempt: Move_State): void {
		const { start, end } = move_attempt
		const moves = this.possible_moves[key(start)]
		const move = moves.find((move) => key(move.end) === key(end))
		if (!move) return
		if (move.type === "promotion") {
			move.promotion_choice = move_attempt.promotion_choice
			const is_valid =
				move.promotion_choice !== undefined &&
				PROMOTION_PIECE_TYPES.includes(move.promotion_choice)
			if (!is_valid) return
		}
		this.apply_move(move)
		this.switch_color()
		this.compute_possible_moves()
		this.check_for_ending()
	}

	private apply_move(move: Move): void {
		this.move_history.push(move)
		const capture = this.board.apply_move(move)
		if (capture) this.captures.push(capture)
	}

	private switch_color(): void {
		this.current_color = get_other_color(this.current_color)
	}

	private check_for_ending(): void {
		if (this.number_of_possible_moves > 0) return
		this.is_ended = true
		const color = this.current_color
		const checked = this.board.is_check(color)
		this.status = checked ? `checkmate-${color}` : "stalemate"
	}

	public reset(): void {
		this.current_color = "white"
		this.status = "playing"
		this.captures = []
		this.is_ended = false
		this.move_history.clear()
		this.board.reset()
		this.compute_possible_moves()
	}

	public switch_player_colors(): void {
		this.player_group.switch_colors()
	}

	private compute_possible_moves(): void {
		let counter = 0
		const all_moves: Record<Coord_Key, Move[]> = {}
		for (const coord of this.board.coords) {
			const piece = this.board.get(coord)
			if (!piece || piece.color !== this.current_color) continue
			const moves = piece.get_save_moves(coord, this.board, this.move_history)
			all_moves[key(coord)] = moves
			counter += moves.length
		}
		this.number_of_possible_moves = counter
		this.possible_moves = all_moves
	}

	public resign(socket_id: string): void {
		const player = this.get_player(socket_id)
		if (!player) return
		this.status = `resigned-${player.color}`
		this.is_ended = true
	}

	public draw(): void {
		this.status = "drawn"
		this.is_ended = true
	}

	public initialize_draw(): void {
		this.during_draw_offer = true
	}

	public cancel_draw(): void {
		this.during_draw_offer = false
	}
}
