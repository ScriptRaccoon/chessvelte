import { PlayerGroup } from "./PlayerGroup"

const mocked_random = jest.spyOn(global.Math, "random")

describe("PlayerGroup class", () => {
	let player_group: PlayerGroup

	beforeEach(() => {
		player_group = new PlayerGroup()
	})

	it("is full when it has two players", () => {
		expect(player_group.is_full).toBe(false)
		player_group.add("123", "xyz", "john")
		expect(player_group.is_full).toBe(false)
		player_group.add("456", "uvw", "marie")
		expect(player_group.is_full).toBe(true)
	})

	it("offers to access the list of ids", () => {
		player_group.add("123", "xyz", "john")
		player_group.add("456", "uvw", "marie")
		expect(player_group.keys).toEqual(["123", "456"])
	})

	it("offers to access a player by their id", () => {
		player_group.add("123", "xyz", "john")
		expect(player_group.get("123")?.name === "john")
	})

	it("'add' returns whether the player is new", () => {
		expect(player_group.add("123", "xyz", "john").is_new).toBe(true)
		expect(player_group.add("456", "xyz", "john").is_new).toBe(false)
	})

	it("'add' returns whether the player has been added successfully", () => {
		expect(player_group.add("123", "abc", "john").success).toBe(true)
		expect(player_group.add("456", "def", "marie").success).toBe(true)
		expect(player_group.add("789", "ghi", "helen").success).toBe(false)
	})

	it("'adds' returns the added player", () => {
		const player = player_group.add("123", "abc", "john").player
		expect(player).toBeDefined()
		expect(player!.name).toBe("john")
	})

	describe("chooses a random, but different color for each player", () => {
		it("black can appear first", () => {
			mocked_random.mockReturnValueOnce(0.6)
			player_group.add("123", "xyz", "john")
			player_group.add("456", "uvw", "marie")
			const john = player_group.get("123")
			const marie = player_group.get("456")
			expect(john).toBeDefined()
			expect(marie).toBeDefined()
			expect(john!.color).toBe("black")
			expect(marie!.color).toBe("white")
		})

		it("white can appear first", () => {
			mocked_random.mockReturnValueOnce(0.1)
			player_group.add("123", "xyz", "bob")
			player_group.add("456", "uvw", "tamara")
			const bob = player_group.get("123")
			const tamara = player_group.get("456")
			expect(bob!.color).toBe("white")
			expect(tamara!.color).toBe("black")
		})
	})

	it("lists the names of the players, white first", () => {
		mocked_random.mockReturnValueOnce(0.6)
		player_group.add("123", "xyz", "john")
		player_group.add("456", "uvw", "marie")
		expect(player_group.player_names).toEqual(["marie", "john"])
	})

	it("chooses '?' for naming non-present players", () => {
		expect(player_group.player_names).toEqual(["?", "?"])
		mocked_random.mockReturnValueOnce(0.6)
		player_group.add("123", "xyz", "john")
		expect(player_group.player_names).toEqual(["?", "john"])
	})

	it("switches the colors of the players", () => {
		mocked_random.mockReturnValueOnce(0.6)
		player_group.add("123", "xyz", "john")
		player_group.add("456", "uvw", "marie")
		const john = player_group.get("123")
		const marie = player_group.get("456")
		expect(john!.color).toBe("black")
		expect(marie!.color).toBe("white")
		player_group.switch_colors()
		expect(john!.color).toBe("white")
		expect(marie!.color).toBe("black")
	})

	it("produces start messages for the game", () => {
		mocked_random.mockReturnValueOnce(0.1)
		player_group.add("123", "xyz", "John")
		expect(player_group.start_messages).toBeFalsy()
		player_group.add("456", "uvw", "Marie")
		expect(player_group.start_messages).toEqual([
			"Game has started",
			"John plays White",
			"Marie plays Black",
		])
	})
})
