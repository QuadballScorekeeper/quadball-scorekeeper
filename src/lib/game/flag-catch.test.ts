import { expect, test } from 'vitest';
import { isOvertime } from './flag-catch';

test('isOvertime true if catching team leads', () => expect(isOvertime(30, 0)).toBe(false));
test('isOvertime false if teams tie', () => expect(isOvertime(30, 30)).toBe(true));
test('isOvertime false if catching team trails', () => expect(isOvertime(0, 30)).toBe(true));
