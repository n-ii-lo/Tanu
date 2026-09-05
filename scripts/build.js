/* ============================================================
   TANU — збірка статичного сайту в dist/

   Збірки як такої немає: сайт статичний. Цей скрипт лише
   копіює у dist/ рівно ті файли, що мають лежати на сервері,
   і піднімає SEO-файли з seo/ у корінь.

   Запуск: npm run build
   Перевірка: npm run preview → http://localhost:3000
   ============================================================ */

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

// Папки й файли, які копіюються як є
const COPY_ENTRIES = [
  "index.html",
  "index.css",
  "index.js",
  "favicon.ico",
  "data",
  "assets",
  "favicon",
  "admin",
  "Tanu.hyperesources",
];

// Файли з seo/ лягають у корінь сайту — інакше зламається
// верифікація Google і robots.txt
const SEO_DIR = path.join(rootDir, "seo");

function rmDist() {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
}

function copyEntry(name) {
  const source = path.join(rootDir, name);

  if (!fs.existsSync(source)) {
    console.warn(`  ⚠ пропущено (немає): ${name}`);
    return 0;
  }

  const target = path.join(distDir, name);
  fs.cpSync(source, target, { recursive: true });

  return countFiles(target);
}

function copySeoToRoot() {
  if (!fs.existsSync(SEO_DIR)) {
    console.warn("  ⚠ пропущено (немає): seo/");
    return 0;
  }

  let copied = 0;

  for (const entry of fs.readdirSync(SEO_DIR)) {
    fs.cpSync(path.join(SEO_DIR, entry), path.join(distDir, entry), {
      recursive: true,
    });
    copied += 1;
  }

  return copied;
}

function countFiles(target) {
  const stat = fs.statSync(target);

  if (stat.isFile()) {
    return 1;
  }

  return fs
    .readdirSync(target)
    .reduce((sum, entry) => sum + countFiles(path.join(target, entry)), 0);
}

function checkProductImages() {
  const productsFile = path.join(rootDir, "data", "products.json");

  if (!fs.existsSync(productsFile)) {
    return ["немає data/products.json"];
  }

  const payload = JSON.parse(fs.readFileSync(productsFile, "utf8"));
  const products = Array.isArray(payload.products) ? payload.products : [];
  const problems = [];

  for (const product of products) {
    if (!product.image) {
      problems.push(`без фото: ${product.name}`);
      continue;
    }

    const relative = product.image.replace(/^\//, "");
    const onDisk = path.join(distDir, relative);

    if (!fs.existsSync(onDisk)) {
      problems.push(`фото не знайдено: ${product.image} (${product.name})`);
    }
  }

  console.log(`  товарів у каталозі: ${products.length}`);

  return problems;
}

console.log("Збірка TANU → dist/");

rmDist();
fs.mkdirSync(distDir, { recursive: true });

let total = 0;

for (const entry of COPY_ENTRIES) {
  const copied = copyEntry(entry);
  total += copied;
  if (copied) {
    console.log(`  ✓ ${entry} (${copied})`);
  }
}

const seoCopied = copySeoToRoot();
total += seoCopied;
console.log(`  ✓ seo/* → корінь (${seoCopied})`);

const problems = checkProductImages();

if (problems.length > 0) {
  console.log("\nПопередження:");
  for (const problem of problems) {
    console.log(`  ⚠ ${problem}`);
  }
}

console.log(`\nГотово: ${total} файлів у dist/`);
console.log("Перевірити локально: npm run preview → http://localhost:3000");
