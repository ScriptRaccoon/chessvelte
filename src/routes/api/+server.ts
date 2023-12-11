import { is_in_game, update_game } from "$lib/games.js"
import { error, json } from "@sveltejs/kit"

export const POST = async (event) => {
	const data = await event.request.json()
	const { game_id, value } = data
	const client_id = event.cookies.get("client_id")
	if (!client_id) throw error(401, "You are not authorized")
	if (!is_in_game(game_id, client_id)) {
		throw error(401, "You are not part of this game")
	}
	const updated_game = update_game(game_id, value)
	return json(updated_game)
}
