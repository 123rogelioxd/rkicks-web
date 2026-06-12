const API_URL = process.env.RKICKS_CATALOG_API_URL ?? 'https://api.rdecants.com/api/rkicks/catalog';
const SITE_URL = process.env.RKICKS_SITE_URL;

async function readJson(url) {
  const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.json();
}

async function readText(url) {
  const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.text();
}

const products = await readJson(API_URL);

if (!Array.isArray(products)) {
  throw new Error('Catalog API response is not an array');
}

const publicAvailable = products.filter((product) => (
  product.published === true &&
  product.availability === 'available' &&
  product.slug
));

if (publicAvailable.length === 0) {
  throw new Error('Catalog API returned no published available products');
}

const hidden = products.filter((product) => product.published !== true || product.availability !== 'available');
const featured = publicAvailable.filter((product) => product.featured === true);
const sortOrderValues = publicAvailable.map((product) => product.sort_order);
const newestSlug = [...publicAvailable].sort((a, b) => {
  const bySort = Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  if (bySort !== 0) return bySort;
  return new Date(b.condition_report?.verified_at ?? 0).getTime() -
    new Date(a.condition_report?.verified_at ?? 0).getTime();
})[0]?.slug;

console.log(`Catalog API products: ${products.length}`);
console.log(`Published + available products: ${publicAvailable.length}`);
console.log(`Hidden by public filters: ${hidden.length}`);
console.log(`Featured products: ${featured.length}`);
console.log(`Sort order values: ${sortOrderValues.join(', ')}`);
console.log(`First public product by sort/newest: ${newestSlug}`);

if (SITE_URL) {
  const siteBase = SITE_URL.replace(/\/$/, '');
  const homepage = (await readText(siteBase)).toLowerCase();

  if (!homepage.includes(`${publicAvailable.length} disponibles ahora`) && !homepage.includes(`ver ${publicAvailable.length} pares`)) {
    throw new Error(`Homepage does not show ${publicAvailable.length} available products`);
  }

  console.log(`Verified ${siteBase} homepage includes live public count`);
}
