import { Piece_Map } from "$src/types.server"
import { Bishop } from "./Bishop"
import { King } from "./King"
import { Knight } from "./Knight"
import { Pawn } from "./Pawn"
import { Queen } from "./Queen"
import { Rook } from "./Rook"

/**
 * Black pieces of the standard configation
 */
const BLACK_PIECES: Piece_Map = {
	"00": new Rook("black"),
	"07": new Rook("black"),
	"01": new Knight("black"),
	"06": new Knight("black"),
	"02": new Bishop("black"),
	"05": new Bishop("black"),
	"03": new Queen("black"),
	"04": new King("black"),
	"10": new Pawn("black"),
	"11": new Pawn("black"),
	"12": new Pawn("black"),
	"13": new Pawn("black"),
	"14": new Pawn("black"),
	"15": new Pawn("black"),
	"16": new Pawn("black"),
	"17": new Pawn("black"),
}

/**
 * White pieces of the standard configation
 */
const WHITE_PICES: Piece_Map = {
	"70": new Rook("white"),
	"77": new Rook("white"),
	"71": new Knight("white"),
	"76": new Knight("white"),
	"72": new Bishop("white"),
	"75": new Bishop("white"),
	"73": new Queen("white"),
	"74": new King("white"),
	"60": new Pawn("white"),
	"61": new Pawn("white"),
	"62": new Pawn("white"),
	"63": new Pawn("white"),
	"64": new Pawn("white"),
	"65": new Pawn("white"),
	"66": new Pawn("white"),
	"67": new Pawn("white"),
}

/**
 * Standard configuration for the chess board
 */
export const STANDARD_CONFIG: Piece_Map = {
	...BLACK_PIECES,
	...WHITE_PICES,
}

/**
 * Initial configuration for the chess board
 */
export const INITIAL_CONFIG: Piece_Map = STANDARD_CONFIG
