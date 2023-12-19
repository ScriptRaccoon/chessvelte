<script lang="ts">
	import { piece_src } from "$shared/utils"
	import type { Coord, Piece_State } from "$shared/types"

	export let coord: Coord
	export let piece: Piece_State
	export let flipped: boolean
</script>

<svg class="piece" class:flipped style:--x={coord[1]} style:--y={coord[0]}>
	<use xlink:href={piece_src(piece.type, piece.color)} />
</svg>

<style>
	.piece {
		pointer-events: none;
		top: 0;
		left: 0;
		position: absolute;
		width: var(--unit);
		height: var(--unit);
		display: flex;
		justify-content: center;
		align-items: center;
		--angle: 0deg;
		transform: translate(
				calc(var(--x) * var(--unit)),
				calc(var(--y) * var(--unit))
			)
			rotate(var(--angle));
	}
	.piece.flipped {
		--angle: 180deg;
	}
</style>
