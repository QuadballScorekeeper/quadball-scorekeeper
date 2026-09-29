import { SvelteDate } from 'svelte/reactivity';
import { Game, type GameData } from './Game.svelte';
import type { Team } from './Team.svelte';

const DEFAULT_LOCAL_COLORS = {
	home: '#007dd0', // Blue
	away: '#ca040d' // Red
};

export const LOCAL_STORAGE_KEY = 'local_game_-1';

// Local game entity IDs (negative to distinguish from database records)
const LOCAL_GAME_ID = -1;
const LOCAL_HOME_TEAM_ID = -1;
const LOCAL_AWAY_TEAM_ID = -2;

/**
 * Generate a 3-letter acronym from a team name
 * Takes first letters of words, up to 3 characters
 */
export function generateAcronym(name: string): string {
	const trimmed = name.trim();
	if (!trimmed) {
		return 'TM';
	}

	const words = trimmed.split(/\s+/);

	if (words.length === 1) {
		// Single word: take first 3 letters
		return trimmed.substring(0, 3).toUpperCase();
	}

	// Multiple words: take first letter of each word, up to 3
	return words
		.slice(0, 3)
		.map((word) => word[0])
		.join('')
		.toUpperCase();
}

/**
 * Create GameData for a local game
 */
export function createLocalGameData(homeTeamName: string, awayTeamName: string): GameData {
	return {
		id: LOCAL_GAME_ID,
		scheduledStart: new SvelteDate(),
		status: 'scheduled',
		homeTeam: {
			id: LOCAL_HOME_TEAM_ID,
			name: homeTeamName,
			acronym: generateAcronym(homeTeamName),
			color: DEFAULT_LOCAL_COLORS.home,
			players: []
		},
		awayTeam: {
			id: LOCAL_AWAY_TEAM_ID,
			name: awayTeamName,
			acronym: generateAcronym(awayTeamName),
			color: DEFAULT_LOCAL_COLORS.away,
			players: []
		},
		events: []
	};
}

/**
 * Serialize GameData to localStorage-friendly format
 */
function serializeGameData(game: GameData): string {
	return JSON.stringify({
		...game,
		scheduledStart: game.scheduledStart.toISOString(),
		events: game.events.map((event) => ({
			gameId: event.gameId,
			eventNum: event.eventNum,
			eventType: event.eventType,
			teamId: event.teamId,
			playerNumber: event.playerNumber,
			timestamp: event.timestamp.toISOString()
		}))
	});
}

/**
 * Deserialize GameData from localStorage
 */
function deserializeGameData(jsonStr: string): GameData {
	const data = JSON.parse(jsonStr);

	return {
		...data,
		scheduledStart: new SvelteDate(data.scheduledStart),
		events: data.events.map((event: { timestamp: string }) => ({
			...event,
			timestamp: new SvelteDate(event.timestamp)
		}))
	};
}

/**
 * LocalGame extends Game to work without database/API calls
 * All state is saved to localStorage instead
 */
export class LocalGame extends Game {
	/**
	 * Save current game state to localStorage
	 */
	private saveToLocalStorage() {
		// Written out field by field: Team and Game hold reactive state behind accessors, which
		// JSON.stringify does not see.
		const teamData = (team: Team) => ({
			id: team.id,
			name: team.name,
			acronym: team.acronym,
			color: team.color,
			players: team.players
		});

		try {
			LocalGame.saveGameData({
				id: this.id,
				scheduledStart: this.scheduledStart,
				// Anything short of a finished game is rebuilt from the events on load
				status: this.status == 'finished' ? 'finished' : 'scheduled',
				homeTeam: teamData(this.homeTeam),
				awayTeam: teamData(this.awayTeam),
				events: this.events
			});
		} catch (error) {
			console.error('Failed to save to localStorage:', error);
		}
	}

	/**
	 * Public method to save game data to localStorage
	 * Used by setup page to create initial game state
	 */
	public static saveGameData(gameData: GameData) {
		localStorage.setItem(LOCAL_STORAGE_KEY, serializeGameData(gameData));
	}

	/**
	 * Load game data from localStorage
	 */
	public static loadFromLocalStorage(): GameData | null {
		try {
			const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (!stored) return null;

			const gameData = deserializeGameData(stored);
			// A game saved by an older version of the app, nothing sensible to restore from it
			if (Number.isNaN(gameData.scheduledStart.getTime())) {
				LocalGame.clearLocalStorage();
				return null;
			}

			return gameData;
		} catch (error) {
			console.error('Failed to load from localStorage:', error);
			return null;
		}
	}

	/**
	 * Clear local game from localStorage
	 */
	public static clearLocalStorage() {
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	}

	// A local game has no server to talk to, localStorage is the whole persistence layer

	protected override async persistEvent() {
		this.saveToLocalStorage();
	}

	protected override async persistEventRemoval() {
		this.saveToLocalStorage();
	}

	protected override async persistStatus() {
		this.saveToLocalStorage();
	}
}
