#!/usr/bin/env node
/**
 * 为每篇文章挑一张「首页卡片预览图」，写进 front-matter 的 index_img
 * =============================================================================
 * 用法：node tools/pick-covers.mjs [--force] [--dry-run]
 *
 * 为什么要挑：
 *   Fluid 的首页卡片只有在文章有 index_img 时才渲染图片（并自动变成左图右文
 *   的两栏卡片）。没有 index_img 就退化成纯文字列表 —— 这就是首页「单栏流水」
 *   的原因。
 *
 * 挑图策略：
 *   1. 只从「正文里真正引用过、且存在于该文章资产文件夹」的图里挑，保证预览图和
 *      内容相关；
 *   2. 优先横图（宽高比 ≥ 1.15）—— 竖着截的长图当缩略图会被裁得很难看；
 *   3. 在横图里挑宽度最接近 640px 的：太窄当封面会糊，太宽首页加载会慢。
 *      WordPress 迁移过来的 `-300x169` / `-1024x768` 这类缩略图正好派上用场。
 *   4. 没有横图就退而求其次选面积最大的。
 *
 * 注意：index_img 走的是 theme 里的 url_for()，必须写「站点根路径」
 *      （/posts/<slug>/<file>），不能像正文那样只写文件名。
 * =============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const FORCE = argv.includes('--force');
const DRY = argv.includes('--dry-run');

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'source', '_posts');
// 卡片封面在 CSS 里按 16:10 裁切（见 source/css/custom.css），理想宽高比 1.6
const TARGET_AR = 1.6;
// 理想宽度：太窄当封面会糊，太宽首页加载会慢
const TARGET_WIDTH = 500;
// 超过这个体积就开始扣分（首页一屏 10 张卡片，单张别太重）
const HEAVY_BYTES = 120 * 1024;
// CSS 里封面框按 16:10 裁切（object-fit: cover），所以真正参与显示的是
// 「按 16:10 居中裁出来的那一块」。它太窄的话放大后会糊，这里设个下限：
// 裁完宽度不足 240px 的图直接淘汰（卡片里图片列约 360px 宽）。
const MIN_CROPPED_WIDTH = 240;

// ---------------------------------------------------------------------------
// 读图片尺寸（PNG / JPEG / WebP / GIF），够用就行，不引入依赖
// ---------------------------------------------------------------------------
function imageSize(file) {
  const b = fs.readFileSync(file);
  // PNG
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  }
  // GIF
  if (b.length > 10 && b.toString('ascii', 0, 3) === 'GIF') {
    return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
  }
  // WebP
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const fmt = b.toString('ascii', 12, 16);
    if (fmt === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (fmt === 'VP8L') {
      const n = b.readUInt32LE(21);
      return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 };
    }
    if (fmt === 'VP8X') {
      return { w: b.readUIntLE(24, 3) + 1, h: b.readUIntLE(27, 3) + 1 };
    }
  }
  // JPEG：扫 SOF 段
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      }
      const len = b.readUInt16BE(i + 2);
      i += 2 + len;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// 从正文里找出「引用过、且本地存在」的图片文件名
// ---------------------------------------------------------------------------
function referencedImages(body) {
  const names = new Set();
  for (const m of body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) names.add(m[1]);
  for (const m of body.matchAll(/<img[^>]*\ssrc="([^"]+)"/gi)) names.add(m[1]);
  return [...names].filter((n) => !/^([a-z]+:|\/|#|data:)/i.test(n) && /\.(png|jpe?g|gif|webp)$/i.test(n));
}

/**
 * 打分：分数越低越合适。
 * 用对数距离，这样 300 与 500、以及 1000 与 500 的「偏了多少」是对称的；
 * 宽高比权重最高，因为瘦长条塞进 16:10 的框里会被裁得很难看。
 */
function scoreOf(c) {
  const ar = c.w / c.h;
  const pAr = Math.abs(Math.log(ar / TARGET_AR)) * 2.0;
  const pW = Math.abs(Math.log(c.w / TARGET_WIDTH)) * 1.0;
  const pBytes = c.bytes > HEAVY_BYTES ? Math.log(c.bytes / HEAVY_BYTES) * 1.5 : 0;
  const pTiny = c.w < 260 ? 0.6 : 0;
  return pAr + pW + pBytes + pTiny;
}

