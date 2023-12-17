import { Pairing } from "./Pairing"

beforeEach(() => {
	Pairing.dictionary = {}
})

describe("Pairing class", () => {
	describe("exists", () => {
		it("checks if a pairing exists", () => {
			new Pairing("123")
			expect(Pairing.exists("123")).toBe(true)
			expect(Pairing.exists("567")).toBe(false)
		})
	})
	describe("get_by_id", () => {
		it("returns the pairing of the given ID if it exists", () => {
			const pairing = new Pairing("123")
			expect(Pairing.get_by_id("123")).toBe(pairing)
		})
		it("returns undefined for a pairing that does not exist", () => {
			expect(Pairing.get_by_id("123")).toBeUndefined()
		})
	})

	describe("add_player", () => {
		it("adds a player to the list of players", () => {
			const pairing = new Pairing("123")
			pairing.add_player("abc")
			pairing.add_player("def")
			expect(pairing.players).toEqual(["abc", "def"])
		})

		it("does not do anything when 2 players are already in", () => {
			const pairing = new Pairing("123")
			pairing.add_player("abc")
			pairing.add_player("def")
			pairing.add_player("uvw")
			expect(pairing.players).toEqual(["abc", "def"])
		})
	})

	describe("has_player", () => {
		it("checks if a player belongs to the list of players", () => {
			const pairing = new Pairing("123")
			pairing.add_player("abc")
			expect(pairing.players.includes("abc")).toBe(true)
			expect(pairing.players.includes("def")).toBe(false)
		})
	})
	describe("is_full", () => {
		it("is true when the game has at least 2 players", () => {
			const pairing = new Pairing("123")
			expect(pairing.is_full).toBe(false)
			pairing.add_player("abc")
			expect(pairing.is_full).toBe(false)
			pairing.add_player("def")
			expect(pairing.is_full).toBe(true)
		})
	})
})
