#!/usr/bin/env node
/**
 * Programmatic DOM Verification Test for Trojan Horse Dynamic Query Parameter Injection
 * Tests ?brand={BRAND}&niche={NICHE} against http://localhost:8080/
 */
const http = require('http');

function fetchPage(query) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:8080/${query}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

function simulateDomInjection(html, queryString) {
  // Create a lightweight DOM simulator to run the inline script from index.html
  const elements = {};
  const ids = [
    'page-title', 'telemetry-params', 'nav-monogram', 'nav-brand-title',
    'nav-brand-subtitle', 'nav-cta-text', 'hero-badge', 'hero-headline',
    'hero-subheadline', 'chat-avatar', 'chat-widget-title', 'chat-messages',
    'quick-prompts', 'catalogue-heading', 'catalogue-grid',
    'footer-brand-highlight', 'footer-brand-bold', 'copyright-brand', 'concierge', 'chat-input'
  ];
  ids.forEach(id => {
    elements[id] = {
      id,
      textContent: '',
      innerHTML: '',
      children: [],
      scrollHeight: 100,
      scrollTop: 0,
      appendChild(child) {
        this.children.push(child);
        this.innerHTML += child.innerHTML || child.textContent || '';
      },
      scrollIntoView() {},
      focus() {}
    };
  });

  const sandboxWindow = { location: { search: queryString } };
  const sandboxDocument = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = { id, textContent: '', innerHTML: '', children: [], appendChild(c) { this.children.push(c); } };
      }
      return elements[id];
    },
    createElement(tag) {
      return { tag, className: '', innerHTML: '', textContent: '', children: [], appendChild(c) { this.children.push(c); } };
    }
  };

  // Extract inline script block (the last <script> block in index.html)
  const scriptBlocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  const mainScript = scriptBlocks[scriptBlocks.length - 1][1];

  const fn = new Function('window', 'document', 'URLSearchParams', mainScript);
  fn(sandboxWindow, sandboxDocument, URLSearchParams);
  return elements;
}

async function runTests() {
  const testCases = [
    { query: '?brand=0808%20Lounge&niche=vip', expectedBrand: '0808 Lounge', expectedNicheSub: 'PRIVATE TABLE CONCIERGE & BOTTLE SERVICE' },
    { query: '?brand=Peculiar%20Shortlet%20Apartments&niche=shortlet', expectedBrand: 'Peculiar Shortlet Apartments', expectedNicheSub: 'EXECUTIVE RESIDENCES & PRIVATE PENTHOUSES' },
    { query: '?brand=Eko%20Superyachts&niche=yacht', expectedBrand: 'Eko Superyachts', expectedNicheSub: 'PRIVATE CHARTERS & ARMORED EXOTIC FLEET' },
    { query: '?brand=Aura%20Aesthetics&niche=medspa', expectedBrand: 'Aura Aesthetics', expectedNicheSub: 'BESPOKE AESTHETICS & LONGEVITY CLINIC' },
    { query: '?brand=Krown%20Atelier&niche=streetwear', expectedBrand: 'Krown Atelier', expectedNicheSub: 'ARCHIVE ATELIER & PRIVATE ALLOCATIONS' }
  ];

  console.log('====================================================================');
  console.log(' TROJAN HORSE DYNAMIC DOM INJECTION VERIFICATION SUITE');
  console.log('====================================================================');

  for (const tc of testCases) {
    const { status, html } = await fetchPage(tc.query);
    const dom = simulateDomInjection(html, tc.query);

    const navBrand = dom['nav-brand-title'].textContent;
    const navSub = dom['nav-brand-subtitle'].textContent;
    const heroHeadline = dom['hero-headline'].innerHTML;
    const chatTitle = dom['chat-widget-title'].textContent;
    const firstChatMsg = dom['chat-messages'].innerHTML;

    const pass =
      status === 200 &&
      navBrand === tc.expectedBrand.toUpperCase() &&
      navSub === tc.expectedNicheSub &&
      heroHeadline.includes(tc.expectedBrand) &&
      chatTitle === `${tc.expectedBrand} AI Concierge` &&
      firstChatMsg.includes(tc.expectedBrand);

    console.log(`[${pass ? 'PASS' : 'FAIL'}] HTTP ${status} | Query: ${tc.query}`);
    console.log(`  ├─ #nav-brand-title   -> "${navBrand}"`);
    console.log(`  ├─ #nav-brand-subtitle-> "${navSub}"`);
    console.log(`  ├─ #hero-headline     -> "${heroHeadline.replace(/<[^>]+>/g, '')}"`);
    console.log(`  └─ #chat-widget-title -> "${chatTitle}" (${dom['catalogue-grid'].children.length} dynamic tier cards rendered)`);
    if (!pass) process.exit(1);
  }
  console.log('====================================================================');
  console.log(' ALL 5 NICHE DOM INJECTION TESTS PASSED (0ms Client Render)');
  console.log('====================================================================');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
