// WCAG 2.1 A/AA accessibility audit for the whole site.
//
// Loads every route in real Chromium (Playwright) and runs axe-core — the same
// engine behind Lighthouse, axe DevTools, and the scanners plaintiffs use — so
// a clean result here means a clean result for them. Scans each page at desktop
// AND mobile widths with reduced motion, and excludes vendor-controlled frames
// (reCAPTCHA). Keep this committed so conformance can be re-verified any time.
//
//   Usage:
//     node scripts/a11y-audit.mjs            # scan every route, both viewports
//     node scripts/a11y-audit.mjs /blog      # scan a single route while fixing
//
//   Requires the dev server running:  npm run dev   (default http://localhost:5173)

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

import { SERVICE_PAGES } from '../src/data/services.js';
import { BLOG_POSTS } from '../src/data/blog.js';
import { AREA_SLUGS } from '../src/data/serviceAreas.js';

const BASE = process.env.AUDIT_BASE || 'http://localhost:5173';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const VIEWPORTS = [
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

// Vendor-controlled embeds we cannot fix in our own code.
const EXCLUDE_SELECTORS = [
  'iframe[src*="recaptcha"]',
  'iframe[title*="reCAPTCHA"]',
  '.grecaptcha-badge',
  '#g-recaptcha-response',
];

function allRoutes() {
  const routes = ['/', '/about-us', '/blog', '/water-heater-repair'];
  for (const slug of Object.keys(SERVICE_PAGES)) {
    routes.push(`/${slug}`);
    for (const sub of SERVICE_PAGES[slug].services) {
      routes.push(`/${slug}/${sub.slug}`);
    }
  }
  for (const post of BLOG_POSTS) routes.push(`/blog/${post.slug}`);
  for (const slug of AREA_SLUGS) routes.push(`/service-areas/${slug}`);
  // De-dupe (sub-service slugs can repeat across parents but paths are unique).
  return [...new Set(routes)];
}

async function scanPage(browser, route, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
    // Let the route loader clear and lazy sections settle before measuring.
    await page.waitForTimeout(2800);

    let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
    for (const sel of EXCLUDE_SELECTORS) builder = builder.exclude(sel);
    const results = await builder.analyze();
    return results.violations;
  } finally {
    await context.close();
  }
}

async function main() {
  const single = process.argv[2];
  const routes = single ? [single] : allRoutes();

  const browser = await chromium.launch();
  const report = [];
  const ruleCounts = new Map(); // ruleId -> { count, impact, pages:Set }
  let totalViolations = 0;
  let failingPages = 0;

  console.log(
    `\nAuditing ${routes.length} route(s) × ${VIEWPORTS.length} viewport(s) against WCAG 2.1 A/AA…\n`
  );

  for (const route of routes) {
    let pageHadViolations = false;
    for (const vp of VIEWPORTS) {
      const violations = await scanPage(browser, route, vp);
      for (const v of violations) {
        totalViolations += v.nodes.length;
        const entry = ruleCounts.get(v.id) || {
          count: 0,
          impact: v.impact,
          help: v.help,
          pages: new Set(),
        };
        entry.count += v.nodes.length;
        entry.pages.add(`${route} (${vp.name})`);
        ruleCounts.set(v.id, entry);
        report.push({
          route,
          viewport: vp.name,
          rule: v.id,
          impact: v.impact,
          help: v.help,
          helpUrl: v.helpUrl,
          nodes: v.nodes.map((n) => ({ target: n.target, html: n.html })),
        });
      }
      const n = violations.reduce((s, v) => s + v.nodes.length, 0);
      if (n) pageHadViolations = true;
      const flag = n ? `✗ ${n}` : '✓';
      console.log(`  ${flag.padEnd(6)} ${vp.name.padEnd(7)} ${route}`);
    }
    if (pageHadViolations) failingPages++;
  }

  await browser.close();

  mkdirSync('scripts/a11y-reports', { recursive: true });
  writeFileSync(
    'scripts/a11y-reports/latest.json',
    JSON.stringify(report, null, 2)
  );

  console.log('\n──────── Summary by rule ────────');
  const sorted = [...ruleCounts.entries()].sort((a, b) => b[1].count - a[1].count);
  if (!sorted.length) {
    console.log('  🎉 Zero violations across all scanned pages.');
  } else {
    for (const [rule, info] of sorted) {
      console.log(
        `  ${String(info.count).padStart(4)}×  [${info.impact}]  ${rule}\n         ${info.help}\n         on ${info.pages.size} page/viewport combos`
      );
    }
  }
  console.log(
    `\nTotal violations: ${totalViolations} across ${failingPages} failing page(s).`
  );
  console.log('Full report: scripts/a11y-reports/latest.json\n');

  process.exit(totalViolations ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
