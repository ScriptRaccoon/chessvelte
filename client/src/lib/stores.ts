import { browser } from "$app/environment"
import { DEFAULT_THEME } from "$shared/config"
import { writable, type Writable } from "svelte/store"

function local_store<T>(
	key: string,
	default_value: T,
	update: (value: T) => void = () => {},
): Writable<T> {
	let initial_value: T
	try {
		const has_stored_value = browser && localStorage.getItem(key) !== null
		initial_value = has_stored_value
			? JSON.parse(localStorage.getItem(key)!)
			: default_value
	} catch (_) {
		initial_value = default_value
	}

	const store = writable<T>(initial_value)

	store.subscribe((value: T) => {
		if (browser) {
			localStorage.setItem(key, JSON.stringify(value))
			update(value)
		}
	})

	return store
}

export const highlight_setting = local_store<boolean>("highlights", true)

export const board_theme = local_store<string>(
	"board_theme",
	DEFAULT_THEME,
	(theme) => (document.body.className = `theme-${theme}`),
)

export const animate_pieces = writable<boolean>(false)
