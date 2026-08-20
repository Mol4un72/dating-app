# Backlog після повного аудиту

Дата аудиту: 2026-08-19. Проєкт — Next.js 16 demo-клієнт: Prisma налаштована, але моделей, міграцій, API routes/server actions і тестів немає. Дані застосунку зараз зберігаються у `lib/data.ts`, React state та `localStorage`.

Позначки: **P0** — блокує якість/реліз, **P1** — основна функціональність, **P2** — покращення.

## 1. Frontend-only: зміни, які не залежать від бекенду

Ці задачі можна завершити без API, бази даних, авторизації або зміни серверних контрактів.

### P0

- [x] Відновити чистий `npm run lint`. У `components/people/profile-card.tsx` `useHydrated` синхронно викликає `setState` у `useLayoutEffect`, тому ESLint завершується помилкою `react-hooks/set-state-in-effect`. Потрібно прибрати цей патерн або реалізувати SSR-safe стан без синхронного оновлення в effect.

### P1

- [x] Зробити інтерактивні елементи доступними з клавіатури. `components/tag.tsx` і `components/people/liked-card.tsx` використовують клікабельні `span`; замінити їх на `button` (або додати коректні role, keyboard handlers і focus state). Для кнопки серця у Likes виправити `aria-label`: дія там — видалити like, а не поставити його.
- [x] Виправити недоступні/неповні кнопки у локальному UI: додано `type="button"` до не-submit кнопок, доступну назву кнопці закриття delete-modal у `app/(app)/profile/settings/page.tsx` і `focus-visible` індикатори для custom controls; неінтерактивні `Tag` більше не потрапляють у tab order.
- [ ] Уніфікувати модалки через `components/modal.tsx`. Logout і Delete Account у Settings зараз написані окремо, тому не мають гарантованих focus trap, Escape та повернення фокусу; базовий `Modal` на `@base-ui/react/dialog` це вже забезпечує.
- [ ] Замінити `alert()` при валідації фото у `app/(app)/profile/page.tsx` на inline error/toast. Повідомлення мають бути зрозумілими, не блокувати браузер і скидатися при успішному виборі файлу.
- [ ] Керувати життєвим циклом preview URL. Викликати `URL.revokeObjectURL` при заміні/видаленні фото та unmount у Profile і Chat, інакше локальні image-preview накопичують пам’ять.
- [ ] Додати клієнтську перевірку фото до створення preview: whitelist MIME (`image/jpeg`, `image/png`, `image/webp`), ліміт розміру, повідомлення про помилку; у Chat зараз дозволено кожне `image/*`, у Register «upload» фактично підставляє demo-фото.
- [ ] Перетворити demo-вибір фотографій у Register на справжній file picker з preview, видаленням фото й вимогою мінімум двох зображень. Це лише UI-потік; його підключення до збереження описано в розділі 2.
- [ ] Виправити неактивні навігаційні елементи: Forgot password у Login та всі `href="#"` у Footer мають або вести на реальні локальні сторінки/якорі, або бути прибрані до появи контенту.
- [ ] Виправити локальні UI-дефекти: `text-sm-semibold` у `components/tab-panel.tsx` не є класом Tailwind; використати `text-sm font-semibold`. Замінити `<a href="/discover">` у Likes на `next/link`, щоб не робити повний reload.
- [ ] Відокремити стан toast від таймерів: зберігати id timeout у ref і очищати при unmount у Profile/Settings, щоб уникати setState після розмонтування.

### P2

- [ ] Прибрати lint warnings: невикористані `useEffect` у Profile та Likes context, `Select` у Settings, `onBlockUser` у `TabPanel`; після цього зробити lint обов’язковою CI-перевіркою.
- [ ] Замінити статичні `<img>` на `next/image`, додати правильні `sizes`, width/height і placeholder. ESLint вказує на Profile, Chat, cards, Hero, Auth layout та Avatar. Для майбутніх user-upload окремо налаштувати image loader/remote patterns.
- [ ] Вирівняти форматування та стиль імпортів у сторінках Profile/Settings; прибрати зайві коментарі й дублювання JSX. Додати Prettier або аналогічну форматувальну перевірку до CI.
- [ ] Додати frontend unit/component тести: age/distance/sex filtering у `SwipeDeck`, empty state Discover, like/unlike, доступність modal і клавіатурна взаємодія з Tag/heart. Це тести без мережі та БД.
- [ ] Додати responsive та accessibility smoke-тести для mobile-nav, клавіатури/soft keyboard, модалок та контрасту.
- [ ] Додати i18n або хоча б централізований словник текстів: інтерфейс зараз англійський, хоча Settings пропонує українську, і зміна language не змінює UI.

## 2. Full-stack: frontend + backend/API

Ці пункти потребують і серверної реалізації, і підключення UI. Клієнтські mock-стани не можна вважати завершеною функціональністю.

### P0 — безпека та базова функціональність

