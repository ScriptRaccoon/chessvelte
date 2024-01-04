<script lang="ts">
	import { piece_src } from "$shared/utils"
	import type { Coord, Piece_Info } from "$shared/types"

	export let piece: Piece_Info
	export let coord: Coord
	export let animated: boolean = false
</script>

<svg
	class="piece"
	class:animated
	style:--x={coord[1]}
	style:--y={coord[0]}
	role="img"
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
	}

	.piece.animated {
		transition: transform 180ms ease-out;
	}
</style>
