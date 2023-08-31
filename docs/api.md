# API

The API should support retrieving and updating state for one or multiple games.
It should also allow for other users to subscribe to ongoing games.

In the future it should support planning, viewing and running tournaments.

## Design choice

As the API is inherently command/action-based it is better suited by a `RPC-based API` than a `REST API`.
The commands/actions could be implemented through a `REST API` but it would require the client to have extensive knowledge of both the domain and the application data model to update the correct properties to the correct values for every action.
`RPC` would support implementing clear and concise commands that offer validation and easy updates of the ongoing game. It would also enable the creation of events during the game.

## Endpoints

| Endpoint                   | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| /api/game/:id/start        | Starts a game                                                     |
| /api/game/:id/pause        | Pauses a game                                                     |
| /api/game/:id/resume       | Resume a game                                                     |
| /api/game/:id/scoreGoal    | Score a goal for a game                                           |
| /api/game/:id/annulGoal    | Annul a goal for a game                                           |
| /api/game/:id/issuePenalty | Issue a penalty in a game                                         |
| /api/game/:id/timeout      | Timeout a game. Same as pause, but can only be used once per team |
| /api/game/:id/flagCatch    | Flag catch in a game                                              |
