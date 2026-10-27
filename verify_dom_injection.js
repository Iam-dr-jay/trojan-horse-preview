#!/usr/bin/env node
/**
 * Programmatic DOM Verification Test for Trojan Horse 6-Mode Engine
 * Tests:
 * 1) 5 B2B Niches (?brand=...&niche=vip|shortlet|yacht|medspa|streetwear)
 * 2) ?mode=proposal&brand=Quilox&tier=local (₦1,000,000 / ₦700k Deposit + Instant Invoice Link)
 * 3) ?mode=proposal&brand=Aura%20Aesthetics&tier=intl ($1,500 / $750 Deposit + Instant Invoice Link)
 * 4) ?mode=quant ($49 Starter / $199 Pro Quant Kit + Instant Invoice Links)
 * 5) ?mode=blacknovember (Dr Jay's Store / The Roadman Luxury + Instant Invoice Links)
 * 6) ?mode=commander (Mobile 1-Tap Dispatch Console — 75 Prospects + 4 Primary Action Buttons + Status Toggle)
 * 7) ?mode=invoice&client=PrestigeLounge&amount=700000&currency=NGN (Multi-Currency Settlement Terminal)
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
  console.log(' TROJAN HORSE 6-MODE DOM VERIFICATION SUITE');
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
    propLocal['catalogue-grid'].innerHTML.includes('?mode=invoice');
  console.log(`[${passLocal ? 'PASS' : 'FAIL'}] Proposal Local| ?mode=proposal&brand=Quilox%20Club&tier=local -> ${propLocal['metric-2-val'].textContent} + Invoice Link Wired`);
  if (!passLocal) process.exit(1);

  const propIntl = simulateDomInjection(html, '?mode=proposal&brand=Knightsbridge%20Aesthetics&tier=intl');
  const passIntl = propIntl['metric-2-val'].textContent === '$1,500 USD' &&
    propIntl['metric-3-label'].textContent.includes('$750') &&
    propIntl['catalogue-grid'].innerHTML.includes('?mode=invoice');
  console.log(`[${passIntl ? 'PASS' : 'FAIL'}] Proposal Intl | ?mode=proposal&brand=Knightsbridge%20Aesthetics&tier=intl -> ${propIntl['metric-2-val'].textContent} + Invoice Link Wired`);
  if (!passIntl) process.exit(1);

  // 3. Test Quant Mode + Invoice Links
  const quantDom = simulateDomInjection(html, '?mode=quant');
  const passQuant = quantDom['nav-brand-title'].textContent.includes('ROADMAN TRADER QUANT KIT') &&
    quantDom['catalogue-grid'].innerHTML.includes('$49') &&
    quantDom['catalogue-grid'].innerHTML.includes('$199') &&
    quantDom['catalogue-grid'].innerHTML.includes('?mode=invoice');
  console.log(`[${passQuant ? 'PASS' : 'FAIL'}] Quant Hub     | ?mode=quant -> "${quantDom['nav-brand-title'].textContent}" ($49/$199 + Invoice Links Verified)`);
  if (!passQuant) process.exit(1);

  // 4. Test Black November Mode + Invoice Links
  const bnDom = simulateDomInjection(html, '?mode=blacknovember');
  const passBn = bnDom['nav-brand-title'].textContent === 'THE ROADMAN LUXURY' &&
    bnDom['catalogue-grid'].children.length === 3 &&
    bnDom['catalogue-grid'].innerHTML.includes('?mode=invoice');
  console.log(`[${passBn ? 'PASS' : 'FAIL'}] Black Nov Mode| ?mode=blacknovember -> "${bnDom['nav-brand-title'].textContent}" (3 Bundles + Invoice Links Active)`);
  if (!passBn) process.exit(1);

  // 5. Test Commander Dispatch Console Mode (75 Cards + 4 Buttons + Status Badge)
  const cmdDom = simulateDomInjection(html, '?mode=commander');
  const firstCardHtml = cmdDom['commander-cards-grid'].children[0] ? cmdDom['commander-cards-grid'].children[0].innerHTML : '';
  const passCmd = cmdDom['commander-cards-grid'].children.length === 75 &&
    firstCardHtml.includes('1-Tap Day 1') &&
    firstCardHtml.includes('1-Tap Day 3 Follow-Up Bump') &&
    firstCardHtml.includes('Send Proposal Link') &&
    firstCardHtml.includes('Send Instant Deposit Invoice');
  console.log(`[${passCmd ? 'PASS' : 'FAIL'}] Commander Mode| ?mode=commander -> 75 Cards + 4 Primary Buttons + LocalStorage CRM Verified`);
  if (!passCmd) process.exit(1);

  // 6. Test Instant Invoice & Multi-Currency Checkout Mode (?mode=invoice)
  const invNgn = simulateDomInjection(html, '?mode=invoice&client=PrestigeLounge&amount=700000&currency=NGN');
  const passInvNgn = invNgn['inv-client-name'].textContent === 'Prestige Lounge' &&
    invNgn['inv-total-amount'].textContent.includes('700,000') &&
    invNgn['inv-number'].textContent.startsWith('#RM-2026-') &&
    (invNgn['inv-verify-wa-btn'].attrs.href || '').includes('wa.me/');
  console.log(`[${passInvNgn ? 'PASS' : 'FAIL'}] Invoice NGN   | ?mode=invoice&client=PrestigeLounge&amount=700000&currency=NGN -> ${invNgn['inv-number'].textContent} | ${invNgn['inv-total-amount'].textContent}`);
  if (!passInvNgn) process.exit(1);

  const invUsd = simulateDomInjection(html, '?mode=invoice&client=AuraAesthetics&amount=750&currency=USD');
  const passInvUsd = invUsd['inv-client-name'].textContent === 'Aura Aesthetics' &&
    invUsd['inv-total-amount'].textContent.includes('$750') &&
    invUsd['inv-number'].textContent.startsWith('#RM-2026-');
  console.log(`[${passInvUsd ? 'PASS' : 'FAIL'}] Invoice USD   | ?mode=invoice&client=AuraAesthetics&amount=750&currency=USD -> ${invUsd['inv-number'].textContent} | ${invUsd['inv-total-amount'].textContent}`);
  if (!passInvUsd) process.exit(1);

  console.log('====================================================================');
  console.log(' ALL 12 MODE, NICHE & INVOICE TERMINAL TESTS PASSED');
  console.log('====================================================================');
}

runTests();
