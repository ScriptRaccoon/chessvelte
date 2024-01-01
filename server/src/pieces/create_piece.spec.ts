import { Bishop, King, Knight, Pawn, Queen, Rook } from "./"
import { create_piece } from "./create_piece"

describe("create_piece", () => {
	it("creates a king of the given color", () => {
		const piece = create_piece("king", "white")
		expect(piece.type).toBe("king")
		expect(piece.color).toBe("white")
		expect(piece instanceof King).toBe(true)
	})

	it("creates a queen of the given color", () => {
		const piece = create_piece("queen", "white")
		expect(piece.type).toBe("queen")
		expect(piece.color).toBe("white")
		expect(piece instanceof Queen).toBe(true)
	})

	it("creates a bishop of the given color", () => {
		const piece = create_piece("bishop", "black")
		expect(piece.type).toBe("bishop")
		expect(piece.color).toBe("black")
		expect(piece instanceof Bishop).toBe(true)
	})

	it("creates a rook of the given color", () => {
		const piece = create_piece("rook", "black")
		expect(piece.type).toBe("rook")
		expect(piece.color).toBe("black")
		expect(piece instanceof Rook).toBe(true)
	})

	it("creates a pawn of the given color", () => {
		const piece = create_piece("pawn", "black")
		expect(piece.type).toBe("pawn")
		expect(piece.color).toBe("black")
		expect(piece instanceof Pawn).toBe(true)
	})

	it("creates a knight of the given color", () => {
		const piece = create_piece("knight", "white")
		expect(piece.type).toBe("knight")
		expect(piece.color).toBe("white")
		expect(piece instanceof Knight).toBe(true)
	})
})
