import type { Coord } from "$shared/types"
import { King, Queen, Rook } from "$server/pieces"
import { generate_short_id } from "$shared/utils"
import { Board } from "./Board"
import { Piece } from "./Piece"

jest.mock("$shared/utils", () => ({
	...jest.requireActual("$shared/utils"),
	generate_short_id: jest.fn(),
}))

const id_mock = generate_short_id as jest.Mock

class _Piece extends Piece {
	copy() {
		// irrelevant here
	}
	get_moves() {
		return [] // irrelevant here
	}
}

describe("Piece class", () => {
	describe("constructor", () => {
		it("saves type, color, value and id", () => {
			id_mock.mockReturnValue("123")
			const pawn = new _Piece("pawn", "white")
			expect(pawn.color).toBe("white")
			expect(pawn.type).toBe("pawn")
			expect(pawn.value).toBe(1)
			expect(pawn.id).toBe("123")

			id_mock.mockReturnValue("456")
			const queen = new _Piece("queen", "black")
			expect(queen.color).toBe("black")
			expect(queen.type).toBe("queen")
			expect(queen.value).toBe(9)
			expect(queen.id).toBe("456")
		})
	})

	describe("state", () => {
		it("returns an object with coord, type, color, value and id", () => {
			id_mock.mockReturnValue("123")
			const pawn = new _Piece("pawn", "white")
			const state = pawn.state([0, 1])
			expect(state.coord).toEqual([0, 1])
			expect(state.type).toBe("pawn")
			expect(state.color).toBe("white")
			expect(state.value).toBe(1)
			expect(state.id).toBe("123")
		})
	})

	describe("directional_moves", () => {
		it("contains all moves in one direction when no piece is there", () => {
			const directions: [number, number][] = [[1, 0]]
			const queen = new _Piece("queen", "black")
			const coord: Coord = [1, 1]
			const board = new Board({
				"11": queen,
			})
			const moves = queen.directional_moves(directions, coord, board)
			expect(Array.isArray(moves)).toBe(true)
			expect(moves.length).toBe(6)
			const targets = [
				[2, 1],
				[3, 1],
				[4, 1],
				[5, 1],
				[6, 1],
				[7, 1],
			]
			expect(moves.map((move) => move.end)).toEqual(targets)
		})

		it("contains all moves up to the next piece of the same color, no capture", () => {
			const directions: [number, number][] = [[0, 1]]
			const queen = new _Piece("queen", "black")
			const own_king = new _Piece("king", "black")
			const coord: Coord = [1, 1]
			const board = new Board({
				"11": queen,
				"14": own_king,
			})
			const moves = queen.directional_moves(directions, coord, board)
			expect(Array.isArray(moves)).toBe(true)
			expect(moves.length).toBe(2)
			expect(moves.map((move) => move.end)).toEqual([
				[1, 2],
				[1, 3],
			])
			for (const move of moves) {
				expect(move.capture).toBeUndefined()
			}
		})

		it("contains all moves up to the next piece of opposite color to capture it", () => {
			const directions: [number, number][] = [[0, -1]]
			const queen = new _Piece("queen", "black")
			const other_rook = new _Piece("rook", "white")
			const coord: Coord = [5, 4]
			const board = new Board({
				"54": queen,
				"51": other_rook,
			})
			const moves = queen.directional_moves(directions, coord, board)
			expect(Array.isArray(moves)).toBe(true)
			expect(moves.length).toBe(3)
			expect(moves.map((move) => move.end)).toEqual([
				[5, 3],
				[5, 2],
				[5, 1],
			])
			const last_move = moves[2]
			expect(last_move.capture).toBeDefined()
			expect(last_move.capture?.piece === other_rook)
			expect(last_move.capture?.coord).toEqual([5, 1])
		})

		it("contains no jumps over own pieces", () => {
			const directions: [number, number][] = [[1, 0]]
			const queen = new _Piece("queen", "black")
			const other_rook = new _Piece("rook", "white")
			const blocking_pawn = new _Piece("pawn", "black")
			const coord: Coord = [1, 1]
			const board = new Board({
				"11": queen,
				"21": blocking_pawn,
				"61": other_rook,
			})
			const moves = queen.directional_moves(directions, coord, board)
			expect(moves.length).toBe(0)
		})

		it("contains no moves outside of the board", () => {
			const directions: [number, number][] = [[-1, 0]]
			const queen = new _Piece("queen", "black")
			const coord: Coord = [0, 0]
			const board = new Board({
				"00": queen,
			})
			const moves = queen.directional_moves(directions, coord, board)
			expect(moves.length).toBe(0)
		})

		it("contains moves in all horizontal / vertical directions when specified", () => {
			const directions: [number, number][] = [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1],
			]
			const queen = new _Piece("queen", "black")
			const coord: Coord = [4, 4]
			const board = new Board({
				"44": queen,
			})
			const moves = queen.directional_moves(directions, coord, board)
			expect(moves.length).toBe(14)
			const actual_targets = moves.map((move) => move.end)
			const targets = [
				[5, 4],
				[6, 4],
				[7, 4],
				[3, 4],
				[2, 4],
				[1, 4],
				[0, 4],
				[4, 5],
				[4, 6],
				[4, 7],
				[4, 3],
				[4, 2],
				[4, 1],
				[4, 0],
			]
			expect(actual_targets).toEqual(expect.arrayContaining(targets))
			expect(targets).toEqual(expect.arrayContaining(actual_targets))
		})

		it("contains moves in all diagonal directions when specified", () => {
			const directions: [number, number][] = [
				[1, 1],
				[-1, -1],
				[1, -1],
				[-1, 1],
			]
			const queen = new _Piece("queen", "black")
			const coord: Coord = [2, 3]
			const board = new Board({
				"23": queen,
			})
			const moves = queen.directional_moves(directions, coord, board)
			expect(moves.length).toBe(11)
			const actual_targets = moves.map((move) => move.end)
			const targets = [
				[0, 1],
				[1, 2],
				[3, 4],
				[4, 5],
				[5, 6],
				[6, 7],
				[0, 5],
				[1, 4],
				[3, 2],
				[4, 1],
				[5, 0],
			]
			expect(actual_targets).toEqual(expect.arrayContaining(targets))
			expect(targets).toEqual(expect.arrayContaining(actual_targets))
		})
	})

	describe("get_save_moves", () => {
		const black_queen = new Queen("black")
		const white_king = new King("white")
		const black_king = new King("black")
		const white_rook = new Rook("white")
		const board = new Board({
			"00": black_queen,
			"04": white_king,
			"77": black_king,
			"21": white_rook,
		})
		it("returns all king's moves that don't result in check", () => {
			const moves = white_king.get_save_moves([0, 4], board)
			expect(moves.length).toBe(3)
		})
		it("returns all moves that protect the king from check", () => {
			const moves = white_rook.get_save_moves([2, 1], board)
			expect(moves.length).toBe(1)
			expect(moves[0].end).toEqual([0, 1])
		})
	})

	describe("attacks", () => {
		it("checks if a coordinate is attacked by a piece", () => {
			const black_queen = new Queen("black")
			const board = new Board({
				"55": black_queen,
			})
			expect(black_queen.attacks([5, 5], board, [0, 0])).toBe(true)
			expect(black_queen.attacks([5, 5], board, [7, 7])).toBe(true)
			expect(black_queen.attacks([5, 5], board, [5, 6])).toBe(true)
			expect(black_queen.attacks([5, 5], board, [2, 1])).toBe(false)
			expect(black_queen.attacks([5, 5], board, [6, 7])).toBe(false)
		})
	})
})
