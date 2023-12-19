<script lang="ts">
	import Fa from "svelte-fa"
	import { faGithub } from "@fortawesome/free-brands-svg-icons"
</script>

<footer>
	<div class="author">Made by Script Raccoon</div>
	<ul>
		<li>
			<a
				href="https://github.com/ScriptRaccoon/chessvelte"
				target="_blank"
				aria-label="GitHub"
			>
				<Fa icon={faGithub} />
			</a>
		</li>
	</ul>
</footer>

<style>
	footer {
		color: var(--secondary-font-color);
		margin-top: auto;
		padding-block: 2rem;
	}

	.author {
		text-align: center;
		margin-bottom: 0.5rem;
		font-size: small;
	}

	ul {
		font-size: 1.75rem;
		display: flex;
		justify-content: center;
		gap: 1rem;
	}
</style>
