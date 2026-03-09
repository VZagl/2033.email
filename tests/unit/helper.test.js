import { describe, expect, it } from 'vitest';

import { date2text } from '../../src/common/helper.js';

describe('date2text', () => {
	it('должен форматировать дату по умолчанию', () => {
		const date = new Date('2026-03-09T10:20:30.000Z');

		const result = date2text({ date });

		expect(result).toBe('2026-03-09');
	});

	it('должен использовать пользовательский разделитель', () => {
		const date = new Date('2026-03-09T10:20:30.000Z');

		const result = date2text({ date, separator: '.' });

		expect(result).toBe('2026.03.09');
	});
});
