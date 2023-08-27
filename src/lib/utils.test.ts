import { expect, test } from 'vitest';
import { formatTime, isOvertime } from './utils';

test('formats 1001 to "0:1"', () => expect(formatTime(1001)).toBe('00:01'));

test('isOvertime true if catching team leads', () => expect(isOvertime(30, 0)).toBe(false));
test('isOvertime false if teams tie', () => expect(isOvertime(30, 30)).toBe(true));
test('isOvertime false if catching team trails', () => expect(isOvertime(0, 30)).toBe(true));
