import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sendMailMock, createTransportMock } = vi.hoisted(() => {
	const sendMailMock = vi.fn();
	const createTransportMock = vi.fn(() => ({
		sendMail: sendMailMock,
	}));
	return { sendMailMock, createTransportMock };
});

vi.mock('nodemailer', () => ({
	default: {
		createTransport: createTransportMock,
	},
}));

vi.mock('fs-extra', () => ({
	default: {
		readFileSync: vi.fn(() => Buffer.from('<html></html>')),
	},
}));

vi.mock('iconv-lite', () => ({
	default: {
		decode: vi.fn(() => '<meta charset=windows-1251><body>Тест</body>'),
		encode: vi.fn((value) => value),
	},
}));

import sendEmail from '../../src/common/email.js';

describe('email', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		global.store = {
			env: {
				smtp_user: 'smtp-user@example.com',
			},
		};
		sendMailMock.mockResolvedValue({ messageId: 'msg-1' });
	});

	it('должен передавать bcc из store.env.smtp_user в sendMail', async () => {
		const config = {
			host: 'smtp.example.com',
			auth: { user: 'smtp-user@example.com', pass: 'secret' },
			to: 'client@example.com',
			body: { file: 'fake/path/mail.htm' },
		};

		await sendEmail(config);

		expect(createTransportMock).toHaveBeenCalledTimes(1);
		expect(sendMailMock).toHaveBeenCalledTimes(1);
		expect(sendMailMock).toHaveBeenCalledWith(
			expect.objectContaining({
				to: 'client@example.com',
				bcc: 'smtp-user@example.com',
			}),
		);
	});

	it('должен выбрасывать ошибку, если store.env.smtp_user пустой', async () => {
		global.store.env.smtp_user = '   ';

		const config = {
			host: 'smtp.example.com',
			auth: { user: 'smtp-user@example.com', pass: 'secret' },
			to: 'client@example.com',
			body: { file: 'fake/path/mail.htm' },
		};

		await expect(sendEmail(config)).rejects.toMatchObject({
			descr: 'Некорректная настройка store.env.smtp_user: требуется обязательный email',
		});
		expect(createTransportMock).not.toHaveBeenCalled();
		expect(sendMailMock).not.toHaveBeenCalled();
	});

	it('должен выбрасывать ошибку, если store.env.smtp_user не email', async () => {
		global.store.env.smtp_user = 'not-an-email';

		const config = {
			host: 'smtp.example.com',
			auth: { user: 'smtp-user@example.com', pass: 'secret' },
			to: 'client@example.com',
			body: { file: 'fake/path/mail.htm' },
		};

		await expect(sendEmail(config)).rejects.toMatchObject({
			descr: 'Некорректная настройка store.env.smtp_user: требуется обязательный email',
		});
		expect(createTransportMock).not.toHaveBeenCalled();
		expect(sendMailMock).not.toHaveBeenCalled();
	});
});
