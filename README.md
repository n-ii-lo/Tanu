# Tanu

Понятная структура проекта:

- `index.html`, `index.css`, `index.js` — статический фронт сайта
- `api/strapi-products.js` — Vercel proxy до Strapi
- `data/catalog.js` — один источник каталога для fallback и сидинга Strapi
- `assets/products/` — отдельные картинки каталога для фронта
- `Tanu.hyperesources/` — только Hype-сцена и её ресурсы
- `strapi/` — CMS
- `strapi/seed-media/` — картинки, которые загружаются в Strapi при сидинге
- `seo/` — SEO-файлы
- `инструменты/` — служебные локальные папки и пояснения по ним

## Env

Теперь env разделен нормально:

- `.env.local` — только фронт и `vercel dev`
- `strapi/.env` — только backend Strapi

`APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`, `JWT_SECRET` лежат в `strapi/.env`.

`STRAPI_URL` и `STRAPI_API_TOKEN` лежат в `.env.local`.

Если Strapi крутится в Strapi Cloud, эти же backend-переменные должны быть продублированы в Variables проекта.

## Каталог

Каталог теперь живет в `data/catalog.js`.

Из него:

- фронт берет fallback-товары
- Strapi bootstrap заполняет категории и продукты при первом запуске CMS

Если меняешь товары, категории, описания или цены — меняй `data/catalog.js`.

## Что не переносилось

Некоторые скрытые папки должны оставаться в корне, иначе ломаются инструменты:

- `.vercel`
- `.idea`
- `.claude`

Остальное, что не влияет на рантайм сайта, вынесено в `инструменты/` или убрано.
