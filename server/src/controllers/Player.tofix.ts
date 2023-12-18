/**
 * jest currently does not understand the path aliases in Player.ts
 */

// import { Player } from "./Player"

// describe("Player class", () => {
// 	it("constructs a player with prescribed properties", () => {
// 		const player = new Player("123", "white", "mary")
// 		expect(player.client_id).toBe("123")
// 		expect(player.color).toBe("white")
// 		expect(player.name).toBe("mary")
// 	})
// })

// describe("switch_color", () => {
// 	it("changes the color of a player from white to black and vice versa", () => {
// 		const player = new Player("123", "white", "mary")
// 		player.switch_color()
// 		expect(player.color).toBe("black")
// 		player.switch_color()
// 		expect(player.color).toBe("white")
// 	})
// })

// describe("set_name", () => {
// 	it("sets the name accordingly to the input", () => {
// 		const player = new Player("123", "white", "mary")
// 		player.set_name("maria")
// 		expect(player.name).toBe("maria")
// 	})
// })
