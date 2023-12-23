<script lang="ts">
	import { piece_src } from "$shared/utils"
	import type { Located_Piece_State } from "$shared/types"

	export let piece: Located_Piece_State
</script>

<svg
	class="piece"
	style:--x={piece.coord[1]}
	style:--y={piece.coord[0]}
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
</style>
