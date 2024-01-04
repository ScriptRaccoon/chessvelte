import type { Piece_Info } from "$shared/types"
import type { Capture } from "$server/types.server"

/**
 * This class is responsible for storing the captured pieces.
 */
export class CaptureHistory {
	private captures: Capture[] = []

	add(capture: Capture): void {
		this.captures.push(capture)
	}

	get pieces(): Piece_Info[] {
		return this.captures.map((capture) => capture.piece.info(capture.coord))
	}

	clear(): void {
		this.captures = []
	}
}
