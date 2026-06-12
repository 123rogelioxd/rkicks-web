import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

const whatsapp = read('src/utils/whatsapp.ts');
const inventory = read('src/utils/inventory.ts');
const cart = read('src/utils/checkout-cart.ts');
const productRuntime = read('src/app/producto/[slug]/ProductRuntimeClient.tsx');
const productMeta = read('src/components/product/ProductMeta.tsx');
const checkout = read('src/app/checkout/CheckoutClient.tsx');

assert.match(whatsapp, /WHATSAPP_NUMBER = '529516513018'/, 'WhatsApp number must be RKicks production number');
assert.match(whatsapp, /Total: \$\{formatPrice\(total\)\} MXN/, 'Multi-item WhatsApp messages must include total');
assert.match(whatsapp, /Mi nombre es \$\{cleanField\(customerName\) \|\| '____'\}\./, 'WhatsApp message must include customer name placeholder');
assert.match(whatsapp, /encodeURIComponent\(message\)/, 'WhatsApp URL must encode a clean plain-text message');

assert.match(inventory, /getVariantDetailSizeLabel/, 'Variant detail size formatter must exist');
assert.match(inventory, /variant\?\.salePrice/, 'Variant price must override product price');
assert.match(productMeta, /getVariantPrice\(product, selectedVariant\)/, 'Product page price must use selected variant');
assert.match(productRuntime, /<ConditionTable product=\{product\} selectedVariant=\{selectedVariant\}/, 'Condition table must receive selected variant');

assert.match(cart, /variantId: variant\.id/, 'Checkout cart item must store selected variant id');
assert.match(cart, /reason: 'duplicate'/, 'Checkout cart must block duplicate variants');
assert.match(cart, /variant\.status !== 'available'/, 'Checkout cart must reject unavailable variants');
assert.match(checkout, /fetchLiveCatalog\(\)/, 'Checkout must refetch live catalog on load');
assert.match(checkout, /unavailable = !liveProduct \|\| !liveVariant \|\| liveVariant\.status !== 'available'/, 'Checkout must mark unavailable variants');
assert.match(checkout, /aria-disabled=\{!canCheckout\}/, 'Checkout button must disable when blocked');

console.log('Verified RKicks variant checkout flow wiring.');
