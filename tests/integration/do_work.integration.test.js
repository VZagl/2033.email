import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ENUM_WORK_ITEM_RESULT } from '../../src/common/constWorkItemResult.js';
import do_w_item from '../../src/do_w_item.js';
import do_work from '../../src/do_work.js';

vi.mock('../../src/do_w_item.js', () => ({
	default: vi.fn(),
}));

describe('do_work (integration)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		global.store = {
			inputFiles: {},
			outJson: {},
		};
	});

	it('должен пропускать обработку, если элемент уже успешно обработан', async () => {
		global.store.inputFiles = {
			10001: ['email.json', 'bill.htm'],
		};
		global.store.outJson = {
			10001: {
				code: ENUM_WORK_ITEM_RESULT.Ok,
			},
		};

		await do_work(global.store);

		expect(do_w_item).not.toHaveBeenCalled();
		expect(global.store.outJson['10001'].code).toBe(ENUM_WORK_ITEM_RESULT.Ok);
	});

	it('должен записывать успешный результат при успешной обработке', async () => {
		global.store.inputFiles = {
			10002: ['email.json', 'bill.htm'],
		};
		do_w_item.mockResolvedValueOnce({ messageId: 'abc-123' });

		await do_work(global.store);

		expect(do_w_item).toHaveBeenCalledTimes(1);
		expect(global.store.outJson['10002'].code).toBe(ENUM_WORK_ITEM_RESULT.Ok);
		expect(global.store.outJson['10002'].data[0]).toEqual({
			result: { messageId: 'abc-123' },
		});
	});

	it('должен записывать ошибку при исключении в обработчике элемента', async () => {
		const reason = new Error('Ошибка отправки');
		global.store.inputFiles = {
			10003: ['email.json', 'bill.htm'],
		};
		do_w_item.mockRejectedValueOnce(reason);

		await do_work(global.store);

		expect(do_w_item).toHaveBeenCalledTimes(1);
		expect(global.store.outJson['10003'].code).toBe(ENUM_WORK_ITEM_RESULT.Error);
		expect(global.store.outJson['10003'].data[0].reason).toBe(reason);
	});
});
