import { customAlphabet } from "nanoid"
import { COLS, ROWS } from "./config"

import type { Color, Coord, Coord_Key, PIECE_TYPE } from "$lib/types"

export function key(coord: Coord): Coord_Key {
	return `${coord[0]}${coord[1]}`
}

export function unkey(key: Coord_Key): Coord {
	return [Number(key[0]), Number(key[1])]
}

export function gen_coord(row: number, col: number): Coord {
	return [row, col]
}

export function has_coord(coords: Coord[], coord: Coord): boolean {
	return coords.some((_coord) => key(coord) === key(_coord))
}

export function is_valid(coord: Coord): boolean {
	const [row, col] = coord
	return row >= 0 && col >= 0 && row < ROWS.length && col < COLS.length
}

export const generate_game_id: () => string = customAlphabet(
	"abcdefABCDEF0123456789",
	6
)

export const generate_piece_id: () => string = customAlphabet(
	"1234567890abcdefghiklmnopqrstuvwxyz",
	4
)

export function piece_src(type: PIECE_TYPE, color: Color): string {
	return `../sprite.svg#${type}_${color}`
}

export function typed_keys<T extends {}>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[]
}

interface copyable<T> {
	copy: () => T
}

export function deep_copy<S extends string | number, T extends copyable<T>>(
	obj: Record<S, T | undefined>
): Record<S, T | undefined> {
	const keys = typed_keys(obj)
	const copy = {} as Record<S, T | undefined>
	for (const key of keys) {
		copy[key] = obj[key] ? obj[key]?.copy() : undefined
	}
	return copy
}

export function inner_range(a: number, b: number): number[] {
	if (a > b) {
		return inner_range(b, a)
	}
	const range: number[] = []
	for (let i = a + 1; i < b; i++) {
		range.push(i)
	}
	return range
}
