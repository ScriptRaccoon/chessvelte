import { create_new_game, game_exists } from "$lib/games.js"
import { error, redirect } from "@sveltejs/kit"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("abcdefABCDEF0123456789")

const COOKIE_OPTIONS = {
	maxAge: 365 * 24 * 60 * 60,
	path: "/",
	sameSite: "lax",
	httpOnly: true,
	secure: true
} as const

export const load = (event) => {
	const name = event.cookies.get("name")
	return { name }
}

export const actions = {
	default: async (event) => {
		const form_data = await event.request.formData()
		const name = form_data.get("name") as string
		if (!name) {
			throw error(400, "Name has to be provided")
		}

		event.cookies.set("name", name, COOKIE_OPTIONS)

		let client_id = event.cookies.get("client_id")
		if (!client_id) {
			client_id = crypto.randomUUID() as string
			event.cookies.set("client_id", client_id, COOKIE_OPTIONS)
		}

		let game_id = form_data.get("game_id") as string
		if (!game_id) {
			game_id = nanoid(6)
		}

		if (!game_exists(game_id)) {
			create_new_game(game_id)
		}

		throw redirect(303, `/game/${game_id}`)
	}
}
