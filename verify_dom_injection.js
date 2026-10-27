#!/usr/bin/env node
/**
 * Programmatic DOM Verification Test for Trojan Horse Multi-Mode Engine
 * Tests:
 * 1) 5 B2B Niches (?brand=...&niche=vip|shortlet|yacht|medspa|streetwear)
 * 2) ?mode=proposal&brand=Quilox&tier=local (₦1,000,000 / ₦700k Deposit)
 * 3) ?mode=proposal&brand=Aura%20Aesthetics&tier=intl ($1,500 / $750 Deposit)
 * 4) ?mode=quant ($49 Starter / $199 Pro Quant Kit)
 * 5) ?mode=blacknovember (Dr Jay's Store / The Roadman Luxury)
 * 6) ?mode=commander (Mobile 1-Tap Dispatch Console — 75 Prospects)
 */
const fs = require('fs');

function createMockElement(id) {
  return {
    id,
    textContent: '',
    innerHTML: '',
    value: '',
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
  const sandboxWindow = { location: { search: queryString } };
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

  const fn = new Function('window', 'document', 'URLSearchParams', mainScript);
  fn(sandboxWindow, sandboxDocument, URLSearchParams);
  return elements;
}

function runTests() {
  const html = fs.readFileSync('/home/theroadman/operation-10m/trojan-horse/index.html', 'utf8');

  console.log('====================================================================');
  console.log(' TROJAN HORSE MULTI-MODE DOM VERIFICATION SUITE');
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

  // 2. Test Closer Proposal Mode (Local & Intl)
  const propLocal = simulateDomInjection(html, '?mode=proposal&brand=Quilox%20Club&tier=local');
  const passLocal = propLocal['metric-2-val'].textContent === '₦1,000,000 NGN' && propLocal['metric-3-label'].textContent.includes('₦700,000');
  console.log(`[${passLocal ? 'PASS' : 'FAIL'}] Proposal Local| ?mode=proposal&brand=Quilox%20Club&tier=local -> ${propLocal['metric-2-val'].textContent} (${propLocal['metric-3-label'].textContent})`);
  if (!passLocal) process.exit(1);

  const propIntl = simulateDomInjection(html, '?mode=proposal&brand=Knightsbridge%20Aesthetics&tier=intl');
  const passIntl = propIntl['metric-2-val'].textContent === '$1,500 USD' && propIntl['metric-3-label'].textContent.includes('$750');
  console.log(`[${passIntl ? 'PASS' : 'FAIL'}] Proposal Intl | ?mode=proposal&brand=Knightsbridge%20Aesthetics&tier=intl -> ${propIntl['metric-2-val'].textContent} (${propIntl['metric-3-label'].textContent})`);
  if (!passIntl) process.exit(1);

  // 3. Test Quant Mode
  const quantDom = simulateDomInjection(html, '?mode=quant');
  const passQuant = quantDom['nav-brand-title'].textContent.includes('ROADMAN TRADER QUANT KIT') && quantDom['catalogue-grid'].innerHTML.includes('$49') && quantDom['catalogue-grid'].innerHTML.includes('$199');
  console.log(`[${passQuant ? 'PASS' : 'FAIL'}] Quant Hub     | ?mode=quant -> "${quantDom['nav-brand-title'].textContent}" ($49 Starter / $199 Pro verified)`);
  if (!passQuant) process.exit(1);

  // 4. Test Black November Mode
  const bnDom = simulateDomInjection(html, '?mode=blacknovember');
  const passBn = bnDom['nav-brand-title'].textContent === 'THE ROADMAN LUXURY' && bnDom['catalogue-grid'].children.length === 3;
  console.log(`[${passBn ? 'PASS' : 'FAIL'}] Black Nov Mode| ?mode=blacknovember -> "${bnDom['nav-brand-title'].textContent}" (3 Bundles Active)`);
  if (!passBn) process.exit(1);

  // 5. Test Commander Dispatch Console Mode
  const cmdDom = simulateDomInjection(html, '?mode=commander');
  const passCmd = cmdDom['commander-cards-grid'].children.length === 75;
  console.log(`[${passCmd ? 'PASS' : 'FAIL'}] Commander Mode| ?mode=commander -> Rendered ${cmdDom['commander-cards-grid'].children.length} 1-Tap Prospect Cards`);
  if (!passCmd) process.exit(1);

  console.log('====================================================================');
  console.log(' ALL 10 MODE & NICHE DOM VERIFICATION TESTS PASSED');
  console.log('====================================================================');
}

runTests();
