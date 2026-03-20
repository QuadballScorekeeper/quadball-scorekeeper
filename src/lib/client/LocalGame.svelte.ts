import { SvelteDate } from 'svelte/reactivity';
import { Game, type GameData } from './Game.svelte';
import { GameEvent } from './GameEvent.svelte';
import type { SelectGameEvent } from '../server/db/schema';

const DEFAULT_LOCAL_COLORS = {
	home: '#007dd0', // Blue
	away: '#ca040d' // Red
};

export const LOCAL_STORAGE_KEY = 'local_game_-1';

// Local game entity IDs (negative to distinguish from database records)
const LOCAL_GAME_ID = -1;
const LOCAL_TOURNAMENT_ID = -1;
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
 * Create mock GameData for a local game
 */
export function createLocalGameData(homeTeamName: string, awayTeamName: string): GameData {
	return {
		id: LOCAL_GAME_ID,
		start: new SvelteDate(),
		status: 'scheduled',
		tournament: LOCAL_TOURNAMENT_ID,
		homeTeamId: LOCAL_HOME_TEAM_ID,
		awayTeamId: LOCAL_AWAY_TEAM_ID,
		code: 'LOCAL',
		homeTeam: {
			id: LOCAL_HOME_TEAM_ID,
			name: homeTeamName,
			acronym: generateAcronym(homeTeamName),
			color: DEFAULT_LOCAL_COLORS.home,
			tournament: LOCAL_TOURNAMENT_ID,
			players: []
		},
		awayTeam: {
			id: LOCAL_AWAY_TEAM_ID,
			name: awayTeamName,
			acronym: generateAcronym(awayTeamName),
			color: DEFAULT_LOCAL_COLORS.away,
			tournament: LOCAL_TOURNAMENT_ID,
			players: []
		},
		events: []
	};
}

/**
 * Serialize GameData to localStorage-friendly format
 */
function serializeGameData(game: LocalGame): string {
	const data = {
		id: game.id,
		start: game.start.toISOString(),
		status: game.status === 'paused' || game.status === 'timeout' ? 'live' : game.status,
		tournament: LOCAL_TOURNAMENT_ID,
		homeTeamId: game.homeTeam.id,
		awayTeamId: game.awayTeam.id,
		code: 'LOCAL',
		homeTeam: {
			id: game.homeTeam.id,
			name: game.homeTeam.name,
			acronym: game.homeTeam.acronym,
			color: game.homeTeam.color,
			tournament: LOCAL_TOURNAMENT_ID,
			players: []
		},
		awayTeam: {
			id: game.awayTeam.id,
			name: game.awayTeam.name,
			acronym: game.awayTeam.acronym,
			color: game.awayTeam.color,
			tournament: LOCAL_TOURNAMENT_ID,
			players: []
		},
		events: game.events.map((event) => ({
			game: event.game,
			eventNum: event.eventNum,
			eventType: event.eventType,
			team: event.team,
			player: event.player,
			timestamp: event.timestamp.toISOString()
		}))
	};

	return JSON.stringify(data);
}

/**
 * Deserialize GameData from localStorage
 */
function deserializeGameData(jsonStr: string): GameData {
	const data = JSON.parse(jsonStr);

	return {
		id: data.id,
		start: new SvelteDate(data.start),
		status: data.status,
		tournament: data.tournament,
		homeTeamId: data.homeTeamId,
		awayTeamId: data.awayTeamId,
		code: data.code,
		homeTeam: data.homeTeam,
		awayTeam: data.awayTeam,
		events: data.events.map((e: any) => ({
			...e,
			timestamp: new SvelteDate(e.timestamp)
		}))
	};
}

/**
 * LocalGame extends Game to work without database/API calls
 * All state is saved to localStorage instead
 */
export class LocalGame extends Game {
	constructor(gameData: GameData) {
		super(gameData);
	}

	/**
	 * Save current game state to localStorage
	 */
	private saveToLocalStorage() {
		try {
			const serialized = serializeGameData(this);
			localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
		} catch (error) {
			console.error('Failed to save to localStorage:', error);
		}
	}

	/**
	 * Public method to save game data to localStorage
	 * Used by setup page to create initial game state
	 */
	public static saveGameData(gameData: GameData) {
		try {
			const serialized = JSON.stringify({
				...gameData,
				start: gameData.start instanceof Date ? gameData.start.toISOString() : gameData.start,
				events: gameData.events.map((e) => ({
					...e,
					timestamp: e.timestamp instanceof Date ? e.timestamp.toISOString() : e.timestamp
				}))
			});
			localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
		} catch (error) {
			console.error('Failed to save to localStorage:', error);
			throw error;
		}
	}

	/**
	 * Load game data from localStorage
	 */
	public static loadFromLocalStorage(): GameData | null {
		try {
			const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (!stored) return null;

			return deserializeGameData(stored);
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

	/**
	 * Override addEvent to skip API call and update local state
	 */
	public override async addEvent(
		eventType: SelectGameEvent['eventType'],
		player?: SelectGameEvent['player'],
		team?: SelectGameEvent['team']
	) {
		const timestamp = Date.now();
		const newEvent = new GameEvent(
			{
				game: this.id,
				eventNum: this.nextEvent,
				eventType: eventType,
				team: team ?? null,
				player: player ?? null,
				timestamp: new SvelteDate(timestamp)
			},
			this.gameTime,
			this.score
		);

		this.events.push(newEvent);
		this.nextEvent++;

		// Save to localStorage
		this.saveToLocalStorage();

		// No API call
	}

	/**
	 * Override removeEvent to skip API call
	 */
	public override async removeEvent(eventNum: SelectGameEvent['eventNum']) {
		const index = this.events.findIndex((event) => event.eventNum == eventNum);
		if (index == -1) {
			console.error('Trying to delete non-existent event??');
			return;
		}

		this.events.splice(index, 1);

		// Recalculate game state by replaying all remaining events
		this.recalculateGameState(this.events);

		// Save to localStorage
		this.saveToLocalStorage();

		// No API call
	}

	/**
	 * Override startGame to skip API call
	 */
	public override async startGame() {
		this.status = 'live';
		this.start = new SvelteDate();
		this.addEvent('start');

		// No API call
	}

	/**
	 * Override endGame to skip API call
	 */
	public override async endGame() {
		this.addEvent('end');
		this.status = 'finished';

		// No API call
	}
}
