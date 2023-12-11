// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	type Player = {
		id: string
		name: string
	}

	type Game = {
		id: string
		players: Player[]
		counter: number
	}
}

export {}
