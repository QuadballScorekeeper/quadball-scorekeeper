import { expect, test } from 'vitest';
import { formatTime, isOvertime } from './utils';

test('formats 1001 to "0:1"', () => expect(formatTime(1001)).toBe('00:01'));

test('isOvertime should return false if catching team leads', () => {
    const score = {
      'Team A': 30,
      'Team B': 0,
    };
    const catchingTeamName = 'Team A';
    const otherTeamName = 'Team B';

    expect(isOvertime(score, catchingTeamName, otherTeamName)).toBe(false);
  });

  test('isOvertime should return true if teams tie', () => {
    const score = {
      'Team A': 30,
      'Team B': 30,
    };
    const catchingTeamName = 'Team A';
    const otherTeamName = 'Team B';

    expect(isOvertime(score, catchingTeamName, otherTeamName)).toBe(true);
  });

  test('isOvertime should return true if catching team trails', () => {
    const score = {
      'Team A': 30,
      'Team B': 40,
    };
    const catchingTeamName = 'Team A';
    const otherTeamName = 'Team B';

    expect(isOvertime(score, catchingTeamName, otherTeamName)).toBe(true);
  });