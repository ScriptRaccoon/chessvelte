import type { Coord, Coord_Key, PIECE_TYPE } from "$lib/types"

import { customAlphabet } from "nanoid"

export const nanoid = customAlphabet("abcdefABCDEF0123456789")

export function generate_game_id() {
	return nanoid(6)
}

export const piece_src = (type: PIECE_TYPE, color: "white" | "black") =>
	`../sprite.svg#${type}_${color}`

export function gen_coord(row: number, col: number): Coord {
	return [row, col]
}

export function has_coord(coords: Coord[], coord: Coord): boolean {
	return coords.some((_coord) => coord.toString() === _coord.toString())
}

export function key(coord: Coord): Coord_Key {
	return `${coord[0]}${coord[1]}`
}
