const games: Record<string, Game> = {}

export function create_new_game(game_id: string) {
	const game: Game = {
		id: game_id,
		players: [],
		counter: 0
	}
	games[game_id] = game
}

export function game_exists(game_id: string): boolean {
	return game_id in games
}

export function get_game(game_id: string) {
	return games[game_id]
}

export function add_player(game_id: string, player: Player) {
	const game = games[game_id]
	if (!game) return
	game.players.push(player)
}

export function is_in_game(game_id: string, client_id: string): boolean {
	const game = games[game_id]
	if (!game) return false
	return game.players.some((player) => player.id === client_id)
}

export function update_game(game_id: string, value: number): Game {
	const game = games[game_id]
	game.counter += value
	return game
}
