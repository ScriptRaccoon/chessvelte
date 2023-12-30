import { StatusManager } from "./StatusManager"

describe("StatusManager", () => {
	let status: StatusManager

	beforeEach(() => {
		status = new StatusManager()
	})

	describe("status", () => {
		it("is waiting by default", () => {
			expect(status.status).toBe("waiting")
		})
	})

	describe("current_color", () => {
		it("is white by default", () => {
			expect(status.current_color).toBe("white")
		})
	})

	describe("during_draw_offer", () => {
		it("is false by default", () => {
			expect(status.during_draw_offer).toBe(false)
		})
	})

	describe("is_ended", () => {
		it("is false by default", () => {
			expect(status.is_ended).toBe(false)
		})
	})

	describe("start", () => {
		it("sets status to playing", () => {
			expect(status.is_started).toBe(false)
			status.start()
			expect(status.status).toBe("playing")
			expect(status.is_playing).toBe(true)
		})
	})

	describe("switch_color", () => {
		it("switches color", () => {
			expect(status.current_color).toBe("white")
			status.switch_color()
			expect(status.current_color).toBe("black")
			status.switch_color()
			expect(status.current_color).toBe("white")
		})
	})

	describe("reset", () => {
		it("resets status", () => {
			status.start()
			status.switch_color()
			status.resign("white")
			status.reset()
			expect(status.status).toBe("playing")
			expect(status.current_color).toBe("white")
		})
	})

	describe("resign", () => {
		it("sets status to resigned and ends the game", () => {
			status.resign("white")
			expect(status.status).toBe("resigned-white")
			expect(status.is_ended).toBe(true)
		})
	})

	describe("draw", () => {
		it("sets status to drawn and ends the game", () => {
			status.draw()
			expect(status.status).toBe("drawn")
			expect(status.is_ended).toBe(true)
		})
	})

	describe("initialize_draw", () => {
		it("sets during_draw_offer to true", () => {
			status.initialize_draw()
			expect(status.during_draw_offer).toBe(true)
		})
	})

	describe("cancel_draw", () => {
		it("sets during_draw_offer to false", () => {
			status.initialize_draw()
			status.cancel_draw()
			expect(status.during_draw_offer).toBe(false)
		})
	})

	describe("is_allowed_to_move", () => {
		it("returns true if playing and color is current_color", () => {
			expect(status.is_allowed_to_move("white")).toBe(false)
			expect(status.is_allowed_to_move("black")).toBe(false)
			status.start()
			expect(status.is_allowed_to_move("white")).toBe(true)
			expect(status.is_allowed_to_move("black")).toBe(false)
			status.switch_color()
			expect(status.is_allowed_to_move("white")).toBe(false)
			expect(status.is_allowed_to_move("black")).toBe(true)
		})
	})

	describe("end_with", () => {
		it("sets status to ended and ends the game", () => {
			status.end_with("resigned-white")
			expect(status.status).toBe("resigned-white")
			expect(status.is_ended).toBe(true)
		})
	})

	describe("outcome", () => {
		it("returns the outcome of the game", () => {
			expect(status.outcome).toBe("")
			status.resign("white")
			expect(status.outcome).toBe("White has resigned")
			status.reset()
			status.draw()
			expect(status.outcome).toBe("Drawn by agreement")
			status.reset()
			status.end_with("checkmate-white")
			expect(status.outcome).toBe("Checkmate against White")
		})
	})
})
