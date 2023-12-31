import { Pairing } from "$lib/Pairing"
import { error, redirect } from "@sveltejs/kit"

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

	const pairing = Pairing.get_or_create_by_id(game_id)

	if (pairing.has_player(client_id)) {
		return { game_id, client_id, name }
	}

	if (pairing.is_full) {
		error(401, "You are not allowed to join this game")
	}

	pairing.add_player(client_id)

	return { game_id, client_id, name }
}
