<script lang="ts">
	import GameCard from "./GameCard.svelte"

	export let show_help: boolean = false

	function return_to_game() {
		show_help = false
	}
</script>

<GameCard title="How to play">
	<ul>
		<ul>
			<li>
				Click on a piece of your color to select it and see its possible moves.
			</li>
			<li>
				Click on another square to move the selected piece to that square.
			</li>
			<div class="video_container">
				<!-- svelte-ignore a11y-media-has-caption -->
				<video src="/howtomove.mp4" controls autoplay></video>
			</div>
			<li>
				Find the rules of chess on <a
					target="_blank"
					href="https://en.wikipedia.org/wiki/Rules_of_chess">Wikipedia</a
				>.
			</li>
			<li>
				Under the board, you see the current color and if it is your turn or
				not.
			</li>
			<li>
				Click on the chat icon to open up the chat. There you can chat with your
				opponent. Status messages about the game are sent as well.
			</li>
			<li>Click on the 'Flip' button to flip the board.</li>
			<li>
				Click on the 'Draw' button to offer a draw. You will get notified if
				your opponent agrees or rejects it.
			</li>
			<li>
				Click on the 'Resign' button to resign. You will then lose the game.
			</li>
			<li>
				The game can end by checkmate, stalemate, resignation, or draw by
				agreement.
			</li>
			<li>
				When the game has ended, the 'Restart' button restarts it and switches
				the players' colors.
			</li>
			<li>
				Use the gear icon in the top menu to open up the settings. Here you can
				toggle the highlights of the squares and set a different color theme for
				the board.
			</li>
			<li>
				When you disconnect from the game, you can come back to it later via the
				same link. Your opponent will be notified about the disconnection and
				reconnection.
			</li>
		</ul>
	</ul>

	<div>
		<button class="button" on:click={return_to_game}>Return to the game</button>
	</div>
</GameCard>

<style>
	ul {
		list-style-type: disc;
		margin-left: 0.75rem;
		margin-bottom: 1.5rem;
	}
	li {
		margin-bottom: 0.5rem;
	}

	.video_container {
		margin-block: 1rem;
		display: flex;
		justify-content: center;
	}

	video {
		border-radius: 0.5rem;
	}
</style>
