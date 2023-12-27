import { SimpleDB } from "./SimpleDB"

interface Item {
	value: string
}

describe("SimpleDB", () => {
	let db: SimpleDB<Item>
	let item_1: Item
	let item_2: Item
	let id_1: string
	let id_2: string
	let fake_id: string

	beforeEach(() => {
		db = new SimpleDB<Item>()
		id_1 = "123"
		id_2 = "456"
		fake_id = "xyz"
		item_1 = { value: "anything" }
		item_2 = { value: "something" }
		db.add(id_1, item_1)
		db.add(id_2, item_2)
	})

	it("should add an item", () => {
		expect(db.get(id_1)).toEqual(item_1)
	})

	it("should check if an item exists", () => {
		expect(db.has(id_1)).toBe(true)
		expect(db.has(fake_id)).toBe(false)
	})

	it("should remove an item", () => {
		db.remove(id_1)
		expect(db.get(id_1)).toBeUndefined()
		expect(db.has(id_1)).toBe(false)
	})

	it("should erase all items", () => {
		db.clear()
		expect(db.get(id_1)).toBeUndefined()
		expect(db.has(id_1)).toBe(false)
		expect(db.get(id_2)).toBeUndefined()
		expect(db.has(id_2)).toBe(false)
	})

	it("should return all items", () => {
		expect(db.items).toEqual([item_1, item_2])
	})

	it("should return the correct size", () => {
		expect(db.size).toBe(2)
	})
})
