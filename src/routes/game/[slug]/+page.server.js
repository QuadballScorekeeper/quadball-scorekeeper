import { Game } from '$lib/Game.svelte.js';

export function load({ params }) {
    let game;

    if (params.slug == "new") {
        game = new Game("Team 1", "Team 2")
        return {
            ...game
        }
    }


    try {
        console.log("Would try to fetch a game based on this: ", params.slug)
        throw Error()
    } catch (error) {
        game = new Game("Team 1", "Team 2")
    }
    return {
        ...game
    };
}
