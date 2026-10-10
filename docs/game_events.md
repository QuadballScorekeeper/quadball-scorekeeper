# How a game is played

Domain reference for anyone — human or agent — touching game logic. It describes the rules we
actually play (IQA 2023-2024 rulebook) and how this app models them. The executable truth is
`applyEvent` in `src/lib/client/Game.svelte.ts`; if code and this document disagree, one of them
is wrong.

## The real game, briefly

Quadball is played by two teams of seven: three chasers and a keeper who try to throw the
quadball (a volleyball) through the opponent's three hoops, two beaters who disrupt with
bludgers (dodgeballs), and a seeker who joins later to chase the flag (a tennis ball) carried by
a neutral flag runner.

Scoring is counted in **goal units**: a goal through a hoop scores 1, a flag catch scores 3.
The 10/30-point display from older rulebook versions is a holdover and is not used here. A
caught flag is shown as a `*` next to the team's score.

## Phases and clock

No status is stored on the game row. The client derives it from the event log: `scheduled` (no
`start` event yet), `live`, `paused`, `timeout`, `finished`. `cancelled` is reserved for a future
cancel-game feature; nothing can produce it yet.

- One count-up clock, no halves or periods. The clock only advances while the game is `live`;
  pause, timeout and everything before `start` do not move it.
- Timeline reminders (banner, plus planned events): 18:30 get the seekers, 19:00 flag release,
  20:00 seeker release. A catch cannot be recorded before 20:00 of game time.
- After seeker release the flag runner takes a handicap every 5 minutes (25:00, 30:00, 35:00 …).
  Shown as banner reminders only; not tracked as events.
- Each team has one 1-minute timeout. The clock stops, and after the minute the game flips back
  to `paused` — each client derives this from the timeout event's timestamp, no event is stored.

## Scoring and the end of the game

- Score = goals + 3 × catch, per team.
- A catch ends the game immediately if the catching team is ahead afterwards.
- A catch that ties or leaves the catching team behind starts **overtime**: the banner shows a
  set score (opponent's score + 3) and the game ends when either team reaches it.

## Actions we keep track of (stored events)

The `game_event` table is the only record of a game; events are ordered per game by `eventNum`
(see `eventTypeEnum` in `src/lib/server/db/schema.ts`). `team` is required where the action
belongs to a team; `player` is a jersey number.

| Event         | team | player | Effect                                                                                                 |
| ------------- | ---- | ------ | ------------------------------------------------------------------------------------------------------ |
| `start`       | no   | no     | Kicks off at the recorded timestamp; the clock starts                                                  |
| `end`         | no   | no     | Marks the game `finished`                                                                              |
| `pause`       | no   | no     | Clock stops (status `paused`)                                                                          |
| `resume`      | no   | no     | Clock restarts (status `live`)                                                                         |
| `timeout`     | yes  | no     | Burns the team's only timeout; clock stops for up to a minute                                          |
| `goal`        | yes  | opt.   | +1 goal for the team; in overtime, reaching the set score ends the game                                |
| `catch`       | yes  | opt.   | +3 score, shown with `*`; ahead → game over, tied/behind → overtime with set score                     |
| `blue_card`   | yes  | yes    | 1-minute penalty for the player                                                                        |
| `yellow_card` | yes  | yes    | 1-minute penalty; a second yellow for the same player means ejection (not yet implemented — see below) |
| `red_card`    | yes  | yes    | 2-minute penalty, never released early                                                                 |
| `ejection`    | yes  | yes    | Player is out for the rest of the game; no penalty countdown                                           |

## Penalty rules

- Blue and yellow cards: released at 1 minute of game time, or early whenever the opposing team
  scores (a goal or a catch). The active non-red penalty with the least time left is released,
  so an older card is never leapfrogged by a newer one.
- Red card: serves the full 2 minutes, no early release.
- Ejection: nothing to release; only the event log entry remains.
- Penalty clocks share the game clock — they only tick while the game is `live`.
- `playerNumber` is a jersey-number snapshot on purpose, not a reference to `player.id`, so
  history stays accurate when a roster is edited after the game. Do not "fix" this.

## Derived state — never store these

Score, game status, penalty remaining time and releases, the overtime set score and the game
clock are all recomputed by replaying the event log. Anything replayable is never stored. Deleting an event (the scorekeeper's undo) just deletes the row and replays everything.

## Planned, not yet implemented

- `get_seekers` (18:30), `flag_release` (19:00), `seeker_release` (20:00): automatic markers so
  a replayed game shows the full timeline.
- `penalty_release`: auto-created when a penalty is released; today releases are purely derived.
- Yellow escalation: two yellow cards for the same player mean ejection. The scorekeeper should
  be able to see that a player is already on a yellow.

## Rules for coding on the game model

- `applyEvent` in `src/lib/client/Game.svelte.ts` is the single interpreter of event types.
  Replay, live stream updates and local scoring all go through it — never apply an event's
  effect anywhere else.
- Replay requires events in `eventNum` order; `getGame` loads them ordered, `replayEvents`
  assumes ascending.
- The clock only accrues between consecutive events while the status was `live`; keep that in
  mind when adding new event types.
- The 20:00 catch rule and the banner reminders are UI-level (see `FlagWindow.svelte` and
  `TimerBanner.svelte`); they are not part of the event model.
