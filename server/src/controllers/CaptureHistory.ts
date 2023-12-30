import { Piece_State } from "$shared/types"
import { Capture } from "../types.server"

/**
 * This class is responsible for storing the captured pieces.
 */
export class CaptureHistory {
	private captures: Capture[] = []

	add(capture: Capture): void {
		this.captures.push(capture)
	}

	get pieces(): Piece_State[] {
		return this.captures.map((capture) => capture.piece.state(capture.coord))
	}

	clear(): void {
		this.captures = []
	}
}
