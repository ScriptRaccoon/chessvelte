import { CHARACTERS, SIZE } from "./config"
import type { Color, Coord, Coord_Key, Piece_Type } from "./types"

export function generate_short_id(length: number): string {
	let result = ""
	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * CHARACTERS.length)
		result += CHARACTERS.charAt(index)
	}
	return result
}

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
	return row >= 0 && col >= 0 && row < SIZE && col < SIZE
}

export function piece_src(type: Piece_Type, color: Color): string {
	return `../sprite.svg#${type}_${color}`
}

export function typed_keys<T extends {}>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[]
}

interface copyable<T> {
	copy: () => T
}

export function deep_copy<S extends string | number, T extends copyable<T>>(
	obj: Record<S, T | undefined>,
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

export function capitalize(str: string): string {
	return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

export function get_other_color(color: Color): Color {
	return color === "white" ? "black" : "white"
}

export function get_random_color(): Color {
	return Math.random() < 0.5 ? "white" : "black"
}

export function scroll_to_bottom(element: HTMLElement): void {
	element.scrollTop = element.scrollHeight
}

export function rotate(coord: Coord, flipped: boolean = true): Coord {
	if (!flipped) return coord
	const [row, col] = coord
	return [SIZE - 1 - row, SIZE - 1 - col]
}

export function abridge(text: string, length: number): string {
	if (text.length <= length) return text
	return `${text.slice(0, length - 2)}...`
}

export function map_object<K extends string, V, W>(
	obj: Record<K, V>,
	transform: (value: V) => W,
): Record<K, W> {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]: [K, V]) => [key, transform(value)]),
	) as Record<K, W>
}
