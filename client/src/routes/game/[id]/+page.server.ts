import { Pairing } from "$lib/Pairing"
import { error, redirect, type ServerLoadEvent } from "@sveltejs/kit"

export const prerender = false

/**
 * Adds the client to a game if possible.
 */
export const load = (event) => {
	const game_id = event.params.id
	const client_id = event.cookies.get("client_id")
	const name = event.cookies.get("name")

	if (!client_id || !name) {
		redirect(303, `/?id=${game_id}`)
	}

	const pairing = Pairing.get_by_id(game_id)
	if (!pairing) {
		error(404, "Game not found")
	}

	if (pairing.has_player(client_id)) {
		return { game_id, client_id, name }
	}

	if (pairing.is_full) {
		error(401, "Game is already full")
	}

	pairing.add_player(client_id)

	return { game_id, client_id, name }
}
