import { PlayerGroup } from "./PlayerGroup"

const mocked_random = jest.spyOn(global.Math, "random")

describe("PlayerGroup class", () => {
	it("is full when it has two players", () => {
		const player_group = new PlayerGroup()
		expect(player_group.is_full).toBe(false)
		player_group.add("123", "xyz", "john")
		expect(player_group.is_full).toBe(false)
		player_group.add("456", "uvw", "marie")
		expect(player_group.is_full).toBe(true)
	})

	it("offers to access the list of ids", () => {
		const player_group = new PlayerGroup()
		player_group.add("123", "xyz", "john")
		player_group.add("456", "uvw", "marie")
		expect(player_group.keys).toEqual(["123", "456"])
	})

	it("offers to access a player by their id", () => {
		const player_group = new PlayerGroup()
		player_group.add("123", "xyz", "john")
		expect(player_group.get_by_id("123").name === "john")
	})

	describe("chooses a random, but different color for each player", () => {
		it("black can appear first", () => {
			const player_group_1 = new PlayerGroup()
			mocked_random.mockReturnValueOnce(0.6)
			player_group_1.add("123", "xyz", "john")
			player_group_1.add("456", "uvw", "marie")
			const john = player_group_1.get_by_id("123")
			const marie = player_group_1.get_by_id("456")
			expect(john.color).toBe("black")
			expect(marie.color).toBe("white")
		})

		it("white can appear first", () => {
			const player_group_2 = new PlayerGroup()
			mocked_random.mockReturnValueOnce(0.1)
			player_group_2.add("123", "xyz", "bob")
			player_group_2.add("456", "uvw", "tamara")
			const bob = player_group_2.get_by_id("123")
			const tamara = player_group_2.get_by_id("456")
			expect(bob.color).toBe("white")
			expect(tamara.color).toBe("black")
		})
	})

	it("lists the names of the players, white first", () => {
		const player_group = new PlayerGroup()
		mocked_random.mockReturnValueOnce(0.6)
		player_group.add("123", "xyz", "john")
		player_group.add("456", "uvw", "marie")
		expect(player_group.player_names).toEqual(["marie", "john"])
	})

	it("chooses '?' for naming non-present players", () => {
		const player_group = new PlayerGroup()
		expect(player_group.player_names).toEqual(["?", "?"])
		mocked_random.mockReturnValueOnce(0.6)
		player_group.add("123", "xyz", "john")
		expect(player_group.player_names).toEqual(["?", "john"])
	})

	it("switches the colors of the players", () => {
		const player_group = new PlayerGroup()
		mocked_random.mockReturnValueOnce(0.6)
		player_group.add("123", "xyz", "john")
		player_group.add("456", "uvw", "marie")
		const john = player_group.get_by_id("123")
		const marie = player_group.get_by_id("456")
		expect(john.color).toBe("black")
		expect(marie.color).toBe("white")
		player_group.switch_colors()
		expect(john.color).toBe("white")
		expect(marie.color).toBe("black")
	})
})
