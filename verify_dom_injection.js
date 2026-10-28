#!/usr/bin/env node
/**
 * Programmatic DOM Verification Test for Trojan Horse 7-Mode Engine
 * Tests:
 * 1) 5 B2B Niches (?brand=...&niche=vip|shortlet|yacht|medspa|streetwear)
 * 2) ?mode=proposal&brand=Quilox&tier=local (₦1,000,000 / ₦700k Deposit + Instant Invoice Link)
 * 3) ?mode=proposal&brand=Aura%20Aesthetics&tier=intl ($1,500 / $750 Deposit + Instant Invoice Link)
 * 4) ?mode=quant ($49 Starter / $199 Pro Quant Kit + Instant Invoice Links)
 * 5) ?mode=blacknovember (Dr Jay's Store / The Roadman Luxury + Instant Invoice Links)
 * 6) ?mode=commander (Mobile 1-Tap Dispatch Console — 75 Prospects + 2349059383562 Routing)
 * 7) ?mode=invoice (Moniepoint MFB • 9059383562 • Dr Jay's Store • 2349059383562 • Johnefe50@gmail.com)
 * 8) ?mode=slides (9:16 Luxury Story/Status/Reel Slide Generator — 3 Switchable Decks)
 */
const fs = require('fs');

function createMockElement(id) {
  return {
    id,
    textContent: '',
    innerHTML: '',
    value: '',
    src: '',
    href: '',
    children: [],
    attrs: {},
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); }
    },
    setAttribute(k, v) { this.attrs[k] = v; },
    appendChild(child) {
      this.children.push(child);
      this.innerHTML += child.innerHTML || child.textContent || '';
    },
    scrollIntoView() {},
    focus() {}
  };
}

function simulateDomInjection(html, queryString) {
  const elements = {};
  const storage = {};
  const sandboxWindow = { location: { search: queryString } };
  const sandboxLocalStorage = {
    getItem(k) { return storage[k] || null; },
    setItem(k, v) { storage[k] = String(v); }
  };
  const sandboxDocument = {
    getElementById(id) {
      if (!elements[id]) elements[id] = createMockElement(id);
      return elements[id];
    },
    createElement(tag) {
      return createMockElement(tag);
    }
  };

  const scriptBlocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  const mainScript = scriptBlocks[scriptBlocks.length - 1][1];

  const fn = new Function('window', 'document', 'URLSearchParams', 'localStorage', mainScript);
  fn(sandboxWindow, sandboxDocument, URLSearchParams, sandboxLocalStorage);
  return elements;
}

