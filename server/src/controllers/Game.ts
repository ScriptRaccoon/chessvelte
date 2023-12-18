import type {
	Color,
	Coord,
	Coord_Key,
	GAME_STATUS,
	Game_State,
	PIECE_TYPE,
} from "$shared/types"
import { MoveHistory } from "./MoveHistory"
import { Board } from "./Board"
import { capitalize, get_other_color, key } from "$shared/utils"
import { Capture, Move } from "../types.server"
import { Player } from "./Player"
import { PlayerGroup } from "./PlayerGroup"

export class Game {
	private static dictionary: Record<string, Game> = {}

	public static get_by_id(id: string): Game | undefined {
		if (typeof id === "string" && id.length > 0) {
			return Game.dictionary[id]
		}
	}

	public id: string
	private move_history: MoveHistory = new MoveHistory()
	private board: Board = new Board()
	private status: GAME_STATUS = "waiting"
	private all_moves: Record<Coord_Key, Move[]> = {}
	private number_all_moves: number = 0
	private possible_moves: Move[] = []
	private selected_coord: Coord | null = null
	private promotion_move: Move | null = null
	private captures: Capture[] = []
	private players: Record<string, Player> = {}
	private resigned_player: Player | null = null
	public is_ended: boolean = false
	private current_color: Color = "white"
	private player_group = new PlayerGroup()

	constructor(id: string) {
		this.id = id
		this.compute_all_moves()
		Game.dictionary[id] = this
	}

	public get state(): Game_State {
		return {
			status: this.status,
			is_started: this.is_started,
			is_ended: this.is_ended,
			is_playing: this.is_playing,
			outcome: this.outcome,
			current_color: this.current_color,
			board_map: this.board.reduced_map,
			selected_coord: this.selected_coord,
			possible_targets: this.possible_targets,
			captured_pieces: this.captured_pieces,
			player_names: this.player_group.player_names,
		}
	}

	private get is_started(): boolean {
		return this.status !== "waiting"
	}

	public get is_playing(): boolean {
		return this.is_started && !this.is_ended
	}

	private get outcome(): string {
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

	private get possible_targets(): Coord[] {
		return this.possible_moves.map((move) => move.end)
	}

	private get captured_pieces() {
		return this.captures.map((capture) => capture.piece.to_display())
	}

	public add_player(
		socket_id: string,
		client_id: string,
		name: string,
	): { is_new: boolean; player: Player } | null {
		const player_info = this.player_group.add(socket_id, client_id, name)
		if (this.status === "waiting" && this.player_group.is_full) {
			this.status = "playing"
		}
		return player_info
	}

	public get_player(socket_id: string): Player {
		return this.player_group.get_by_id(socket_id)
	}

	public list_of_sockets(): string[] {
		return this.player_group.keys
	}

	public is_allowed_to_move(socket_id: string): boolean {
		return this.get_player(socket_id).color === this.current_color
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
			(move) => key(move.end) == key(coord),
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

	private finish_move(move: Move): void {
		this.execute_move(move)
		this.switch_color()
		this.compute_all_moves()
		this.check_for_ending()
	}

	private execute_move(move: Move): void {
		this.move_history.push(move)
		const capture = this.board.apply_move(move)
		if (capture) {
			this.captures.push(capture)
		}
	}

	private switch_color(): void {
		this.selected_coord = null
		this.possible_moves = []
		this.current_color = get_other_color(this.current_color)
	}

	private check_for_ending(): void {
		if (this.number_all_moves > 0) return
		const checked = this.board.is_check(this.current_color)
		this.is_ended = true
		this.status = checked ? "checkmate" : "stalemate"
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
		this.resigned_player = null
		this.is_ended = false
		this.move_history.clear()
		this.board.reset()
		this.compute_all_moves()
	}

	public switch_player_colors(): void {
		this.player_group.switch_colors()
	}

	private compute_all_moves(): void {
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

	public resign(socket_id: string): void {
		const player = this.get_player(socket_id)
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
