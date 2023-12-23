import { Coord } from "./types"
import {
	capitalize,
	deep_copy,
	gen_coord,
	generate_short_id,
	get_other_color,
	get_random_color,
	has_coord,
	inner_range,
	is_valid,
	key,
	unkey,
	scroll_to_bottom,
} from "./utils"

const mocked_random = jest.spyOn(global.Math, "random")

afterAll(() => {
	jest.clearAllMocks()
})

describe("generate_short_id", () => {
	it("returns an id of the correct type and length", () => {
		const id = generate_short_id(6)
		expect(typeof id).toBe("string")
		expect(id.length).toBe(6)
	})

	it("returns a random string", () => {
		mocked_random
			.mockReturnValueOnce(0.1)
			.mockReturnValueOnce(0.5)
			.mockReturnValueOnce(0.6)
			.mockReturnValueOnce(0.2)

		const id = generate_short_id(4)
		expect(id).toBe("GflM")
	})
})

describe("key", () => {
	it("maps a coordinate to its string representation", () => {
		expect(key([0, 0])).toEqual("00")
		expect(key([2, 3])).toEqual("23")
	})

	it("inverts the unkey function", () => {
		expect(key(unkey("45"))).toEqual("45")
		expect(unkey(key([2, 1]))).toEqual([2, 1])
	})
})

describe("unkey", () => {
	it("maps a coordinate key to the coordinate", () => {
		expect(unkey("00")).toEqual([0, 0])
		expect(unkey("23")).toEqual([2, 3])
	})
})

describe("gen_coord", () => {
	it("generates a coordinate from two numbers", () => {
		expect(gen_coord(2, 3)).toEqual([2, 3])
	})
})

describe("has_coord", () => {
	it("checks if a coordinate is contained in a list of coordinates", () => {
		// prettier-ignore
		const coords: Coord[] = [[0, 0], [1, 1], [2, 3]]
		expect(has_coord(coords, [1, 1])).toBe(true)
		expect(has_coord(coords, [0, 1])).toBe(false)
	})
})

describe("is_valid", () => {
	it("returns false for invalid coordinates", () => {
		expect(is_valid([-1, -1])).toBe(false)
		expect(is_valid([-1, 1])).toBe(false)
		expect(is_valid([8, 1])).toBe(false)
		expect(is_valid([1, 9])).toBe(false)
	})

	it("returns true for valid coordinates", () => {
		expect(is_valid([1, 1])).toBe(true)
		expect(is_valid([6, 7])).toBe(true)
		expect(is_valid([5, 0])).toBe(true)
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
	const copy = deep_copy(original)

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
})

describe("inner_range", () => {
	it("maps (2,5) to the list [3,4]", () => {
		expect(inner_range(2, 5)).toEqual([3, 4])
	})

	it("maps (5,1) to the list [2,3,4]", () => {
		expect(inner_range(5, 1)).toEqual([2, 3, 4])
	})

	it("maps (1,2) to the list []", () => {
		expect(inner_range(1, 2)).toEqual([])
	})
})

describe("capitalize", () => {
	it("transforms 'black' to 'Black'", () => {
		expect(capitalize("black")).toBe("Black")
	})

	it("transforms 'tEsT' to 'TEsT'", () => {
		expect(capitalize("tEsT")).toBe("TEsT")
	})
})

describe("other_color", () => {
	it("maps white to black and vice versa", () => {
		expect(get_other_color("white")).toBe("black")
		expect(get_other_color("black")).toBe("white")
	})
})

describe("get_random_color", () => {
	it("generates random colors", () => {
		mocked_random
			.mockReturnValueOnce(0.1)
			.mockReturnValueOnce(0.2)
			.mockReturnValueOnce(0.7)
			.mockReturnValueOnce(0.9)
		expect(get_random_color()).toBe("white")
		expect(get_random_color()).toBe("white")
		expect(get_random_color()).toBe("black")
		expect(get_random_color()).toBe("black")
	})
})

describe("scroll_to_bottom", () => {
	it("scrolls to the bottom of the HTML element", () => {
		const element_mock: Partial<HTMLElement> = {
			scrollTop: 0,
			scrollHeight: 100,
		}
		scroll_to_bottom(element_mock as HTMLElement)
		expect(element_mock.scrollTop).toBe(100)
	})
})
