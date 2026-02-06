> **Правила для ИИ:** соглашения по именованию в коде

# Конвенции именования

## Основные правила

- Переменные: `camelCase`
- Константы: `UPPER_CASE`
- interface: `i_camelCase`
- enum: `e_camelCase`
- Функции: `camelCase`
- Классы: `PascalCase`
- Компоненты: `PascalCase`

## Именование файлов

- **Обычные файлы: kebab-case** (например: `user-service.ts`, `weather-api.ts`)
- **React компоненты: PascalCase** (например: `UserProfile.tsx`, `WeatherCard.tsx`)

## Идентификаторы

**В структурах данных (JSON/интерфейсы):**

- Уникальный идентификатор: `id`
- Ссылка на другую сущность: `id_сущность` (например: `id_country`, `id_city`)

**В коде (переменные/параметры):**

- Соответствующие переменные: `idСущность` в camelCase (например: `idCountry`, `idCity`)

**Пример:**

```typescript
// В интерфейсе
interface i_city {
  id: string;
  id_country: string;
}

// В функциях
function getCity(idCity: string, idCountry: string) { ... }
```

## Чеклист проверки именования

- [ ] Переменные/функции: `camelCase`
- [ ] Константы: `UPPER_CASE`
- [ ] Классы/компоненты: `PascalCase`
- [ ] Интерфейсы: `i_camelCase`
- [ ] Enum: `e_camelCase`
- [ ] Обычные файлы: `kebab-case`
- [ ] React компоненты: `PascalCase`
- [ ] Идентификаторы: `id` и `id_сущность`
