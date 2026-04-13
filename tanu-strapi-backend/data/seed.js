'use strict';

const CATEGORIES = [
  { name: 'Морозиво',         key: 'ice-cream' },
  { name: 'Сорбети',          key: 'sorbet'    },
  { name: 'Морозиво в банці', key: 'jar'       },
  { name: 'Рожки',            key: 'cone'      },
];

const PRODUCTS = [
  // Морозиво
  { name: 'Макадамія',          slug: 'makadamiia',              price: 100, category: 'ice-cream', description: 'Вершкове морозиво з шматочками горіхів макадамія та медом' },
  { name: 'Анчан',              slug: 'anchan',                  price: 90,  category: 'ice-cream', description: 'Блакитне морозиво з квіток метелика з делікатним квітковим смаком' },
  // Сорбети
  { name: 'Малина',             slug: 'malyna',                  price: 75,  category: 'sorbet', description: 'Інтенсивний сорбет зі свіжої малини без додавання вершків' },
  { name: 'Манго',              slug: 'mango',                   price: 80,  category: 'sorbet', description: 'Стиглий тропічний манго у вигляді охолоджуючого сорбету' },
  { name: 'Гранат',             slug: 'hranat',                  price: 80,  category: 'sorbet', description: 'Кислуватий та освіжаючий сорбет з гранатовим соком' },
  { name: 'Жасмин + Порічка',  slug: 'zhasmyn-porychka',        price: 85,  category: 'sorbet', description: 'Квітковий аромат жасмину поєднується з кислинкою чорної порічки' },
  // Морозиво в банці
  { name: 'Полуниця + Базилік', slug: 'polunytsia-bazylyk-banka', price: 120, category: 'jar', description: 'Класичне поєднання полуниці з пряним базиліком у маленькій баночці' },
  { name: 'Персик + Розмарин',  slug: 'pershyk-rozmaryn-banka',  price: 125, category: 'jar', description: "Сонячний персик з трав'яною ноткою розмарину — несподівано гарно" },
  { name: 'Йогурт + Лохина',   slug: 'yohurt-lokhyna-banka',    price: 115, category: 'jar', description: 'Легкий йогуртовий пломбір з лісовою лохиною у баночці' },
  { name: 'Куркума + Імбир',   slug: 'kurkuma-imber-banka',     price: 118, category: 'jar', description: 'Зігрівальний та яскравий смак куркуми з пряним імбиром' },
  // Рожки
  { name: 'Рожок класичний',   slug: 'rozhok-klasychnyi',       price: 60,  category: 'cone', description: 'Хрустка вафельна ріжка з однією кулькою морозива на вибір' },
  { name: 'Рожок шоколадний',  slug: 'rozhok-shokoladnyi',      price: 70,  category: 'cone', description: 'Вафельна ріжка, вкрита темним шоколадом та горіховою крихтою' },
  { name: 'Рожок подвійний',   slug: 'rozhok-podoiinyi',        price: 80,  category: 'cone', description: 'Велика хрустка ріжка з двома кульками морозива та топінгом' },
];

module.exports = async ({ strapi }) => {
  // Пропускаємо якщо дані вже є
  const existing = await strapi.db.query('api::category.category').count();
  if (existing > 0) return;

  console.log('[TANU] Seed: заповнення початкових даних...');

  // Створюємо категорії та зберігаємо їх id
  const catMap = {};
  for (const cat of CATEGORIES) {
    const created = await strapi.db.query('api::category.category').create({ data: cat });
    catMap[cat.key] = created.id;
    console.log(`[TANU] Категорія: ${cat.name}`);
  }

  // Створюємо продукти
  for (const product of PRODUCTS) {
    await strapi.db.query('api::product.product').create({
      data: {
        name:        product.name,
        slug:        product.slug,
        price:       product.price,
        description: product.description,
        category:    catMap[product.category],
      },
    });
    console.log(`[TANU] Продукт: ${product.name}`);
  }

  console.log('[TANU] Seed завершено: 4 категорії, 13 продуктів.');
};
