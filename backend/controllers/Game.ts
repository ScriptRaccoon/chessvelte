import type {
	Callback,
	Capture,
	Color,
	Coord,
	Coord_Key,
	GAME_STATUS,
	Move
} from "../types"
import type { Piece } from "./Piece"
import { MoveHistory } from "./MoveHistory"
import { Board } from "./Board"
import { key } from "../coordinates"
import type { Game_State } from "$lib/types"

export type Player = {
	client_id: string
	socket_id: string
	turn: number
}

export class Game {
	static dictionary: Record<string, Game> = {}

	static get_by_id(id: string): Game | undefined {
		return Game.dictionary[id]
	}

	static find_by_player(socket_id: string): Game | undefined {
		return Object.values(Game.dictionary).find((game) =>
			game.players.some((player) => player.socket_id === socket_id)
		)
	}

	public id: string
	public turn: number = 0
	private move_history: MoveHistory = new MoveHistory()
	public board: Board = new Board()
	public current_color: Color = "white"
	public status: GAME_STATUS = "waiting"
	private all_moves: Record<Coord_Key, Move[]> = {}
	private number_all_moves: number = 0
	public possible_moves: Move[] = []
	public move_start_coord: Coord | null = null
	public promotion_move: Move | null = null
	public captures: Capture[] = []
	public players: Player[] = []

	constructor(id: string) {
		this.id = id
		this.compute_all_moves()
		Game.dictionary[id] = this
	}

	get state(): Game_State {
		return {
			turn: this.turn,
			selected_coord: this.move_start_coord,
			possible_targets: this.possible_moves.map((move) => move.end),
			board_map: this.board.reduced_map,
			status: this.status,
			captured_pieces: this.captures.map((capture) => capture.piece)
		}
	}

	start(): void {
		this.status = "playing"
	}

	add_player(socket_id: string, client_id: string): Player | null {
		const player: Player | undefined = this.players.find(
			(player) => player.client_id === client_id
		)

		if (player) {
			player.socket_id = socket_id
			return player
		}

		if (this.status != "waiting") return null

		const turn =
			this.players.length === 0
				? Number(Math.random() < 0.5)
				: 1 - this.players[0].turn

		const new_player: Player = { socket_id, client_id, turn }
		this.players.push(new_player)

		if (this.players.length === 2) {
			this.status = "ready"
		}

		return new_player
	}

	switch_turn() {
		this.turn = 1 - this.turn
	}

	public get has_ended(): boolean {
		return this.status === "checkmate" || this.status === "stalemate"
	}

	public select_coord(coord: Coord, callback?: Callback): void {
		if (this.has_ended) return
		const piece = this.board.get(coord)
		if (this.move_start_coord) {
			if (key(this.move_start_coord) == key(coord)) {
				this.cancel_move()
			} else if (piece?.color === this.current_color) {
				this.start_move(coord)
			} else {
				this.generate_move(coord, callback)
			}
		} else if (piece?.color === this.current_color) {
			this.start_move(coord)
		}
	}

	private cancel_move(): void {
		this.move_start_coord = null
		this.possible_moves = []
	}

	private start_move(coord: Coord): void {
		this.move_start_coord = coord
		this.possible_moves = this.all_moves[key(coord)]
	}

	private generate_move(coord: Coord, callback?: Callback): void {
		if (!this.move_start_coord) return
		const move = this.possible_moves?.find(
			(move) => key(move.end) == key(coord)
		)
		if (!move) return
		if (move.type === "promotion") {
			this.promotion_move = move
		} else {
			this.finish_move(move, callback)
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
		this.move_start_coord = null
		this.possible_moves = []
		this.turn = 1 - this.turn
	}

	private update_status(): void {
		const checked = this.board.is_check(this.current_color)
		if (this.number_all_moves === 0) {
			this.status = checked ? "checkmate" : "stalemate"
		} else {
			this.status = checked ? "check" : "playing"
		}
	}

	private finish_move(move: Move, callback?: Callback): void {
		this.execute_move(move)
		this.switch_color()
		this.compute_all_moves()
		this.update_status()
		if (callback) callback()
	}

	public finish_promotion(type: Piece["type"], callback: Callback): void {
		if (!this.promotion_move) return
		this.promotion_move.promotion_type = type
		this.finish_move(this.promotion_move, callback)
		this.promotion_move = null
	}

	public cancel_promotion(): void {
		this.promotion_move = null
		this.move_start_coord = null
		this.possible_moves = []
	}

	public reset(): void {
		this.current_color = "white"
		this.status = "playing"
		this.move_start_coord = null
		this.possible_moves = []
		this.promotion_move = null
		this.captures = []
		this.turn = 0
		this.move_history.clear()
		this.board.reset()
		this.compute_all_moves()
	}

	compute_all_moves(): void {
		let number_all_moves = 0
		const all_moves: Record<Coord_Key, Move[]> = {}
		for (const coord of this.board.coords) {
			const piece = this.board.get(coord)
			if (!piece || piece.color !== this.current_color) continue
			const moves = piece.get_save_moves(coord, this.board, this.move_history)
			all_moves[key(coord)] = moves
			number_all_moves += moves.length
		}
		this.all_moves = all_moves
		this.number_all_moves = number_all_moves
	}
}
