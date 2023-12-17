import type {
	Color,
	Coord,
	Coord_Key,
	GAME_STATUS,
	Game_State,
	Player,
	PIECE_TYPE,
} from "$shared/types"

import { MoveHistory } from "./MoveHistory"
import { Board } from "./Board"
import { capitalize, key } from "$shared/utils"
import { Capture, Move } from "../types"

export class Game {
	private static dictionary: Record<string, Game> = {}

	public static get_by_id(id: string): Game | undefined {
		return Game.dictionary[id]
	}

	public static find_by_player(socket_id: string): Game | undefined {
		for (const game of Object.values(Game.dictionary)) {
			if (socket_id in game.players) return game
		}
	}

	private _id: string
	public turn: number = 0
	private move_history: MoveHistory = new MoveHistory()
	private board: Board = new Board()
	private current_color: Color = "white"
	private status: GAME_STATUS = "waiting"
	private all_moves: Record<Coord_Key, Move[]> = {}
	private number_all_moves: number = 0
	private possible_moves: Move[] = []
	private selected_coord: Coord | null = null
	private promotion_move: Move | null = null
	private captures: Capture[] = []
	public players: Record<string, Player> = {}
	private resigned_player: Player | null = null
	public is_ended: boolean = false

	constructor(id: string) {
		this._id = id
		this.compute_all_moves()
		Game.dictionary[id] = this
	}

	public get id(): string {
		return this._id
	}

	public get state(): Game_State {
		return {
			current_color: this.current_color,
			selected_coord: this.selected_coord,
			possible_targets: this.possible_moves.map((move) => move.end),
			board_map: this.board.reduced_map,
			status: this.status,
			captured_pieces: this.captures.map((capture) =>
				capture.piece.to_display()
			),
			is_started: this.is_started,
			is_ended: this.is_ended,
			outcome: this.outcome,
			colors: this.colors,
		}
	}

	public start(): void {
		this.status = "playing"
	}

	public get is_started(): boolean {
		return this.status !== "waiting"
	}

	public get outcome(): string {
		if (this.status === "checkmate") {
			return `Checkmate against ${this.current_color}!`
		}
		if (this.status === "stalemate") {
			return `Stalemate!`
		}
		if (this.status === "resigned" && this.resigned_player !== null) {
			return `${capitalize(this.resigned_player.color)} has resigned`
		} else if (this.status === "drawn") {
			return "Drawn by agreement"
		}
		return ""
	}

	private get colors(): Record<string, Color> {
		const colors: Record<string, Color> = {}
		for (const socket_id in this.players) {
			colors[socket_id] = this.players[socket_id].color
		}
		return colors
	}

	public add_player(socket_id: string, client_id: string): Player | null {
		const player_list = Object.values(this.players)

		const player: Player | undefined = player_list.find(
			(player) => player.client_id === client_id
		)

		if (player) {
			this.players[socket_id] = player
			return player
		}

		if (player_list.length >= 2) return null

		const turn =
			player_list.length === 0
				? Number(Math.random() < 0.5)
				: 1 - player_list[0].turn

		const color: Color = turn === 0 ? "white" : "black"

		const new_player: Player = { client_id, turn, color }
		this.players[socket_id] = new_player

		if (Object.values(this.players).length === 2) {
			this.status = "playing"
		}

		return new_player
	}

	public select_coord(coord: Coord): boolean {
		if (this.is_ended) {
			return false
		}
		const piece = this.board.get(coord)
		if (this.selected_coord) {
			if (key(this.selected_coord) == key(coord)) {
				this.cancel_move()
			} else if (piece?.color === this.current_color) {
				this.start_move(coord)
			} else {
				return this.generate_move(coord)
			}
		} else if (piece?.color === this.current_color) {
			this.start_move(coord)
		}
		return false
	}

	private cancel_move(): void {
		this.selected_coord = null
		this.possible_moves = []
	}

	private start_move(coord: Coord): void {
		this.selected_coord = coord
		this.possible_moves = this.all_moves[key(coord)]
	}

	private generate_move(coord: Coord): boolean {
		if (!this.selected_coord) return false
		const move = this.possible_moves?.find(
			(move) => key(move.end) == key(coord)
		)
		if (!move) return false
		if (move.type === "promotion") {
			this.promotion_move = move
			this.status = "promotion"
			return false
		} else {
			this.finish_move(move)
			return true
		}
	}

	private execute_move(move: Move): void {
		this.move_history.push(move)
		const capture = this.board.apply_move(move)
		if (capture) {
			this.captures.push(capture)
		}
	}

	private switch_color(): void {
		this.current_color = this.current_color === "white" ? "black" : "white"
		this.selected_coord = null
		this.possible_moves = []
		this.turn = 1 - this.turn
	}

	private check_for_ending(): void {
		const checked = this.board.is_check(this.current_color)
		const no_moves_left = this.number_all_moves === 0
		if (no_moves_left) {
			this.is_ended = true
			this.status = checked ? "checkmate" : "stalemate"
		} else {
			this.status = checked ? "check" : "playing"
		}
	}

	private finish_move(move: Move): void {
		this.execute_move(move)
		this.switch_color()
		this.compute_all_moves()
		this.check_for_ending()
	}

	public finish_promotion(type: PIECE_TYPE): void {
		if (!this.promotion_move) return
		this.promotion_move.promotion_type = type
		this.finish_move(this.promotion_move)
		this.promotion_move = null
		this.status = "playing"
	}

	public cancel_promotion(): void {
		this.promotion_move = null
		this.selected_coord = null
		this.possible_moves = []
		this.status = "playing"
	}

	public reset(): void {
		this.current_color = "white"
		this.status = "playing"
		this.selected_coord = null
		this.possible_moves = []
		this.promotion_move = null
		this.captures = []
		this.turn = 0
		this.resigned_player = null
		this.is_ended = false
		this.move_history.clear()
		this.board.reset()
		this.compute_all_moves()
		this.switch_player_colors()
	}

	public switch_player_colors() {
		Object.values(this.players).forEach((player) => {
			player.color = player.color === "white" ? "black" : "white"
			player.turn = 1 - player.turn
		})
	}

	private compute_all_moves(): void {
		let number_all_moves = 0
		const all_moves: Record<Coord_Key, Move[]> = {}
		for (const coord of this.board.coords) {
			const piece = this.board.get(coord)
			if (!piece || piece.color !== this.current_color) continue
			const moves = piece.get_save_moves(
				coord,
				this.board,
				this.move_history
			)
			all_moves[key(coord)] = moves
			number_all_moves += moves.length
		}
		this.all_moves = all_moves
		this.number_all_moves = number_all_moves
	}

	public resign(socket_id: string): void {
		const player = this.players[socket_id]
		if (!player) return
		this.status = "resigned"
		this.resigned_player = player
		this.is_ended = true
	}

	public draw(): void {
		this.status = "drawn"
		this.is_ended = true
	}
}
