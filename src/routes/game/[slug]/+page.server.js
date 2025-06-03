import { Game } from '$lib/Game.svelte.js';

export function load({ params }) {
    let game;

    if (params.slug == "new") {
        return {

            teamA: "Team A",
            teamB: "Team B",
        }
    }


    try {
        console.log("Would try to fetch a game based on this: ", params.slug)
        throw Error()
    } catch (error) {
        game = new Game("Team 1", "Team 2")
    }
    return {
        teamA: game.teamA,
        teamB: game.teamB,
    };
}
