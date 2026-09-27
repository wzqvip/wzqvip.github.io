#!/usr/bin/env node
/**
 * 为「没有可用配图」的文章生成一张抽象封面
 * =============================================================================
 * 用法：node tools/gen-covers.mjs [--dry-run] [--force]
 *
 * 为什么需要：
 *   首页是两栏网格，同一行的两张卡片必然等高。只要有图 / 无图混在一行，
 *   高度差就会变成一片空白。给每篇文章都配上封面，网格才会齐整。
 *
 * 为什么输出 SVG 而不是 PNG：
 *   封面只是「对角渐变 + 两团柔光」，没有任何细节。
 *   用 PNG 存同样的画面要 ~64 KB，而 SVG 只要 ~0.6 KB，而且怎么放大都不糊。
 *   14 张合计不到 10 KB，比之前省了 99%。
 *
 * 为什么不做成「标题卡片」：
 *   卡片下方本来就会显示标题，封面里再写一遍标题就重复了。所以只做抽象图形，
 *   色相由标题哈希决定，每篇颜色都不一样。
 *
 * 输出：source/img/covers/<slug>.svg，并写进 front-matter 的 index_img。
 * 以后文章里补了真实截图，跑 tools/pick-covers.mjs 会自动换成真图
 * （该脚本把 /img/covers/ 视为占位封面，优先级最低）。
 * =============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const FORCE = argv.includes('--force');

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'source', '_posts');
const OUT_DIR = path.join(ROOT, 'source', 'img', 'covers');
// 与卡片封面框一致（CSS 里是 16:10），这样不会变形
const W = 800;
const H = 500;

// ---------------------------------------------------------------------------
// 颜色
// ---------------------------------------------------------------------------
function hsl2rgb(h, s, l) {
  h = (((h % 360) + 360) % 360) / 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) =>
    Math.max(0, Math.min(255, Math.round(v * 255))));
}

const hex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');

/** 标题 -> 稳定色相 */
function hueOf(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 360;
}

// ---------------------------------------------------------------------------
// 画封面（纯 SVG，几百字节）
// ---------------------------------------------------------------------------
function buildSvg(hue) {
  // 饱和度特意压低：真实配图大多是偏暗的截图，
  // 占位封面如果太鲜艳，一眼就能看出「这不是图」，反而更突兀。
  const cA = hex(hsl2rgb(hue, 0.26, 0.14));        // 深端
  const cB = hex(hsl2rgb(hue + 38, 0.30, 0.24));   // 浅端
  const g1 = hex(hsl2rgb(hue + 16, 0.42, 0.50));   // 主柔光
  const g2 = hex(hsl2rgb(hue - 24, 0.34, 0.36));   // 副柔光

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="封面">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="0.62">
<stop offset="0" stop-color="${cA}"/><stop offset="1" stop-color="${cB}"/>
</linearGradient>
<radialGradient id="glowA" cx="0.74" cy="0.24" r="0.52">
<stop offset="0" stop-color="${g1}" stop-opacity="0.38"/>
<stop offset="1" stop-color="${g1}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="glowB" cx="0.18" cy="0.84" r="0.46">
<stop offset="0" stop-color="${g2}" stop-opacity="0.22"/>
<stop offset="1" stop-color="${g2}" stop-opacity="0"/>
</radialGradient>
<linearGradient id="fade" x1="0" y1="0.6" x2="0" y2="1">
<stop offset="0" stop-color="#000" stop-opacity="0"/>
<stop offset="1" stop-color="#000" stop-opacity="0.26"/>
</linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glowA)"/>
<rect width="${W}" height="${H}" fill="url(#glowB)"/>
<rect width="${W}" height="${H}" fill="url(#fade)"/>
</svg>
`;
}

// ---------------------------------------------------------------------------
// front-matter 处理
// ---------------------------------------------------------------------------
function splitPost(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  return { fm: m[1], body: text.slice(m[0].length) };
}

function setIndexImg(fm, value) {
  const kept = fm.split(/\r?\n/).filter((l) => !/^index_img\s*:/.test(l));
  kept.push(`index_img: ${JSON.stringify(value)}`);
  return kept.join('\n');
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------
if (!DRY) fs.mkdirSync(OUT_DIR, { recursive: true });

// 清掉早期版本生成的 PNG 占位封面，避免留下无用文件
if (!DRY && fs.existsSync(OUT_DIR)) {
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.endsWith('.png')) fs.unlinkSync(path.join(OUT_DIR, f));
  }
}

const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')).sort();
const done = [];
const skipped = [];

for (const file of files) {
  const full = path.join(POSTS_DIR, file);
  const text = fs.readFileSync(full, 'utf8');
  const parts = splitPost(text);
  if (!parts) { skipped.push([file, '无 front-matter']); continue; }

  const slug = path.basename(file, '.md');
  const cur = (parts.fm.match(/^index_img\s*:\s*"?([^"\n]*)"?/m) || [, ''])[1].trim();
  const isGenerated = cur.startsWith('/img/covers/');

  if (cur && !isGenerated && !FORCE) { skipped.push([file, '已有真实封面']); continue; }

  const title = (parts.fm.match(/^title\s*:\s*"?([^"\n]*?)"?\s*$/m) || [, slug])[1];
  const hue = hueOf(title);
  const url = `/img/covers/${slug}.svg`;
  const outFile = path.join(OUT_DIR, `${slug}.svg`);

  if (!DRY) {
    fs.writeFileSync(outFile, buildSvg(hue), 'utf8');
    fs.writeFileSync(full, `---\n${setIndexImg(parts.fm, url)}\n---\n${parts.body}`, 'utf8');
  }
  done.push({ slug, hue, bytes: DRY ? 0 : fs.statSync(outFile).size });
}

const total = done.reduce((s, d) => s + d.bytes, 0);
console.log(`扫描 ${files.length} 篇`);
console.log(`生成占位封面 ${done.length} 篇${DRY ? '（--dry-run，未写入）' : ''}`);
for (const d of done) {
  console.log(`  色相 ${String(d.hue).padStart(3)}°  ${String(d.bytes).padStart(4)} B  ${d.slug}`);
}
if (done.length) console.log(`  合计 ${(total / 1024).toFixed(1)} KB`);
if (skipped.length) {
  console.log(`\n跳过 ${skipped.length} 篇（已有真实封面）`);
  for (const [f, why] of skipped) console.log(`  ${f}  —— ${why}`);
}
