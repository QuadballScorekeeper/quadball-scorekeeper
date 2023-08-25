import { expect, test } from 'vitest';
import { formatTime } from './utils';

test('formats 1001 to "0:1"', () => expect(formatTime(1001)).toBe('0:1'));
