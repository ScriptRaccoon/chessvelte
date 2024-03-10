# Chessvelte

This is a multi-player chess game made with SvelteKit.

![Board](/chess-multiplayer-svelte.webp)

On the home page users can create a new game or join an existing game. The other player can simply join by using the game link. All the basic rules of chess have been implemented (except for move repetition). Players can chat with each other, draw or resign the game, and also adjust the appearance of the board. The previous move is highlighted and the captured pieces are displayed.

There is no login, users are only required to enter their name. When a player leaves the game or disconnects and comes back later, they are recognized and reconnected using a client ID saved in a cookie.

The application uses a separately hosted express server with socket.io for the whole game logic and communication between the players. This guarantees that players cannot cheat.

For a single-player version made with Svelte, see https://github.com/ScriptRaccoon/chessvelte-singleplayer. Back in 2020 I already made a much more basic chess program with Vanilla JS: https://github.com/ScriptRaccoon/chess-singleplayer
