import { Game } from './models/Game.svelte';
import { GameEvent } from './models/GameEvent.svelte';
import { Team } from './models/Team.svelte';
import type { SelectGame, SelectGameEvent, SelectTeam } from './server/db/schema';

export function gameAndTeamsFromEvents(
	gameRow: SelectGame,
	homeTeamRow: SelectTeam,
	awayTeamRow: SelectTeam,
	gameEventRows: SelectGameEvent[]
) {
	const game = new Game(gameRow);
	const homeTeam = new Team(homeTeamRow, game);
	const awayTeam = new Team(awayTeamRow, game);

	function getEventTeam(event: SelectGameEvent) {
		if (event.team == homeTeam.id) return homeTeam;
		if (event.team != awayTeam.id) throw new Error("TeamID does not belong to game");
		return awayTeam;
	}

	const sortedEvents = [...gameEventRows].sort((a, b) => a.eventNum - b.eventNum);

	for (const eventRow of sortedEvents) {
		switch (eventRow.eventType) {
			case 'timeout':
				getEventTeam(eventRow).timeoutAvailable = false;
			case 'pause':
				if (game.currentPauseStart) break;
				game.currentPauseStart = eventRow.timestamp.getTime();
				break;
			case 'resume':
				if (!game.currentPauseStart) break;
				game.totalPauseTime += eventRow.timestamp.getTime() - game.currentPauseStart;
				game.currentPauseStart = null;
				break;

			case 'goal':
				getEventTeam(eventRow).goals++;
			case 'catch':
				getEventTeam(eventRow).catch = true;
			// Check if the team wins?

			case 'blue_card':
			case 'yellow_card':
			case 'red_card':
			case 'ejection':
			// Do something appropriate

			default:
				break;
		}

		const gameTime = game.translateRealTime(eventRow.timestamp);
		const event = new GameEvent(eventRow, gameTime);
		game.events.push(event);
	}

	const lastEvent = sortedEvents[sortedEvents.length - 1];
	game.gameTime = game.translateRealTime(new Date());
	game.nextEvent = lastEvent.eventNum + 1;

	return {
		game,
		homeTeam,
		awayTeam
	};
}
