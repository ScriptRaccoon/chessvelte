import { COORDINATES } from "./config"

describe("coordinates", () => {
	it("is an array", () => {
		expect(Array.isArray(COORDINATES)).toBe(true)
	})

	it("contains the expected values", () => {
		// prettier-ignore
		const coords = [[0, 0], [2, 1], [5, 6], [7, 7]]
		for (const coord of coords) {
			const inside = COORDINATES.some(
				(_coord) => _coord.toString() === coord.toString(),
			)
			expect(inside).toBe(true)
		}
	})

	it("does not contain other values", () => {
		// prettier-ignore
		const coords = [[-1, -1], [8, 7], [7, 8]]
		for (const coord of coords) {
			const inside = COORDINATES.some(
				(_coord) => _coord.toString() === coord.toString(),
			)
			expect(inside).toBe(false)
		}
	})
})
