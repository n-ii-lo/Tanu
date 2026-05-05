'use strict';

const fs = require('fs');
const path = require('path');

const catalog = require('../../../data/catalog.js');

const CATEGORY_UID = 'api::category.category';
const PRODUCT_UID = 'api::product.product';
const UPLOAD_FILE_UID = 'plugin::upload.file';
const SEED_MEDIA_DIR = path.resolve(__dirname, '../../seed-media');

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();

  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';

  return 'application/octet-stream';
}

async function findCategory(strapi, key) {
  return strapi.documents(CATEGORY_UID).findFirst({
    filters: { key: key },
    status: 'draft'
  });
}

async function findProduct(strapi, slug) {
  return strapi.documents(PRODUCT_UID).findFirst({
    filters: { slug: slug },
    status: 'draft'
  });
}

async function ensureCategory(strapi, category) {
  var existing = await findCategory(strapi, category.key);

  if (existing) {
    return { entry: existing, created: false };
  }

  var created = await strapi.documents(CATEGORY_UID).create({
    data: {
      name: category.label,
      key: category.key
    }
  });

  await strapi.documents(CATEGORY_UID).publish({
    documentId: created.documentId
  });

  return { entry: created, created: true };
}

async function ensureUploadFile(strapi, product) {
  var existing = await strapi.db.query(UPLOAD_FILE_UID).findOne({
    where: {
      name: product.imageFile
    }
  });

  if (existing) {
    return existing;
  }

  var imagePath = path.join(SEED_MEDIA_DIR, product.imageFile);

  if (!fs.existsSync(imagePath)) {
    throw new Error('Seed image not found: ' + imagePath);
  }

  var stats = fs.statSync(imagePath);
  var uploaded = await strapi.plugin('upload').service('upload').upload({
    data: {
      fileInfo: {
        name: product.imageFile,
        alternativeText: product.name,
        caption: product.description
      }
    },
    files: {
      filepath: imagePath,
      originalFilename: product.imageFile,
      mimetype: getMimeType(product.imageFile),
      size: stats.size
    }
  });

  return uploaded[0];
}

async function ensureProduct(strapi, product, categoriesByKey) {
  var existing = await findProduct(strapi, product.slug);

  if (existing) {
    return { entry: existing, created: false };
  }

  var category = categoriesByKey.get(product.category);

  if (!category) {
    throw new Error('Missing category for product: ' + product.slug);
  }

  var image = await ensureUploadFile(strapi, product);

  var created = await strapi.documents(PRODUCT_UID).create({
    data: {
      name: product.name,
      slug: product.slug,
      price: product.price,
      description: product.description,
      category: category.documentId,
      image: image.id
    }
  });

  await strapi.documents(PRODUCT_UID).publish({
    documentId: created.documentId
  });

  return { entry: created, created: true };
}

async function seedCatalog(strapi) {
  var categoriesByKey = new Map();
  var createdCategories = 0;
  var createdProducts = 0;

  for (var i = 0; i < catalog.categories.length; i += 1) {
    var categoryResult = await ensureCategory(strapi, catalog.categories[i]);
    categoriesByKey.set(catalog.categories[i].key, categoryResult.entry);

    if (categoryResult.created) {
      createdCategories += 1;
    }
  }

  for (var j = 0; j < catalog.products.length; j += 1) {
    try {
      var productResult = await ensureProduct(strapi, catalog.products[j], categoriesByKey);

      if (productResult.created) {
        createdProducts += 1;
      }
    } catch (error) {
      strapi.log.error('[catalog-seed] Failed for product "' + catalog.products[j].slug + '"', error);
    }
  }

  strapi.log.info(
    '[catalog-seed] Categories created: ' +
      createdCategories +
      ', products created: ' +
      createdProducts
  );
}

module.exports = {
  seedCatalog: seedCatalog
};