function runTests() {
  const html = fs.readFileSync('/home/theroadman/operation-10m/trojan-horse/index.html', 'utf8');

  console.log('====================================================================');
  console.log(' TROJAN HORSE 7-MODE DOM & SETTLEMENT VERIFICATION SUITE');
  console.log('====================================================================');

  // 1. Test 5 B2B Niches
  const b2bCases = [
    { query: '?brand=0808%20Lounge&niche=vip', expectedBrand: '0808 Lounge' },
    { query: '?brand=Peculiar%20Shortlet%20Apartments&niche=shortlet', expectedBrand: 'Peculiar Shortlet Apartments' },
    { query: '?brand=Eko%20Superyachts&niche=yacht', expectedBrand: 'Eko Superyachts' },
    { query: '?brand=Aura%20Aesthetics&niche=medspa', expectedBrand: 'Aura Aesthetics' },
    { query: '?brand=Krown%20Atelier&niche=streetwear', expectedBrand: 'Krown Atelier' }
  ];

  for (const tc of b2bCases) {
    const dom = simulateDomInjection(html, tc.query);
    const pass = dom['nav-brand-title'].textContent === tc.expectedBrand.toUpperCase() && dom['hero-headline'].innerHTML.includes(tc.expectedBrand);
    console.log(`[${pass ? 'PASS' : 'FAIL'}] B2B Preview   | ${tc.query} -> "${dom['nav-brand-title'].textContent}"`);
    if (!pass) process.exit(1);
  }

  // 2. Test Closer Proposal Mode (Local & Intl) + Invoice Link Routing
  const propLocal = simulateDomInjection(html, '?mode=proposal&brand=Quilox%20Club&tier=local');
  const passLocal = propLocal['metric-2-val'].textContent === '₦1,000,000 NGN' &&
    propLocal['metric-3-label'].textContent.includes('₦700,000') &&
    propLocal['catalogue-grid'].innerHTML.includes('?mode=invoice') &&
    propLocal['catalogue-grid'].innerHTML.includes('2349059383562');
  console.log(`[${passLocal ? 'PASS' : 'FAIL'}] Proposal Local| ?mode=proposal&brand=Quilox%20Club&tier=local -> ${propLocal['metric-2-val'].textContent} + WA 2349059383562`);
  if (!passLocal) process.exit(1);

  const propIntl = simulateDomInjection(html, '?mode=proposal&brand=Knightsbridge%20Aesthetics&tier=intl');
  const passIntl = propIntl['metric-2-val'].textContent === '$1,500 USD' &&
    propIntl['metric-3-label'].textContent.includes('$750') &&
    propIntl['catalogue-grid'].innerHTML.includes('?mode=invoice');
  console.log(`[${passIntl ? 'PASS' : 'FAIL'}] Proposal Intl | ?mode=proposal&brand=Knightsbridge%20Aesthetics&tier=intl -> ${propIntl['metric-2-val'].textContent}`);
  if (!passIntl) process.exit(1);

  // 3. Test Quant Mode + Invoice Links
  const quantDom = simulateDomInjection(html, '?mode=quant');
  const passQuant = quantDom['nav-brand-title'].textContent.includes('ROADMAN TRADER QUANT KIT') &&
    quantDom['catalogue-grid'].innerHTML.includes('$49') &&
    quantDom['catalogue-grid'].innerHTML.includes('$199') &&
    quantDom['catalogue-grid'].innerHTML.includes('2349059383562');
  console.log(`[${passQuant ? 'PASS' : 'FAIL'}] Quant Hub     | ?mode=quant -> "${quantDom['nav-brand-title'].textContent}" ($49/$199 + WA 2349059383562)`);
  if (!passQuant) process.exit(1);

  // 4. Test Black November Mode + Invoice Links
  const bnDom = simulateDomInjection(html, '?mode=blacknovember');
  const passBn = bnDom['nav-brand-title'].textContent === 'THE ROADMAN LUXURY' &&
    bnDom['catalogue-grid'].children.length === 3 &&
    bnDom['catalogue-grid'].innerHTML.includes('2349059383562');
  console.log(`[${passBn ? 'PASS' : 'FAIL'}] Black Nov Mode| ?mode=blacknovember -> "${bnDom['nav-brand-title'].textContent}" (3 Bundles + WA 2349059383562)`);
  if (!passBn) process.exit(1);

  // 5. Test Commander Dispatch Console Mode (75 Cards + 4 Buttons + 2349059383562)
  const cmdDom = simulateDomInjection(html, '?mode=commander');
  const firstCardHtml = cmdDom['commander-cards-grid'].children[0] ? cmdDom['commander-cards-grid'].children[0].innerHTML : '';
  const passCmd = cmdDom['commander-cards-grid'].children.length === 75 &&
    firstCardHtml.includes('1-Tap Day 1') &&
    firstCardHtml.includes('1-Tap Day 3 Follow-Up Bump') &&
    firstCardHtml.includes('2349059383562');
  console.log(`[${passCmd ? 'PASS' : 'FAIL'}] Commander Mode| ?mode=commander -> 75 Cards + 4 Primary Buttons + 2349059383562 Verified`);
  if (!passCmd) process.exit(1);

  // 6. Test Instant Invoice & Multi-Currency Checkout Mode (?mode=invoice)
  const invNgn = simulateDomInjection(html, '?mode=invoice&client=PrestigeLounge&amount=700000&currency=NGN');
  const passInvNgn = invNgn['inv-client-name'].textContent === 'Prestige Lounge' &&
    invNgn['inv-total-amount'].textContent.includes('700,000') &&
    invNgn['ngn-bank-name'].textContent === 'Moniepoint MFB' &&
    invNgn['ngn-account-number'].textContent === '9059383562' &&
    invNgn['ngn-account-name'].textContent === "Dr Jay's Store" &&
    invNgn['usd-account-name'].textContent.includes('Johnefe50@gmail.com') &&
    (invNgn['inv-verify-wa-btn'].attrs.href || '').includes('wa.me/2349059383562');
  console.log(`[${passInvNgn ? 'PASS' : 'FAIL'}] Invoice NGN   | ?mode=invoice -> ${invNgn['ngn-bank-name'].textContent} • ${invNgn['ngn-account-number'].textContent} (${invNgn['ngn-account-name'].textContent})`);
  if (!passInvNgn) process.exit(1);

  // 7. Test 9:16 Luxury Slide Generator Mode (?mode=slides) across all 3 decks
  const slidesBn = simulateDomInjection(html, '?mode=slides&deck=blacknovember');
  const passSlidesBn = slidesBn['slides-cards-grid'].children.length === 4 &&
    slidesBn['slides-cards-grid'].innerHTML.includes('Moniepoint 9059383562') &&
    slidesBn['slides-cards-grid'].innerHTML.includes('+234 905 938 3562');
  console.log(`[${passSlidesBn ? 'PASS' : 'FAIL'}] Slides Deck 1 | ?mode=slides&deck=blacknovember -> 4 Vertical 9:16 Cards Rendered`);
  if (!passSlidesBn) process.exit(1);

  const slidesDetty = simulateDomInjection(html, '?mode=slides&deck=dettydecember');
  const passSlidesDetty = slidesDetty['slides-cards-grid'].children.length === 3 &&
    slidesDetty['slides-cards-grid'].innerHTML.includes('Losing big spenders to slow DM replies?');
  console.log(`[${passSlidesDetty ? 'PASS' : 'FAIL'}] Slides Deck 2 | ?mode=slides&deck=dettydecember -> 3 Vertical 9:16 Cards Rendered`);
  if (!passSlidesDetty) process.exit(1);

  const slidesQuant = simulateDomInjection(html, '?mode=slides&deck=quant');
  const passSlidesQuant = slidesQuant['slides-cards-grid'].children.length === 3 &&
    slidesQuant['slides-cards-grid'].innerHTML.includes('$49 Starter / $199 Pro License');
  console.log(`[${passSlidesQuant ? 'PASS' : 'FAIL'}] Slides Deck 3 | ?mode=slides&deck=quant -> 3 Vertical 9:16 Cards Rendered`);
  if (!passSlidesQuant) process.exit(1);

  console.log('====================================================================');
  console.log(' ALL 14 MODE, NICHE, SLIDE DECK & SETTLEMENT TESTS PASSED');
  console.log('====================================================================');
}

runTests();
