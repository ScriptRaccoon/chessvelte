import type { Capture } from "$server/types.server"
import { CaptureHistory } from "./CaptureHistory"
import { create_piece } from "$server/pieces/create_piece"
import { generate_short_id } from "$shared/utils"

jest.mock("$shared/utils", () => ({
	...jest.requireActual("$shared/utils"),
	generate_short_id: jest.fn(),
}))

const id_mock = generate_short_id as jest.Mock

describe("CaptureHistory class", () => {
	let capture_history: CaptureHistory
	let capture: Capture

	beforeEach(() => {
		id_mock.mockReturnValue("123")
		capture_history = new CaptureHistory()
		capture = {
			coord: [2, 3],
			piece: create_piece("pawn", "white"),
		}
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it("'add' should add a capture to the list of pieces", () => {
		capture_history.add(capture)
		expect(capture_history.pieces.length).toBe(1)
		expect(capture_history.pieces).toEqual([
			{ type: "pawn", color: "white", coord: [2, 3], value: 1, id: "123" },
		])
	})

	it("'clear' should clear all captures", () => {
		capture_history.add(capture)
		capture_history.clear()
		expect(capture_history.pieces).toEqual([])
	})
})
