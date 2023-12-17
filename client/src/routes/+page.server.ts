import { Pairing } from "$lib/Pairing"
import { COOKIE_OPTIONS } from "$shared/config"
import { generate_game_id } from "$shared/utils"
import { redirect } from "@sveltejs/kit"
import type { RequestEvent } from "./$types"
import type { login_error } from "$shared/types"

export const load = (event) => {
	const name = event.cookies.get("name") ?? ""
	const error = (event.url.searchParams.get("error") ?? "") as login_error
	return { name, error }
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
			const error: login_error = "name"
			redirect(302, `/?error=${error}`)
		}
		set_cookies(event, name)

		const game_id = form_data.get("game_id")
		const valid_game_id = typeof game_id === "string" && game_id.length > 0
		if (!valid_game_id) {
			const error: login_error = "gameid"
			redirect(302, `/?error=${error}`)
		}

		if (!Pairing.exists(game_id)) {
			new Pairing(game_id)
		}
		redirect(303, `/game/${game_id}`)
	},
	start: async (event) => {
		const form_data = await event.request.formData()
		const name = form_data.get("name")
		const valid_name = typeof name === "string" && name.length > 0
		if (!valid_name) {
			const error: login_error = "name"
			redirect(302, `/?error=${error}`)
		}
		set_cookies(event, name)

		const game_id = generate_game_id()
		if (!Pairing.exists(game_id)) {
			new Pairing(game_id)
		}
		redirect(303, `/game/${game_id}`)
	},
}
