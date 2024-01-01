import type { Color, Piece_Type } from "$shared/types"
import { Piece } from "$server/controllers/Piece"
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./"

export function create_piece(type: Piece_Type, color: Color): Piece {
	switch (type) {
		case "bishop":
			return new Bishop(color)
		case "king":
			return new King(color)
		case "knight":
			return new Knight(color)
		case "pawn":
			return new Pawn(color)
		case "queen":
			return new Queen(color)
		case "rook":
			return new Rook(color)
	}
}
