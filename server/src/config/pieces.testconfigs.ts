import type { Piece_Map } from "$server/types.server"
import { Bishop } from "$server/pieces/Bishop"
import { King } from "$server/pieces/King"
import { Knight } from "$server/pieces/Knight"
import { Pawn } from "$server/pieces/Pawn"
import { Rook } from "$server/pieces/Rook"

/**
 * Configuration to test check feature
 */
export const CHECK: Piece_Map = {
	"55": new King("white"),
	"22": new King("black"),
	"27": new Rook("white"),
	"24": new Rook("black"),
}

/**
 * Configuration to test the end game
 */
export const END_GAME: Piece_Map = {
	"22": new King("black"),
	"56": new Bishop("black"),
	"43": new King("white"),
	"72": new Bishop("white"),
	"57": new Pawn("white"),
}

/**
 * Configuration to test checkmate and stalemate
 */
export const CHECKMATE: Piece_Map = {
	"00": new King("black"),
	"34": new Knight("white"),
	"21": new King("white"),
	"45": new Rook("white"),
}

/**
 * Configuration to test the castling feature
 */

export const CASTLING: Piece_Map = {
	"44": new King("black"),
	"74": new King("white"),
	"70": new Rook("white"),
	"77": new Rook("white"),
	"00": new Rook("black"),
	"07": new Rook("black"),
}

/**
 * Configuration to test the promotion feature
 */

export const PROMOTION: Piece_Map = {
	"44": new King("black"),
	"77": new King("white"),
	"12": new Pawn("white"),
	"64": new Pawn("black"),
}

/**
 * Configuration to test the en passant feature
 */
export const EN_PASSANT: Piece_Map = {
	"00": new King("black"),
	"02": new King("white"),
	"45": new Pawn("black"),
	"66": new Pawn("white"),
}

/**
 * Configuration with only two kings on the board
 */
export const LONELY_KINGS: Piece_Map = {
	"22": new King("white"),
	"55": new King("black"),
}
