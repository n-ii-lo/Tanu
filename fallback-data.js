// TANU — Fallback product data (used when Strapi is unavailable)

const IMG_BASE = "Tanu.hyperesources/";

window.TANU_FALLBACK_PRODUCTS = [

  /* ─── Мороженое ───────────────────────────────────────────── */
  {
    id: 1,
    name: "Тайський чай",
    category: "ice-cream",
    price: "85 грн",
    description: "Ніжний молочний пломбір з ароматом тайського чаю та ваніллю",
    image: IMG_BASE + "тайський чай.png",
    slug: "tayskyi-chai"
  },
  {
    id: 2,
    name: "Матча + Полуниця",
    category: "ice-cream",
    price: "90 грн",
    description: "Кремова матча з'єднується з ягодами полуниці — свіжо та гармонійно",
    image: IMG_BASE + "матча + полуниця.png",
    slug: "matcha-polunytsia"
  },
  {
    id: 3,
    name: "Чорний кунжут",
    category: "ice-cream",
    price: "95 грн",
    description: "Насичений смак чорного кунжуту з легкою горіховою нотою",
    image: IMG_BASE + "кунжут чорний.png",
    slug: "chornyi-kunzhut"
  },
  {
    id: 4,
    name: "Макадамія",
    category: "ice-cream",
    price: "100 грн",
    description: "Вершкове морозиво з шматочками горіхів макадамія та медом",
    image: IMG_BASE + "макадамія.png",
    slug: "makadamiia"
  },
  {
    id: 5,
    name: "Анчан",
    category: "ice-cream",
    price: "90 грн",
    description: "Блакитне морозиво з квіток метелика з делікатним квітковим смаком",
    image: IMG_BASE + "анчан.png",
    slug: "anchan"
  },

  /* ─── Сорбети ─────────────────────────────────────────────── */
  {
    id: 6,
    name: "Малина",
    category: "sorbet",
    price: "75 грн",
    description: "Інтенсивний сорбет зі свіжої малини без додавання вершків",
    image: IMG_BASE + "малина.png",
    slug: "malyna"
  },
  {
    id: 7,
    name: "Манго",
    category: "sorbet",
    price: "80 грн",
    description: "Стиглий тропічний манго у вигляді охолоджуючого сорбету",
    image: IMG_BASE + "манго.png",
    slug: "mango"
  },
  {
    id: 8,
    name: "Гранат",
    category: "sorbet",
    price: "80 грн",
    description: "Кислуватий та освіжаючий сорбет з гранатовим соком",
    image: IMG_BASE + "гранат.png",
    slug: "hranat"
  },
  {
    id: 9,
    name: "Жасмин + Порічка",
    category: "sorbet",
    price: "85 грн",
    description: "Квітковий аромат жасмину поєднується з кислинкою чорної порічки",
    image: IMG_BASE + "жасмин + порічка.png",
    slug: "zhasmyn-porychka"
  },

  /* ─── Морожене в банці ────────────────────────────────────── */
  {
    id: 10,
    name: "Полуниця + Базилік",
    category: "jar",
    price: "120 грн",
    description: "Класичне поєднання полуниці з пряним базиліком у маленькій баночці",
    image: IMG_BASE + "полуниця + базилік.png",
    slug: "polunytsia-bazylyk-banka"
  },
  {
    id: 11,
    name: "Персик + Розмарин",
    category: "jar",
    price: "125 грн",
    description: "Сонячний персик з трав'яною ноткою розмарину — несподівано гарно",
    image: IMG_BASE + "персик + розмарин.png",
    slug: "pershyk-rozmaryn-banka"
  },
  {
    id: 12,
    name: "Йогурт + Лохина",
    category: "jar",
    price: "115 грн",
    description: "Легкий йогуртовий пломбір з лісовою лохиною у баночці",
    image: IMG_BASE + "йогурт + лохина.png",
    slug: "yohurt-lokhyna-banka"
  },
  {
    id: 13,
    name: "Куркума + Імбир",
    category: "jar",
    price: "118 грн",
    description: "Зігрівальний та яскравий смак куркуми з пряним імбиром",
    image: IMG_BASE + "куркума.png",
    slug: "kurkuma-imber-banka"
  },

  /* ─── Рожки ───────────────────────────────────────────────── */
  {
    id: 26,
    name: "Рожок класичний",
    category: "cone",
    price: "60 грн",
    description: "Хрустка вафельна ріжка з однією кулькою морозива на вибір",
    image: IMG_BASE + "тану_6511.png",
    slug: "rozhok-klasychnyi"
  },
  {
    id: 27,
    name: "Рожок шоколадний",
    category: "cone",
    price: "70 грн",
    description: "Вафельна ріжка, вкрита темним шоколадом та горіховою крихтою",
    image: IMG_BASE + "тану_6511-1.png",
    slug: "rozhok-shokoladnyi"
  },
  {
    id: 28,
    name: "Рожок подвійний",
    category: "cone",
    price: "80 грн",
    description: "Велика хрустка ріжка з двома кульками морозива та топінгом",
    image: IMG_BASE + "тану24_5328.png",
    slug: "rozhok-podoiinyi"
  }

];
