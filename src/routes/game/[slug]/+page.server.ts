import { newGameParams } from '$lib/Game.svelte.js';

export function load({ params }) {
    if (params.slug == "new") {
        return {
            newGameParams
        }
    }


    try {
        console.log("Would try to fetch a game based on this: ", params.slug)
        throw Error()
    } catch (error) {
        // Could not connect, give error?
        return newGameParams
    }
}
