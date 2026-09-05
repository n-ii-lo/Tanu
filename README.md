# TANU — сайт кафе-морозива

Статичний сайт: Hype-сцена + попover-меню морозива. Збірки як такої немає —
браузер читає готові файли. Каталог зберігається в JSON і редагується
через Sveltia CMS (`/admin`), яка комітить зміни прямо в репозиторій.

## Структура

```
index.html              головна сторінка (Hype-контейнер + розмітка меню)
index.css               стилі UI-шару (кнопка, попover, картки)
index.js                логіка меню: пошук, категорії, свайп, рендер карток
data/categories.json    категорії меню          ← редагується в /admin
data/products.json      товари                  ← редагується в /admin
assets/products/        фото товарів            ← сюди CMS кладе нові фото
Tanu.hyperesources/     ресурси Hype-сцени (не редагувати руками)
favicon/                іконки + site.webmanifest
seo/                    robots.txt, sitemap.xml, llm.txt, верифікація Google
                        ⚠ при збірці лягають у корінь сайту
admin/                  Sveltia CMS: index.html + config.yml
scripts/static-server.js  локальний сервер (npm run dev / npm run preview)
scripts/build.js          збірка в dist/ для заливки на сервер
```

## Локальна розробка

```bash
npm run dev       # http://localhost:3000 — віддає файли з кореня репозиторію
```

Змінюєш `data/products.json` → перезавантажуєш сторінку → бачиш зміни.
JSON тягнеться з `cache: 'no-cache'`, тож правки не залипають у кеші.

## Збірка для сервера

```bash
npm run build     # збирає dist/ — рівно те, що має лежати на сервері
npm run preview   # http://localhost:3000 — віддає вже зібраний dist/
```

`npm run build` копіює у `dist/` фронт, дані, фото, Hype-сцену, favicon та
адмінку, піднімає вміст `seo/` у корінь і перевіряє, що кожне фото з
`products.json` реально існує на диску.

Далі вміст `dist/` (саме вміст, не саму папку) заливається в корінь сайту
на сервері.

## Адмінка

`/admin` — Sveltia CMS. Вхід через GitHub, зміни зберігаються комітом у
репозиторій. Щоб вона запрацювала, потрібно один раз налаштувати:

1. воркер `sveltia-cms-auth` на Cloudflare Workers (OAuth-міст до GitHub);
2. GitHub OAuth App, її Client ID / Secret прописати змінними воркера;
3. у `admin/config.yml` заповнити `repo`, `branch` і `base_url` воркера.

Версія CMS зафіксована в `admin/index.html` разом із SRI-хешем. При оновленні
версії обов'язково перерахувати хеш — інакше адмінка перестане завантажуватись.

## Що не в CMS

Телефон, адреса, графік роботи, тексти інтерфейсу і GTM-контейнер
(`GTM-W9RGT4P`) зашиті в `index.html` та `seo/llm.txt` — редагуються тільки в коді.
