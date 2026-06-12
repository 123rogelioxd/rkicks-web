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
const nav = read('src/components/layout/Nav.tsx');

assert.match(whatsapp, /WHATSAPP_NUMBER = '529516513018'/, 'WhatsApp number must be RKicks production number');
assert.match(whatsapp, /Total: \$\{formatPrice\(total\)\} MXN/, 'Multi-item WhatsApp messages must include total');
assert.match(whatsapp, /Mi nombre es \$\{cleanField\(customerName\) \|\| '____'\}\./, 'WhatsApp message must include customer name placeholder');
assert.match(whatsapp, /encodeURIComponent\(message\)/, 'WhatsApp URL must encode a clean plain-text message');
assert.match(whatsapp, /• \$\{item\.name\} — \$\{item\.sizeLabel\} — \$\{formatPrice\(item\.price\)\}/, 'WhatsApp item lines must use clean dash typography');

assert.match(inventory, /getVariantDetailSizeLabel/, 'Variant detail size formatter must exist');
assert.match(inventory, /variant\?\.salePrice/, 'Variant price must override product price');
assert.match(productMeta, /getVariantPrice\(product, selectedVariant\)/, 'Product page price must use selected variant');
assert.match(productRuntime, /<ConditionTable product=\{product\} selectedVariant=\{selectedVariant\}/, 'Condition table must receive selected variant');

assert.match(nav, /rkicks-cart-updated/, 'Header cart count must react to cart updates');
assert.match(nav, /getCartItemCount\(readCart\(\)\)/, 'Header cart count must read current cart state');
assert.match(cart, /variantId: variant\.id/, 'Checkout cart item must store selected variant id');
assert.match(cart, /if \(cleanVariantId\) return `variant:\$\{cleanVariantId\}`/, 'Cart identity must prefer selected variant id');
assert.match(cart, /product-size:\$\{productSlug\}:\$\{normalizeIdentityPart\(sizeLabel\)\}/, 'Cart identity must fallback to product slug plus size label');
assert.match(cart, /reason: 'duplicate'/, 'Checkout cart must block duplicate variants');
assert.match(cart, /getCartItemIdentity\(item\) === cartKey/, 'Duplicate checks must use exact cart identity');
assert.match(cart, /variant\.status !== 'available'/, 'Checkout cart must reject unavailable variants');
assert.match(cart, /isSelectedVariantInCart/, 'Product CTA must be able to derive selected variant cart state');
assert.match(productRuntime, /selectedVariant=\{selectedVariant\}/, 'Product page must pass selected variant to CTA/table');
assert.match(read('src/components/whatsapp/WhatsAppCTA.tsx'), /checkoutLabel = selectedInCart \? 'Ya está en carrito' : 'Agregar al carrito'/, 'Add button state must reflect selected variant');
assert.match(read('src/components/whatsapp/WhatsAppCTA.tsx'), /setMessage\(null\)/, 'Changing selected size must clear stale CTA message');
assert.match(checkout, /fetchLiveCatalog\(\)/, 'Checkout must refetch live catalog on load');
assert.match(checkout, /unavailable = !liveProduct \|\| !liveVariant \|\| liveVariant\.status !== 'available'/, 'Checkout must mark unavailable variants');
assert.match(checkout, /hasCustomerName = customerName\.trim\(\)\.length > 0/, 'Checkout must require customer name');
assert.match(checkout, /if \(!canFinalize\)/, 'Checkout must block WhatsApp when validation fails');
assert.match(checkout, /setNameError\(true\)/, 'Checkout must show inline validation for missing name');
assert.match(checkout, /customerName,/, 'Checkout message must include entered customer name');
assert.match(checkout, /aria-disabled=\{!canFinalize\}/, 'Checkout button must disable when blocked');

console.log('Verified RKicks variant checkout flow wiring.');
