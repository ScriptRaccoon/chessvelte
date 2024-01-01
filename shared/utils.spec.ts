import { Coord, Piece_State } from "./types"
import * as utils from "./utils"

const mocked_random = jest.spyOn(Math, "random")

afterAll(() => {
	jest.clearAllMocks()
})

describe("utils", () => {
	describe("generate_short_id", () => {
		it("returns an id of the correct type and length", () => {
			const id = utils.generate_short_id(6)
			expect(typeof id).toBe("string")
			expect(id.length).toBe(6)
		})

		it("returns a random string", () => {
			mocked_random
				.mockReturnValueOnce(0.1)
				.mockReturnValueOnce(0.5)
				.mockReturnValueOnce(0.6)
				.mockReturnValueOnce(0.2)

			const id = utils.generate_short_id(4)
			expect(id).toBe("DSVG")
		})
	})

	describe("key", () => {
		it("maps a coordinate to its string representation", () => {
			expect(utils.key([0, 0])).toEqual("00")
			expect(utils.key([2, 3])).toEqual("23")
		})

		it("inverts the unkey function", () => {
			expect(utils.key(utils.unkey("45"))).toEqual("45")
			expect(utils.unkey(utils.key([2, 1]))).toEqual([2, 1])
		})
	})

	describe("unkey", () => {
		it("maps a coordinate key to the coordinate", () => {
			expect(utils.unkey("00")).toEqual([0, 0])
			expect(utils.unkey("23")).toEqual([2, 3])
		})
	})

	describe("gen_coord", () => {
		it("generates a coordinate from two numbers", () => {
			expect(utils.gen_coord(2, 3)).toEqual([2, 3])
		})
	})

	describe("has_coord", () => {
		it("checks if a coordinate is contained in a list of coordinates", () => {
			// prettier-ignore
			const coords: Coord[] = [[0, 0], [1, 1], [2, 3]]
			expect(utils.has_coord(coords, [1, 1])).toBe(true)
			expect(utils.has_coord(coords, [0, 1])).toBe(false)
		})
	})

	describe("is_valid", () => {
		it("returns false for invalid coordinates", () => {
			expect(utils.is_valid([-1, -1])).toBe(false)
			expect(utils.is_valid([-1, 1])).toBe(false)
			expect(utils.is_valid([8, 1])).toBe(false)
			expect(utils.is_valid([1, 9])).toBe(false)
		})

		it("returns true for valid coordinates", () => {
			expect(utils.is_valid([1, 1])).toBe(true)
			expect(utils.is_valid([6, 7])).toBe(true)
			expect(utils.is_valid([5, 0])).toBe(true)
		})
	})

	describe("piece_str", () => {
		it("returns the image source of a piece", () => {
			expect(utils.piece_src("king", "white")).toBe("../sprite.svg#king_white")
			expect(utils.piece_src("queen", "black")).toBe(
				"../sprite.svg#queen_black",
			)
		})
	})

	describe("typed keys", () => {
		it("returns the keys of an object", () => {
			const obj = { a: 1, b: 2, c: 3 }
			expect(utils.typed_keys(obj)).toEqual(["a", "b", "c"])
		})
	})

	describe("map_object", () => {
		it("transforms the values of an object", () => {
			const obj: Record<string, number> = { a: 1, b: 2, c: 3 }
			const transform = (value: number) => value * 2
			const expected = { a: 2, b: 4, c: 6 }
			expect(utils.map_object(obj, transform)).toEqual(expected)
		})
	})

	describe("deep_copy", () => {
		class List<T> {
			constructor(public data: Array<T>) {}
			copy(): List<T> {
				return new List(JSON.parse(JSON.stringify(this.data)))
			}
		}
		const original: Record<string, List<number>> = {
			"11": new List([1, 2, 3]),
		}
		const copy = utils.deep_copy(original)

		it("creates a deep copy", () => {
			expect(copy["11"]?.data).toEqual(original["11"].data)
			expect(copy["11"] == original["11"]).toBe(false)
			expect(copy !== original)
		})

		it("changes to the copy do not affect the original", () => {
			copy["11"]?.data.push(4)
			expect(copy["11"]?.data.includes(4)).toBe(true)
			expect(original["11"]?.data.includes(4)).toBe(false)
		})

		it("also works when values are undefined", () => {
			const original: { [x in string]?: List<number> } = {
				"11": new List([1, 2, 3]),
				"12": undefined,
			}
			const copy = utils.deep_copy(original)
			expect(copy["12"]).toBe(undefined)
		})
	})

	describe("inner_range", () => {
		it("maps (2,5) to the list [3,4]", () => {
			expect(utils.inner_range(2, 5)).toEqual([3, 4])
		})

		it("maps (5,1) to the list [2,3,4]", () => {
			expect(utils.inner_range(5, 1)).toEqual([2, 3, 4])
		})

		it("maps (1,2) to the list []", () => {
			expect(utils.inner_range(1, 2)).toEqual([])
		})
	})

	describe("capitalize", () => {
		it("transforms 'black' to 'Black'", () => {
			expect(utils.capitalize("black")).toBe("Black")
		})

		it("transforms 'tEsT' to 'TEsT'", () => {
			expect(utils.capitalize("tEsT")).toBe("TEsT")
		})
	})

	describe("get_other_color", () => {
		it("maps white to black and vice versa", () => {
			expect(utils.get_other_color("white")).toBe("black")
			expect(utils.get_other_color("black")).toBe("white")
		})
	})

	describe("get_random_color", () => {
		it("generates random colors", () => {
			mocked_random
				.mockReturnValueOnce(0.1)
				.mockReturnValueOnce(0.2)
				.mockReturnValueOnce(0.7)
				.mockReturnValueOnce(0.9)
			expect(utils.get_random_color()).toBe("white")
			expect(utils.get_random_color()).toBe("white")
			expect(utils.get_random_color()).toBe("black")
			expect(utils.get_random_color()).toBe("black")
		})
	})

	describe("scroll_to_bottom", () => {
		it("scrolls to the bottom of the HTML element", () => {
			const element_mock: Partial<HTMLElement> = {
				scrollTop: 0,
				scrollHeight: 100,
			}
			utils.scroll_to_bottom(element_mock as HTMLElement)
			expect(element_mock.scrollTop).toBe(100)
		})
	})

	describe("rotate", () => {
		// prettier-ignore
		const samples: [Coord, Coord][] = [
		[[0, 0], [7, 7]],
		[[1, 0], [6, 7]],
		[[0, 7], [7, 0]],
		[[2, 6], [5, 1]],
		[[7, 7], [0, 0]],
	]

		it.each(samples)("maps %p to %p", (coord, expected) => {
			expect(utils.rotate(coord as Coord)).toEqual(expected)
		})

		it("leaves coordinates untouched when specified", () => {
			expect(utils.rotate([5, 6], false)).toEqual([5, 6])
			expect(utils.rotate([0, 0], false)).toEqual([0, 0])
		})
	})

	describe("abridge", () => {
		it("does not change strings which are short enough (1)", () => {
			const sample = "sample"
			expect(utils.abridge(sample, 6)).toBe(sample)
		})

		it("does not change strings which are short enough (2)", () => {
			const sample = "lalalala"
			expect(utils.abridge(sample, 10)).toBe(sample)
		})

		it("abridges a long string and adds '...' onto the end (1)", () => {
			const sample = "toolongname"
			expect(utils.abridge(sample, 6)).toBe("tool...")
		})

		it("abridges a long string and adds '...' onto the end (2)", () => {
			const sample = "miraculix"
			expect(utils.abridge(sample, 8)).toBe("miracu...")
		})
	})

	describe("display_large_number", () => {
		it("should transform numbers to strings", () => {
			expect(typeof utils.display_large_number(1)).toBe("string")
			expect(typeof utils.display_large_number(20)).toBe("string")
		})
		it("should not change numbers < 10", () => {
			expect(utils.display_large_number(1)).toBe("1")
			expect(utils.display_large_number(9)).toBe("9")
		})
		it("should return '9+' for numbers >= 10", () => {
			expect(utils.display_large_number(10)).toBe("9+")
			expect(utils.display_large_number(20)).toBe("9+")
		})
	})

	describe("is_valid_promotion_choice", () => {
		it("should return true for valid promotion choices", () => {
			expect(utils.is_valid_promotion_choice("queen")).toBe(true)
			expect(utils.is_valid_promotion_choice("rook")).toBe(true)
			expect(utils.is_valid_promotion_choice("bishop")).toBe(true)
			expect(utils.is_valid_promotion_choice("knight")).toBe(true)
		})
		it("should return false for invalid promotion choices", () => {
			expect(utils.is_valid_promotion_choice("king")).toBe(false)
			expect(utils.is_valid_promotion_choice("pawn")).toBe(false)
			expect(utils.is_valid_promotion_choice(undefined)).toBe(false)
		})
	})

	describe("filter_pieces", () => {
		it("should filter and sort pieces by color and value", () => {
			const pieces: Piece_State[] = [
				{ type: "pawn", color: "white", value: 1, coord: [0, 1], id: "1" },
				{ type: "queen", color: "white", value: 9, coord: [0, 1], id: "2" },
				{ type: "pawn", color: "black", value: 1, coord: [0, 1], id: "3" },
				{ type: "bishop", color: "white", value: 3, coord: [0, 1], id: "4" },
				{ type: "rook", color: "black", value: 5, coord: [0, 1], id: "5" },
			]

			const filtered = utils.filter_pieces(pieces, "white")

			expect(filtered).toEqual([
				{ type: "pawn", color: "white", value: 1, coord: [0, 1], id: "1" },
				{ type: "bishop", color: "white", value: 3, coord: [0, 1], id: "4" },
				{ type: "queen", color: "white", value: 9, coord: [0, 1], id: "2" },
			])
		})
	})
})