- [ ] Реалізувати authentication/session lifecycle: Register створює користувача, Login перевіряє credentials, Logout завершує сесію, Reset password працює через безпечний flow. Зараз Login/Register без перевірки просто ведуть на `/discover`, а всі `(app)` маршрути відкриті без сесії.
- [ ] Захистити приватні маршрути й дані на сервері (middleware/server-side session check). Не покладатися на клієнтський redirect або приховування кнопок.
- [ ] Описати й реалізувати доменну модель і міграції: `User`, `Profile`, `Photo`, `Preference`, `Like`, `Match`, `Conversation`, `Message`, `Notification`, `Block`, `Report` (та необхідні enums/індекси/unique constraints). `prisma/schema.prisma` зараз не містить жодної моделі.
- [ ] Замінити `lib/data.ts` як runtime source of truth на авторизовані серверні запити. Demo-fixtures лишити лише для seed/dev режиму; не змішувати їх із production-кодом.
- [ ] Реалізувати серверну валідацію для всіх мутацій (Zod/аналог), авторизацію за current session, чіткі error states та аудит небезпечних дій. Клієнтська валідація — лише додатковий UX-шар.

### P1 — продуктова поведінка

- [ ] Підключити Discover до серверного пошуку: фільтрувати за preference, віком, статтю, дистанцією, blocked/visibility статусом і cursor pagination. Поточний `SwipeDeck` уже фільтрує demo-масив у браузері, але не масштабується й не є захистом даних.
- [ ] Зберігати та віддавати preferences (`interestedIn`, age range, distance) для поточного користувача. Узгодити типи: замість UI-рядків на кшталт `"25 – 35"` передавати мінімальний/максимальний вік та числову дистанцію; `51` не має бути прихованим значенням «будь-яка відстань» в API.
- [ ] Реалізувати Like/Unlike як серверну операцію з optimistic update та rollback. На взаємному like створювати Match і лише тоді дозволяти/створювати Conversation; Likes page має читати дані з сервера.
- [ ] Виправити зв’язок профіль ↔ чат через реальні conversation IDs. Зараз `app/(app)/profile/[id]/page.tsx` переходить на `/chat/${user.id}`, але Chat route очікує `c1`, `c2` тощо; невідомий chat ID непомітно підміняється `conversations[0]`. Потрібні endpoint «get or create conversation for match» і 404/empty state для неіснуючої розмови.
- [ ] Зберігати повідомлення, останнє повідомлення, unread count, mute status і пагінацію на сервері. Наразі новий текст існує лише в `Conversation` state, а всі чати беруть статичні масиви.
- [ ] Додати безпечний upload pipeline для фото профілю і вкладень чату: signed upload/серверне приймання, MIME/розмір на сервері, перевірка файлу, приватне або контрольоване сховище, image processing та видалення orphan-файлів.
- [ ] Реалізувати Block/Unblock і Report через ідентифікатори користувачів. Заблокований профіль має зникати з Discover/Likes/Chat, бути недоступним напряму та не отримувати повідомлень. Зараз Profile пише імена до `localStorage`, тоді як Settings зберігає email/phone — це дві несумісні моделі.
- [ ] Підключити зміни Profile, Photos, Interests, Settings, privacy flags, password і delete-account до авторизованих серверних команд. Зараз інтерфейс показує success/toast без реального збереження; видалення акаунта лише очищає localStorage і робить redirect.
- [ ] Реалізувати notifications як серверний стан: отримання списку, unread counter, позначення прочитаним по одній або явною дією. Поточне натискання дзвіночка одразу позначає всі notifications прочитаними лише в локальному state.
- [ ] Підключити Google/Apple кнопки тільки після налаштування OAuth callback, account linking та обробки помилок; інакше позначити їх disabled/coming soon.

### P2 — надійність, захист і масштабування

- [ ] Додати 18+ age gate та серверну перевірку дати народження; продумати country/consent вимоги до персональних даних.
- [ ] Додати email verification, password hashing, rate limits для auth/likes/messages/reports, захист від enumeration, CSRF strategy для мутацій, secure cookies та security headers.
- [ ] Побудувати moderation workflow: категорії report, статуси розгляду, evidence, admin access, block enforcement і audit log.
- [ ] Додати abuse protection для чату: rate limiting, spam rules, content/media moderation, limits на кількість файлів і реакцію на скарги.
- [ ] Додати інтеграційні та E2E тести з тестовою БД: auth і route guard, access control, likes/matches, block/report, chat isolation, uploads, delete-account та pagination/filtering.
- [ ] Додати observability: структуровані server logs без PII, error tracking, health/readiness check, міграційний rollout і backup/restore plan для PostgreSQL та файлів.

## 3. Технічні ризики та перевірки

- [ ] `npx tsc --noEmit` має лишатися обов’язковим у CI; під час аудиту він проходить.
- [ ] `npm run lint` зараз не проходить: 1 error і 15 warnings. Блокуючий error описаний у frontend P0.
- [ ] `npm run build` у поточному середовищі зупиняється на завантаженні Google Fonts (`Geist`, `Plus Jakarta Sans`) з `fonts.googleapis.com`. Для відтворюваного CI або надати мережевий доступ, або self-host fonts/fallback strategy.
- [ ] У репозиторії немає тестового runner і тестів; перед підключенням бекенду додати окремі scripts для unit, integration та E2E тестів.
