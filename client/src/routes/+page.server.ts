import { Pairing } from "$lib/Pairing"
import { COOKIE_OPTIONS } from "$shared/config"
import { generate_short_id } from "$shared/utils"
import { redirect } from "@sveltejs/kit"
import type { RequestEvent } from "./$types"

export const load = (event) => {
	const name = event.cookies.get("name") ?? ""
	return { name }
}

/**
 * Set cookies 'name' and 'client_id'
 */
function set_cookies(event: RequestEvent, name: string) {
	event.cookies.set("name", name, COOKIE_OPTIONS)
	let client_id = event.cookies.get("client_id")
	if (client_id) return
	client_id = crypto.randomUUID()
	event.cookies.set("client_id", client_id, COOKIE_OPTIONS)
}

export const actions = {
	/**
	 * Create a new game and redirect to it
	 */
	start: async (event) => {
		const form_data = await event.request.formData()
		const name = form_data.get("name")
		const valid_name = typeof name === "string" && name.length > 0
		if (!valid_name) {
			return { error: "You have to provide a name" }
		}
		set_cookies(event, name)

		let game_id = generate_short_id(6)
		let attempts = 0

		while (Pairing.exists(game_id) && attempts < 10) {
			game_id = generate_short_id(6 + attempts)
			attempts++
		}

		if (Pairing.exists(game_id)) {
			return { error: "Failed to create a new game" }
		}

		redirect(303, `/game/${game_id}`)
	},

	/**
	 * Join an existing game if possible and redirect to it
	 */
	join: async (event) => {
		const form_data = await event.request.formData()
		const name = form_data.get("name")
		const valid_name = typeof name === "string" && name.length > 0
		if (!valid_name) {
			return { error: "You have to provide a name" }
		}
		set_cookies(event, name)

		const game_id = form_data.get("game_id")
		const valid_game_id = typeof game_id === "string" && game_id.length > 0

		if (!valid_game_id) {
			return { error: "You have to provide a Game ID" }
		}

		if (!Pairing.exists(game_id)) {
			return { error: "There is no such game" }
		}

		redirect(303, `/game/${game_id}`)
	},
}
