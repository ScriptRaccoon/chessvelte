import { add_player, get_game, is_in_game } from "$lib/games.js"
import { error, redirect } from "@sveltejs/kit"

export const load = (event) => {
	const game_id = event.params.id

	const client_id = event.cookies.get("client_id")
	if (!client_id) throw redirect(303, `/?id=${game_id}`)

	const name = event.cookies.get("name")
	if (!name) throw redirect(303, `/?id=${game_id}`)

	const game = get_game(game_id)
	if (!game) throw error(404, "Game not found")

	if (is_in_game(game_id, client_id)) {
		return { game }
	}

	if (game.players.length >= 2) {
		throw error(404, "Game is already full")
	}

	const player = {
		name,
		id: client_id
	}

	add_player(game_id, player)

	return { game }
}
