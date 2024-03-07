# 2033.email

Если в файле `.env` присутствует `debug_to`, то отправка происходит на этот email, иначе на email из `на_отправку\лицевой\email.json`

Каталог с файлами `на_отправку` прописать в файле: `src\_run.js` строка: `store.dirInp =`

Обычно это: каталог `inp\` этого проекта.

## Результат работы

сохраняется в файле `...\на_отправку\email.json`.

При переборе файлов на отправку, если для этого лицевого в `...\на_отправку\email.json` результат предыдущей обработки `"code": 0`, то этот лицевой пропускается.

Таким образом, при повторных запусках программы, не отправляются уже отправленные данные.

## пример файла `.env`:

```bash
	smtp_server = 'smtp.ukr.net'
	smtp_user = '...@ukr.net'
	smtp_pwd = '...'
	#debug_to = "...@ukr.net"
```

---

## Ссылки:

- https://nodemailer.com/smtp/oauth2/
