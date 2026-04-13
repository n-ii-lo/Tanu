# TANU - Швидкий старт для Strapi Cloud

## ✅ Що готово

- ✅ **Структура Strapi проекту** - всі контент-типи (Category, Product) налаштовані
- ✅ **Seed script** - автоматичне заповнення даними
- ✅ **Fallback дані** - 13 продуктів + 4 категорії
- ✅ **Всі потрібні поля**: name, slug, price, description, image, category relation
- ✅ **Документація** - повна інструкція в `STRAPI_SETUP_UK.md`

## 🚀 Покрокова інструкція для Strapi Cloud

### Крок 1: Підготуйте проект

```bash
# Перейдіть в папку Strapi проекту
cd tanu-strapi-backend

# Встановіть залежності
npm install
```

### Крок 2: Запуште на GitHub

```bash
# Ініціалізуйте git (якщо ще не зроблено)
git init

# Додайте всі файли
git add .

# Створіть коміт
git commit -m "Initial Strapi project with seed data"

# Створіть новий репозиторій на GitHub.com
# Потім підключіть його:
git remote add origin https://github.com/ВАШ_USERNAME/tanu-strapi-backend.git
git branch -M main
git push -u origin main
```

> **⚠️ УВАГА**: Не пуште `node_modules`, `.env`, `.cache` - вони в `.gitignore`

### Крок 3: Деплой на Strapi Cloud

1. **Відкрийте** [strapi.cloud](https://strapi.cloud)
2. **Увійдіть** в свій акаунт
3. **Натисніть** "New Project"
4. **Підключіть** GitHub акаунт (якщо ще не підключено)
5. **Оберіть** репозиторій `tanu-strapi-backend`
6. **Налаштуйте**:
   - Project Name: `Tanu Ice Cream`
   - Environment: `Production`
7. **Натисніть** "Deploy"
8. **Зачекайте** 2-3 хвилини

### Крок 4: Налаштуйте адмінку

Після завершення деплою:

1. **Відкрийте** адмінку: `https://ВАШ-ПРОЕКТ.strapiapp.com/admin`
2. **Створіть** адмін акаунт:
   - Email
   - Password
   - First Name, Last Name
3. **Запустіть Seed** (автоматичне заповнення даними):
   - В Strapi Cloud перейдіть в **Settings** → **Community Plugins** → **Data Management**
   - Або використайте локальний seed перед деплоєм:
     ```bash
     npm run develop
     # Дані будуть автоматично додані при першому запуску
     ```

### Крок 5: Створіть API токен

1. **В адмінці** перейдіть: **Settings** → **Global Settings** → **API Tokens**
2. **Натисніть** "Create new API Token"
3. **Заповніть**:
   - Name: `Tanu Frontend`
   - Description: `Read-only access for website`
   - Token duration: `Unlimited`
   - Type: **Custom**
   - Permissions:
     - ✅ Content: `Product` → `find`, `findOne`
     - ✅ Content: `Category` → `find`, `findOne`
4. **Натисніть** "Save"
5. **Скопіюйте токен** (з'явиться тільки один раз!)

### Крок 6: Оновіть frontend

Відкрийте `index.js` в головному проекті та замініть:

```javascript
var CONFIG = {
  STRAPI_BASE: 'https://ВАШ-ПРОЕКТ.strapiapp.com',  // ← Вставте URL
  STRAPI_PATH: '/api/products?populate=category,image',
  API_TOKEN: 'eyJhbGci...',  // ← Вставте токен
  FETCH_TIMEOUT_MS: 5000
};
```

### Крок 7: Завантажте картинки

1. **В адмінці**: **Content Manager** → **Products**
2. **Відкрийте** продукт
3. **Натисніть** на поле Image → "Upload files"
4. **Оберіть** картинку з папки `Tanu.hyperesources/`
5. **Натисніть** "Save" та "Publish"

**Список картинок для завантаження:**
- макадамія.png
- анчан.png
- малина.png
- манго.png
- гранат.png
- жасмин + порічка.png
- полуниця + базилік.png
- персик + розмарин.png
- йогурт + лохина.png
- куркума.png
- тану_6511.png
- тану_6511-1.png
- тану24_5328.png

### Крок 8: Перевірте API

Відкрийте в браузері:
```
https://ВАШ-ПРОЕКТ.strapiapp.com/api/products?populate=*
```

Має повернути JSON з 13 продуктами.

### Крок 9: Перевірте frontend

1. **Відкрийте** ваш сайт
2. **Натисніть** кнопку меню
3. **Перевірте** що продукти завантажуються з Strapi

## 👥 Додавання співробітника

1. **В адмінці**: **Settings** → **Administration Panel** → **Users**
2. **Натисніть** "Invite new user"
3. **Введіть** email співробітника
4. **Оберіть роль**: **Editor**
   - ✅ Може редагувати продукти
   - ✅ Може завантажувати картинки
   - ✅ Може публікувати зміни
   - ❌ Не може видаляти користувачів
   - ❌ Не може змінювати налаштування
5. **Натисніть** "Send invitation"

## 📋 Структура даних

### Category (Категорія)
| Поле | Тип | Обов'язкове | Опис |
|------|-----|-------------|------|
| name | string | ✅ | Назва категорії |
| key | uid | ✅ | Унікальний ідентифікатор |
| products | relation | ❌ | Зв'язок з продуктами |

### Product (Продукт)
| Поле | Тип | Обов'язкове | Опис |
|------|-----|-------------|------|
| name | string | ✅ | Назва продукту |
| slug | uid | ✅ | URL-friendly ідентифікатор |
| category | relation | ❌ | Зв'язок з категорією |
| price | decimal | ✅ | Ціна в грн |
| description | text | ❌ | Опис продукту |
| image | media | ❌ | Картинка продукту |

## 🆘 Troubleshooting

### Fallback дані замість Strapi
**Проблема**: Сайт показує fallback дані
**Рішення**:
1. Перевірте що `STRAPI_BASE` правильний
2. Перевірте що `API_TOKEN` дійсний
3. Відкрийте Network tab в DevTools та перевірте запит

### CORS помилка
**Проблема**: CORS policy blocked
**Рішення**:
1. В адмінці: **Settings** → **Global Settings** → **CORS**
2. Додайте ваш домен: `https://ваш-сайт.com`

### 403 Forbidden
**Проблема**: API повертає 403
**Рішення**:
1. Перевірте що токен має права на `Product` та `Category`
2. Перевірте що токен не закінчився

### Картинки не показуються
**Проблема**: Images не завантажуються
**Рішення**:
1. Переконайтесь що завантажили картинки в кожен продукт
2. Переконайтесь що продукт опубліковано (Publish)
3. Перевірте що `populate=category,image` в запиті

## 📞 Підтримка

- **Strapi Docs**: [docs.strapi.io](https://docs.strapi.io)
- **Strapi Cloud**: [docs.strapi.cloud](https://docs.strapi.cloud)
- **Community**: [forum.strapi.io](https://forum.strapi.io)

---

**Готово!** 🎉 Ваш проект готовий для деплою на Strapi Cloud!
