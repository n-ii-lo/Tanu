(function (root, factory) {
  var catalog = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = catalog;
  }

  if (root) {
    root.TANU_CATALOG = catalog;
    root.TANU_FALLBACK_PRODUCTS = catalog.buildFallbackProducts('assets/products');
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var categories = [
    { key: 'ice-cream', label: 'Морозиво' },
    { key: 'sorbet', label: 'Сорбети' },
    { key: 'jar', label: 'Морозиво в банці' },
    { key: 'cone', label: 'Рожки' }
  ];

  var products = [
    {
      id: 4,
      name: 'Макадамія',
      category: 'ice-cream',
      price: 100,
      description: 'Вершкове морозиво з шматочками горіхів макадамія та медом',
      imageFile: 'makadamiia.png',
      slug: 'makadamiia'
    },
    {
      id: 5,
      name: 'Анчан',
      category: 'ice-cream',
      price: 90,
      description: 'Блакитне морозиво з квіток метелика з делікатним квітковим смаком',
      imageFile: 'anchan.png',
      slug: 'anchan'
    },
    {
      id: 6,
      name: 'Малина',
      category: 'sorbet',
      price: 75,
      description: 'Інтенсивний сорбет зі свіжої малини без додавання вершків',
      imageFile: 'malyna.png',
      slug: 'malyna'
    },
    {
      id: 7,
      name: 'Манго',
      category: 'sorbet',
      price: 80,
      description: 'Стиглий тропічний манго у вигляді охолоджуючого сорбету',
      imageFile: 'mango.png',
      slug: 'mango'
    },
    {
      id: 8,
      name: 'Гранат',
      category: 'sorbet',
      price: 80,
      description: 'Кислуватий та освіжаючий сорбет з гранатовим соком',
      imageFile: 'hranat.png',
      slug: 'hranat'
    },
    {
      id: 9,
      name: 'Жасмин + Порічка',
      category: 'sorbet',
      price: 85,
      description: 'Квітковий аромат жасмину поєднується з кислинкою чорної порічки',
      imageFile: 'zhasmyn-porychka.png',
      slug: 'zhasmyn-porychka'
    },
    {
      id: 10,
      name: 'Полуниця + Базилік',
      category: 'jar',
      price: 120,
      description: 'Класичне поєднання полуниці з пряним базиліком у маленькій баночці',
      imageFile: 'polunytsia-bazylyk.png',
      slug: 'polunytsia-bazylyk-banka'
    },
    {
      id: 11,
      name: 'Персик + Розмарин',
      category: 'jar',
      price: 125,
      description: "Сонячний персик з трав'яною ноткою розмарину — несподівано гарно",
      imageFile: 'persyk-rozmaryn.png',
      slug: 'pershyk-rozmaryn-banka'
    },
    {
      id: 12,
      name: 'Йогурт + Лохина',
      category: 'jar',
      price: 115,
      description: 'Легкий йогуртовий пломбір з лісовою лохиною у баночці',
      imageFile: 'yohurt-lokhyna.png',
      slug: 'yohurt-lokhyna-banka'
    },
    {
      id: 13,
      name: 'Куркума + Імбир',
      category: 'jar',
      price: 118,
      description: 'Зігрівальний та яскравий смак куркуми з пряним імбиром',
      imageFile: 'kurkuma-imber.png',
      slug: 'kurkuma-imber-banka'
    },
    {
      id: 26,
      name: 'Рожок класичний',
      category: 'cone',
      price: 60,
      description: 'Хрустка вафельна ріжка з однією кулькою морозива на вибір',
      imageFile: 'rozhok-klasychnyi.png',
      slug: 'rozhok-klasychnyi'
    },
    {
      id: 27,
      name: 'Рожок шоколадний',
      category: 'cone',
      price: 70,
      description: 'Вафельна ріжка, вкрита темним шоколадом та горіховою крихтою',
      imageFile: 'rozhok-shokoladnyi.png',
      slug: 'rozhok-shokoladnyi'
    },
    {
      id: 28,
      name: 'Рожок подвійний',
      category: 'cone',
      price: 80,
      description: 'Велика хрустка ріжка з двома кульками морозива та топінгом',
      imageFile: 'rozhok-podviinyi.png',
      slug: 'rozhok-podoiinyi'
    }
  ];

  function buildFallbackProducts(imageBase) {
    return products.map(function (product) {
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: String(product.price) + ' грн',
        description: product.description,
        image: imageBase + '/' + product.imageFile,
        slug: product.slug
      };
    });
  }

  return {
    categories: categories,
    products: products,
    buildFallbackProducts: buildFallbackProducts
  };
});
