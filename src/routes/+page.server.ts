import { Pairing } from "$lib/Pairing"
import { COOKIE_OPTIONS } from "$lib/config"
import { generate_game_id } from "$lib/utils.js"
import { error, redirect } from "@sveltejs/kit"
import type { RequestEvent } from "./$types"

export const load = (event) => {
	const name = event.cookies.get("name") ?? ""
	return { name }
}

function set_cookies(event: RequestEvent, name: string) {
	event.cookies.set("name", name, COOKIE_OPTIONS)
	let client_id = event.cookies.get("client_id")
	if (client_id) return
	client_id = crypto.randomUUID()
	event.cookies.set("client_id", client_id, COOKIE_OPTIONS)
}

export const actions = {
	join: async (event) => {
		const form_data = await event.request.formData()
		const name = form_data.get("name")
		const valid_name = typeof name === "string" && name.length > 0
		if (!valid_name) {
			throw error(400, "Name has to be provided")
		}
		set_cookies(event, name)

		const game_id = form_data.get("game_id")
		const valid_game_id = typeof game_id === "string" && game_id.length > 0
		if (!valid_game_id) {
			throw error(400, "Game ID has to be provided")
		}

		if (!Pairing.exists(game_id)) {
			new Pairing(game_id)
		}
		throw redirect(303, `/game/${game_id}`)
	},
	start: async (event) => {
		const form_data = await event.request.formData()
		const name = form_data.get("name")
		const valid_name = typeof name === "string" && name.length > 0
		if (!valid_name) {
			throw error(400, "Name has to be provided")
		}
		set_cookies(event, name)

		const game_id = generate_game_id()
		if (!Pairing.exists(game_id)) {
			new Pairing(game_id)
		}
		throw redirect(303, `/game/${game_id}`)
	}
}