function pickCover(assetDir, body) {
  const all = [];
  for (const name of referencedImages(body)) {
    const file = path.join(assetDir, name);
    if (!fs.existsSync(file)) continue;
    const size = imageSize(file);
    if (!size || !size.w || !size.h) continue;
    all.push({ name, ...size, bytes: fs.statSync(file).size });
  }
  if (all.length === 0) return { pick: null, candidates: all, rejected: 0 };

  // 按 16:10 居中裁切后实际还有多宽
  const croppedWidth = (c) => Math.min(c.w, c.h * TARGET_AR);
  const usable = all.filter((c) => croppedWidth(c) >= MIN_CROPPED_WIDTH);
  const rejected = all.length - usable.length;
  if (usable.length === 0) return { pick: null, candidates: all, rejected };

  const ranked = usable.slice().sort((a, b) => scoreOf(a) - scoreOf(b));
  return { pick: ranked[0], candidates: all, rejected, score: scoreOf(ranked[0]) };
}

// ---------------------------------------------------------------------------
// front-matter 处理
// ---------------------------------------------------------------------------
function splitPost(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  return { fm: m[1], body: text.slice(m[0].length), raw: m[0] };
}

function setIndexImg(fm, value) {
  const lines = fm.split(/\r?\n/);
  const kept = lines.filter((l) => !/^index_img\s*:/.test(l));
  kept.push(`index_img: ${JSON.stringify(value)}`);
  return kept.join('\n');
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------
const posts = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')).sort();
const rows = [];

for (const file of posts) {
  const full = path.join(POSTS_DIR, file);
  const text = fs.readFileSync(full, 'utf8');
  const parts = splitPost(text);
  if (!parts) { rows.push({ file, skipped: '无 front-matter' }); continue; }

  const slug = path.basename(file, '.md');
  const assetDir = path.join(POSTS_DIR, slug);

  // 已经有封面就不动（想重挑用 --force）
  if (/^index_img\s*:/m.test(parts.fm) && !FORCE) {
    rows.push({ file, skipped: '已有 index_img' });
    continue;
  }

  const { pick, candidates, score, rejected } = pickCover(assetDir, parts.body);
  if (!pick) {
    rows.push({
      file,
      skipped: candidates.length === 0
        ? '无可用图片'
        : `图片都太小（裁成 16:10 后不足 ${MIN_CROPPED_WIDTH}px）`,
    });
    continue;
  }

  const url = `/posts/${slug}/${pick.name}`;
  const newFm = setIndexImg(parts.fm, url);
  const out = `---\n${newFm}\n---\n${parts.body}`;
  if (!DRY) fs.writeFileSync(full, out, 'utf8');

  rows.push({
    file, url, w: pick.w, h: pick.h, kb: Math.round(pick.bytes / 1024),
    ar: (pick.w / pick.h).toFixed(2), total: candidates.length, score: score.toFixed(2),
  });
}

// ---------------------------------------------------------------------------
// 报告
// ---------------------------------------------------------------------------
const done = rows.filter((r) => r.url);
const skipped = rows.filter((r) => r.skipped);

console.log(`扫描 ${posts.length} 篇；选中封面 ${done.length} 篇；跳过 ${skipped.length} 篇`);
if (DRY) console.log('（--dry-run，未写入）');
console.log();
console.log('=== 选中的封面 ===');
for (const r of done.sort((a, b) => a.file.localeCompare(b.file))) {
  console.log(
    `  ${String(r.w).padStart(4)}x${String(r.h).padEnd(4)} 比${String(r.ar).padEnd(5)} ` +
    `${String(r.kb).padStart(4)} KB  候选${String(r.total).padStart(2)}  分${String(r.score).padStart(5)}  ` +
    `${r.file.replace(/\.md$/, '')}`
  );
}
const totalKb = done.reduce((s, r) => s + r.kb, 0);
console.log(`\n  封面合计 ${(totalKb / 1024).toFixed(2)} MB（首页一屏 10 张，配合懒加载）`);
if (skipped.length) {
  console.log();
  console.log('=== 跳过 ===');
  for (const r of skipped) console.log(`  ${r.file}  —— ${r.skipped}`);
}
