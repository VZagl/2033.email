> **Правила для ИИ:** работа с Git (branching, merge, rebase)

# Правила работы с Git

## Стратегия ветвления: Feature-Branch Workflow

Использовать **feature-branch workflow** с короткоживущими ветками. Вся разработка ведётся в отдельных ветках.

**Структура веток:**

- **`main`**: готова к продакшену, защищена
- **`develop`**: интегрирует завершённые фичи, защищена (если отсутствует — использовать `main`)
- **Feature-ветки**: создаются из `develop`, короткоживущие, для одной фичи/бага

### Именование веток

Именовать ветки понятно и последовательно:

```bash
# Новая фича
git checkout -b feat/FEAT-123-add-user-profile

# Исправление бага
git checkout -b fix/BUG-456-auth-redirect-loop

# Рефакторинг
git checkout -b refactor/improve-logging-middleware
```

## Сообщения коммитов

**Основное правило:** Каждый коммит представляет одно логическое изменение.

**Формат:** Следовать Conventional Commits — `type(scope): описание`

Полные правила оформления сообщений коммитов в `docs/common/git-commit-description.md`.

**Пример атомарных коммитов:**

```bash
# Первый коммит - исправление
git commit -F .git-commit-msg.txt  # fix(auth): исправить обработку expired токена

# Второй коммит - новая фича
git commit -F .git-commit-msg.txt  # feat(profile): добавить просмотр профиля
```

## Rebase вместо Merge (на feature-ветках)

Поддерживать линейную историю на feature-ветках перед мерджем в `develop`.

### Очистка истории перед PR

Перед пушем feature-ветки для PR:

```bash
git fetch origin
git rebase -i origin/develop  # Сквошить WIP коммиты
git push --force-with-lease origin feature/my-feature
```

**ВАЖНО:** Force push только в свои feature-ветки. Никогда не делать force push в `main` или `develop`.

### Merge feature-веток с --no-ff и Conventional Commits

При мердже feature-ветки в `develop` всегда использовать `--no-ff` для сохранения истории. Сообщение merge-коммита должно быть в формате Conventional Commits.

**Процесс:**

```bash
git checkout develop
git pull origin develop

# Создать .git-commit-msg.txt с типом на основе коммитов ветки:
# fix(todolist): исправить валидацию key
#
# - исправить проверку key через console.error
# - обновить задачи для планирования исправления теста

git merge --no-ff fix/test-todolist-key-validation -F .git-commit-msg.txt
rm .git-commit-msg.txt  # или del в Windows

git push origin develop
git branch -d fix/test-todolist-key-validation  # Удалить временную ветку
```

**Определение типа merge-коммита:**

1. Посмотреть коммиты ветки: `git log feature/my-feature --oneline`
2. Определить основной тип (fix, feat, refactor)
3. Сформировать сообщение по Conventional Commits

## Git Hooks с pre-commit

Автоматизировать проверки качества кода до попадания в репозиторий.

**Установка:**

```bash
pip install pre-commit  # или через brew, npm
pre-commit install
pre-commit autoupdate
```

Hooks предотвращают: ошибки линтинга, несогласованность форматирования, случайные коммиты секретов.

**Примечание:** Конфигурация в `.pre-commit-config.yaml` специфична для каждого проекта.

## Гигиена репозитория

### .gitignore

Исключать сгенерированные файлы, зависимости, артефакты сборки и чувствительную информацию:

```
# Операционная система
.DS_Store, Thumbs.db

# Артефакты сборки
/dist/, /build/

# Зависимости
/node_modules/, /venv/, __pycache__/

# Файлы IDE
.idea/, .vscode/

# Секреты
.env, *.env, config.local.js
```

### Git LFS для больших файлов

Не коммитить большие бинарные файлы напрямую. Использовать Git LFS:

```bash
git lfs install
git lfs track "*.psd"
git lfs track "assets/*.mp4"
git add .gitattributes
git add my_large_file.psd
git commit -F .git-commit-msg.txt  # chore(assets): добавить файл через LFS
```

## Разрешение конфликтов

### Частое обновление

Часто подтягивать изменения из базовой ветки для минимизации конфликтов:

```bash
git checkout feature/my-feature
git pull origin develop --rebase
```

### Ручное разрешение конфликтов

Использовать инструмент мерджа IDE или `git mergetool`. Понимать каждое изменение.

```bash
git merge develop  # Git запросит разрешение конфликтов
# Разрешить вручную в IDE или через git mergetool
git add <разрешённые_файлы>
git commit -F .git-commit-msg.txt  # chore: разрешить конфликты
```

## Чеклист работы с Git

- [ ] Создана feature-ветка из develop/main с правильным именем
- [ ] Коммиты атомарные и следуют Conventional Commits
- [ ] Выполнен rebase на develop перед PR
- [ ] Merge с --no-ff и сообщением в формате Conventional Commits
- [ ] Конфликты разрешены вручную
- [ ] Временная ветка удалена после merge
