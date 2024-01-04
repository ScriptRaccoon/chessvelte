import type { Move } from "$server/types.server"
import type { Piece } from "./Piece"
import { Queen, Rook } from "$server/pieces"
import { MoveHistory } from "./MoveHistory"

function generate_sample(
	first_piece: Piece = new Rook("white"),
	second_piece: Piece = new Queen("black"),
) {
	const move_history = new MoveHistory()

	const first_move: Move = {
		start: [2, 3],
		end: [2, 4],
		piece: first_piece,
		type: "regular",
	}

	const second_move: Move = {
		start: [6, 0],
		end: [0, 6],
		piece: second_piece,
		type: "regular",
	}

	move_history.push(first_move)
	move_history.push(second_move)

	return { first_move, second_move, move_history }
}

describe("MoveHistory class", () => {
	describe("push and last_move", () => {
		it("add a move and retrieve it", () => {
			const { second_move, move_history } = generate_sample()
			expect(move_history.last_move).toBe(second_move)
		})
	})

	describe("clear", () => {
		it("removes all moves, so last_move is undefined", () => {
			const { move_history } = generate_sample()
			move_history.clear()
			expect(move_history.last_move).toBeFalsy()
			expect(move_history.last_move_info).toBeFalsy()
		})
	})

	describe("last_move_info", () => {
		it("returns the info of the last move", () => {
			const { second_move, move_history } = generate_sample()
			expect(move_history.last_move_info).toEqual({
				start: second_move.start,
				end: second_move.end,
				type: second_move.type,
			})
		})
	})

	describe("contains_piece", () => {
		it("returns true if the piece has been moved before", () => {
			const rook = new Rook("black")
			const queen = new Queen("white")
			const { move_history } = generate_sample(rook, queen)
			expect(move_history.contains_piece(rook)).toBe(true)
			expect(move_history.contains_piece(rook)).toBe(true)
		})

		it("returns false if the piece has not been moved before", () => {
			const rook = new Rook("black")
			const queen = new Queen("white")
			const other_rook = new Rook("black")
			const { move_history } = generate_sample(rook, queen)
			expect(move_history.contains_piece(rook)).toBe(true)
			expect(move_history.contains_piece(rook)).toBe(true)
			expect(move_history.contains_piece(other_rook)).toBe(false)
		})
	})
})
