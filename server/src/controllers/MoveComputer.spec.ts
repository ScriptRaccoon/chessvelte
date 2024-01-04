import { MoveComputer } from "./MoveComputer"
import { Board } from "./Board"
import { StatusManager } from "./StatusManager"
import { MoveHistory } from "./MoveHistory"
import { PROMOTION } from "$server/config/pieces.testconfigs"
import { key } from "$shared/utils"

describe("MoveComputer", () => {
	let move_computer: MoveComputer
	let board: Board
	let status: StatusManager
	let move_history: MoveHistory

	beforeEach(() => {
		board = new Board()
		status = new StatusManager()
		move_history = new MoveHistory()
		move_computer = new MoveComputer(board, status, move_history)
	})

	it("should initialize with default values", () => {
		expect(move_computer.amount).toBe(0)
		expect(move_computer.moves).toEqual({})
	})

	it("computes 20 possible moves on startup", () => {
		move_computer.update()
		expect(move_computer.amount).toBe(20)
	})
	it("computes the moves for all 16 squares of the current color", () => {
		move_computer.update()
		expect(Object.keys(move_computer.moves).length).toBe(16)
	})

	it("computes the correct moves for a white pawn", () => {
		move_computer.update()
		const pawn_moves = move_computer.moves[key([6, 0])]
		expect(pawn_moves.length).toBe(2)
		const targets = pawn_moves.map((move) => move.end)
		expect(targets).toContainEqual([4, 0])
		expect(targets).toContainEqual([5, 0])
	})

	it("computes the correct moves for a white knight", () => {
		move_computer.update()
		const knight_moves = move_computer.moves[key([7, 1])]
		expect(knight_moves.length).toBe(2)
		const targets = knight_moves.map((move) => move.end)
		expect(targets).toContainEqual([5, 2])
		expect(targets).toContainEqual([5, 0])
	})

	it("confirms that a rook cannot move during startup", () => {
		move_computer.update()
		const rook_moves = move_computer.moves[key([7, 0])]
		expect(rook_moves.length).toBe(0)
	})

	it("computes the move info for a white pawn", () => {
		move_computer.update()
		const pawn_moves = move_computer.moves_info[key([6, 2])]
		expect(pawn_moves.length).toBe(2)
		expect(pawn_moves).toContainEqual({
			start: [6, 2],
			end: [4, 2],
			type: "regular",
		})
		expect(pawn_moves).toContainEqual({
			start: [6, 2],
			end: [5, 2],
			type: "regular",
		})
	})

	it("computes the correct number of moves in an endgame", () => {
		board = new Board(PROMOTION)
		status = new StatusManager()
		move_history = new MoveHistory()
		move_computer = new MoveComputer(board, status, move_history)
		move_computer.update()
		expect(move_computer.amount).toBe(4)
	})
})
