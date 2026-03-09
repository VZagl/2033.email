import { describe, expect, it } from 'vitest';

import { ENUM_WORK_ITEM_RESULT, WorkItemResult } from '../../src/common/constWorkItemResult.js';

describe('constWorkItemResult', () => {
	it('должен содержать ожидаемые коды результата', () => {
		expect(ENUM_WORK_ITEM_RESULT.Ok).toBe(0);
		expect(ENUM_WORK_ITEM_RESULT.Error).toBe(1);
	});

	it('должен собирать объект результата с payload', () => {
		const result = WorkItemResult(ENUM_WORK_ITEM_RESULT.Ok, { result: 'ok' });

		expect(result).toEqual({
			code: 0,
			data: [{ result: 'ok' }],
		});
	});
});
