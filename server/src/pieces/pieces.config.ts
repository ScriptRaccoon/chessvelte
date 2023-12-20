import { Piece_Map } from "../types.server"
import { Bishop } from "./Bishop"
import { King } from "./King"
import { Knight } from "./Knight"
import { Pawn } from "./Pawn"
import { Queen } from "./Queen"
import { Rook } from "./Rook"

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

// STANDARD CONFIG

const STANDARD_CONFIG: Piece_Map = {
	...BLACK_PIECES,
	...WHITE_PICES,
}

// TESTING CONFIGURATIONS

const CHECK: Piece_Map = {
	"55": new King("white"),
	"22": new King("black"),
	"27": new Rook("white"),
	"24": new Rook("black"),
}

const END_GAME: Piece_Map = {
	"22": new King("black"),
	"56": new Bishop("black"),
	"43": new King("white"),
	"72": new Bishop("white"),
	"57": new Pawn("white"),
}

const CHECK_MATE: Piece_Map = {
	"00": new King("black"),
	"34": new Knight("white"),
	"21": new King("white"),
	"45": new Rook("white"),
}

const CASTLING: Piece_Map = {
	"44": new King("black"),
	"74": new King("white"),
	"70": new Rook("white"),
	"77": new Rook("white"),
	"00": new Rook("black"),
	"07": new Rook("black"),
}

const PROMOTION: Piece_Map = {
	"44": new King("black"),
	"77": new King("white"),
	"12": new Pawn("white"),
	"64": new Pawn("black"),
}

const EN_PASSANT: Piece_Map = {
	"00": new King("black"),
	"02": new King("white"),
	"45": new Pawn("black"),
	"66": new Pawn("white"),
}

const LONELY_KINGS: Piece_Map = {
	"22": new King("white"),
	"55": new King("black"),
}

// INITIAL CONFIG

export const INITIAL_CONFIG: Piece_Map = STANDARD_CONFIG
