import { Color } from "$shared/types"
import { get_other_color } from "$shared/utils"

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
