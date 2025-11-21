import { Game } from './models/Game.svelte';
import { GameEvent } from './models/GameEvent.svelte';
import { Team } from './models/Team.svelte';
import type { SelectGameEvent } from './server/db/schema';

export function gameAndTeamsFromEvents(
	gameInfo: any
) {
	const homeTeam = new Team(gameInfo.homeTeam);
	const awayTeam = new Team(gameInfo.awayTeam);
	const game = new Game(gameInfo, homeTeam, awayTeam);

	function getEventTeam(event: SelectGameEvent) {
		if (event.team == homeTeam.id) return homeTeam;
		if (event.team != awayTeam.id) throw new Error("TeamID does not belong to game");
		return awayTeam;
	}

	const sortedEvents = [...gameInfo.events].sort((a, b) => a.eventNum - b.eventNum);

	for (const eventRow of sortedEvents) {
		switch (eventRow.eventType) {
			case 'timeout':
				getEventTeam(eventRow).timeoutAvailable = false;
			// eslint-disable-next-line no-fallthrough
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
				break;
			case 'catch':
				getEventTeam(eventRow).catch = true;
				break;

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

	if (sortedEvents.length) {
		const lastEvent = sortedEvents[sortedEvents.length - 1];
		game.gameTime = game.translateRealTime(new Date());
		game.nextEvent = lastEvent.eventNum + 1;
	}

	return {
		game,
	};
}
