# Game events

Here is a list of all event that can happen during a game
They are used to build up the logical structure of games

## GoalScored \[timestamp, team, number?\]

Goal scored for **team**, potentially with **number** of scoring player

## Penalty \[timestamp, team, type, number\]

Penalty of **type** \{blue | yellow | red | ejection\} given to player **number** on team **team**

## PenaltyRelease \[**number**\]

Relase of player **number**

Should automatically be created when appropriate.

### Yellow and blue cards:

First of these two to occur:

- 1 minute after card was given
- When opposing team scores (if no other yellow/blue on same team with less time remaining)

### Red cards:

- 2 minutes after card was given

### Ejection:

- N/A

## Timeout \[timestamp, team\]

Timeout used by **team**

## GetSeekers \[\]

Reminder for score and timekeeper to get seekers from both teams
Should automatically be created at 18:30?

## FlagRelease \[\]

Should automatically be created at 19:00 (or 18:50?)

## SeekerRelease \[\]

Event for release of the seekers
Should automatically be created at 20:00 (or 19:50?)

## FlagCaught \[timestamp, team\]

**team** caught the flag

## OvertimeStart \[set_score\]

Overtime is started with set score **set_score**

## GameEnd \[timestamp\]

Event marking end of the game. Should be created by flag catch if catching team leads after catch
Or when a team reaches the set score in overtime
