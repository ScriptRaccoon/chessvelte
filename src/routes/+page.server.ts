import { Pairing } from "$lib/Pairing"
import { COOKIE_OPTIONS } from "$lib/config"
import { generate_game_id } from "$lib/utils.js"
import { error, redirect } from "@sveltejs/kit"

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
			game_id = generate_game_id()
		}

		if (!Pairing.exists(game_id)) {
			new Pairing(game_id)
		}

		throw redirect(303, `/game/${game_id}`)
	}
}
