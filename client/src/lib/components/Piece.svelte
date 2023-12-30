<script lang="ts">
	import { piece_src } from "$shared/utils"
	import type { Coord, Piece_State } from "$shared/types"
	import { animate_pieces } from "$lib/stores"
	import { PIECE_SPEED } from "$shared/config"

	export let piece: Piece_State
	export let coord: Coord
</script>

<svg
	class="piece"
	style:--x={coord[1]}
	style:--y={coord[0]}
	role="img"
	style:--speed={$animate_pieces ? `${PIECE_SPEED}ms` : "0ms"}
>
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
		transform: translate(
			calc(var(--x) * var(--unit)),
			calc(var(--y) * var(--unit))
		);
		z-index: 2;
		transition: transform var(--speed) ease-out;
	}
</style>
