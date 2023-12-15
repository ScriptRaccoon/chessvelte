import { Pairing } from "$lib/backend/controllers/Pairing"
import { error, redirect } from "@sveltejs/kit"

export const load = (event) => {
	const game_id = event.params.id

	const client_id = event.cookies.get("client_id")
	if (!client_id) throw redirect(303, `/?id=${game_id}`)

	const name = event.cookies.get("name")
	if (!name) throw redirect(303, `/?id=${game_id}`)

	const pairing = Pairing.get_by_id(game_id)
	if (!pairing) throw error(404, "Game not found")

	let player = pairing.get_player(client_id)

	if (player) {
		return { game_id, client_id }
	}

	if (pairing.is_full) {
		throw error(401, "Game is already full")
	}

	player = pairing.add_player(client_id)

	return { game_id, client_id }
}
