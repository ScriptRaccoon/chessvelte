import { Color } from "$shared/types" // jest currently only works with ../../../shared
import { get_other_color } from "$shared/utils" // same here

export class Player {
	constructor(
		public client_id: string,
		public color: Color,
		public name: string,
	) {}

	switch_color(): void {
		this.color = get_other_color(this.color)
	}

	set_name(name: string): void {
		this.name = name
	}
}
