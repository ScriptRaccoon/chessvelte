import { Pairing } from "./Pairing"

beforeEach(() => {
	Pairing.clear()
})

describe("Pairing class", () => {
	describe("exists", () => {
		it("checks if a pairing exists", () => {
			new Pairing("123")
			expect(Pairing.exists("123")).toBe(true)
			expect(Pairing.exists("567")).toBe(false)
		})
	})

	describe("get", () => {
		it("returns the pairing of the given ID if it exists", () => {
			const pairing = new Pairing("123")
			expect(Pairing.get("123")).toBe(pairing)
		})
		it("returns 'undefined' for a pairing that does not exist", () => {
			expect(Pairing.get("123")).toBeUndefined()
		})
	})

	describe("add_player", () => {
		it("adds a player to the list of players", () => {
			const pairing = new Pairing("123")
			pairing.add_player("abc")
			pairing.add_player("def")
			expect(pairing.get_players()).toEqual(["abc", "def"])
		})

		it("does not do anything when 2 players are already paired", () => {
			const pairing = new Pairing("123")
			pairing.add_player("abc")
			pairing.add_player("def")
			pairing.add_player("uvw")
			expect(pairing.get_players()).toEqual(["abc", "def"])
		})
	})

	describe("has_player", () => {
		it("checks if a player belongs to the list of players", () => {
			const pairing = new Pairing("123")
			pairing.add_player("abc")
			expect(pairing.has_player("abc")).toBe(true)
			expect(pairing.has_player("def")).toBe(false)
		})
	})

	describe("is_full", () => {
		it("is true when the game has 2 players", () => {
			const pairing = new Pairing("123")
			expect(pairing.is_full).toBe(false)
			pairing.add_player("abc")
			expect(pairing.is_full).toBe(false)
			pairing.add_player("def")
			expect(pairing.is_full).toBe(true)
		})
	})

	describe("clear", () => {
		it("removes all existing Pairings", () => {
			new Pairing("123")
			new Pairing("456")
			Pairing.clear()
			expect(Pairing.exists("123")).toBe(false)
			expect(Pairing.exists("456")).toBe(false)
			expect(Pairing.exists("789")).toBe(false)
		})
	})

	describe("get_or_create_by_id", () => {
		it("should return existing Pairing if it exists", () => {
			const pairing = new Pairing("123")
			expect(Pairing.get_or_create_by_id("123")).toBe(pairing)
		})

		it("should create new Pairing if it does not exist", () => {
			const pairing = Pairing.get_or_create_by_id("456")
			expect(pairing).toBeDefined()
			expect(pairing).toBeInstanceOf(Pairing)
		})
	})
})
