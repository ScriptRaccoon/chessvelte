import { OUTCOME_MESSAGES } from "$shared/config"
import { Color, Game_Status } from "$shared/types"
import { get_other_color } from "$shared/utils"

/**
 * This class is responsible for managing the status of the chess game.
 */
export class StatusManager {
	private _status: Game_Status = "waiting"
	private _current_color: Color = "white"
	private _during_draw_offer: boolean = false
	private _is_ended: boolean = false

	// GETTERS

	public get status(): Game_Status {
		return this._status
	}

	public get current_color(): Color {
		return this._current_color
	}

	public get during_draw_offer(): boolean {
		return this._during_draw_offer
	}

	public get is_ended(): boolean {
		return this._is_ended
	}

	public get is_started(): boolean {
		return this.status !== "waiting"
	}

	public get is_playing(): boolean {
		return this.is_started && !this._is_ended
	}

	public get outcome(): string {
		return OUTCOME_MESSAGES[this.status]
	}

	// METHODS

	public start(): void {
		this._status = "playing"
	}

	public switch_color(): void {
		this._current_color = get_other_color(this.current_color)
	}

	public reset(): void {
		this._current_color = "white"
		this._status = "playing"
		this._is_ended = false
		this._during_draw_offer = false
	}

	public resign(color: Color): void {
		this._status = `resigned-${color}`
		this._is_ended = true
	}

	public draw(): void {
		this._status = "drawn"
		this._is_ended = true
	}

	public initialize_draw(): void {
		this._during_draw_offer = true
	}

	public cancel_draw(): void {
		this._during_draw_offer = false
	}

	public is_allowed_to_move(color: Color): boolean {
		return this.is_playing && color === this.current_color
	}

	public end_with(status: Game_Status): void {
		this._is_ended = true
		this._status = status
	}
}
