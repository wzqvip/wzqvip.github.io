#!/usr/bin/env node
/**
 * WordPress (mysqldump) → Hexo 迁移脚本 —— 一次性工具
 * =============================================================================
 * 用途：把 WordPress 的 SQL 导出 + wp-content/uploads 目录，转换成 Hexo 的文章、
 *       文章同名资产文件夹、关于页，并重写正文里的图片 / 附件 / 内链路径。
 *
 * 用法：
 *   node scripts/migrate-wordpress.mjs <dump.sql> <uploads目录> [--dry-run]
 *
 * 依赖：turndown / turndown-plugin-gfm（devDependencies，只在跑本脚本时需要）
 *
 * 设计要点（都有实测依据，改之前请先读 README 第四节）：
 *   1. 正文图片必须写成「只写文件名」的裸文件名，Hexo 才能靠 post_asset_folder 解析；
 *   2. 所以脚本先把 HTML 里的旧图片 URL 换成裸文件名，再交给 turndown 转 Markdown；
 *   3. 原始 HTML（例如 <details> 内部）里残留的裸文件名同样可用——浏览器按当前页面
 *      路径解析，正好等于资产所在目录；
 *   4. WordPress 短代码只转换确认存在的 [caption]/[collapse]/[github]；
 *      [xxx]、[MISSING DATASHEET] 这类是作者正文里的字面文字，绝不能动。
 * =============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

// ---------------------------------------------------------------------------
// 配置
// ---------------------------------------------------------------------------
const TABLE_PREFIX = 'blog_tacoin_site_';
const SITE = 'https://wzqvip.github.io';
const OLD_HOSTS = ['blog.tacoin.site'];

// 安装器自带的示例内容，不迁移
const SKIP_POST_IDS = new Set(['1', '28']);       // 世界，您好！ / 欢迎使用 Typecho
const SKIP_PAGE_SLUGS = new Set(['sample-page', 'privacy-policy']); // 官方示例页 / 未发布的样板隐私政策
const ABOUT_PAGE_SLUG = 'start-page';             // 关于我

// ---------------------------------------------------------------------------
// 参数
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const positional = argv.filter((a) => !a.startsWith('--'));
const [sqlFile, uploadsDir] = positional;
if (!sqlFile || !uploadsDir) {
  console.error('用法: node scripts/migrate-wordpress.mjs <dump.sql> <uploads目录> [--dry-run]');
  process.exit(1);
}
const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'source', '_posts');
const DRAFTS_DIR = path.join(ROOT, 'source', '_drafts');
const ABOUT_DIR = path.join(ROOT, 'source', 'about');

// ---------------------------------------------------------------------------
// mysqldump 解析
// ---------------------------------------------------------------------------
const sql = fs.readFileSync(sqlFile, 'utf8');
if (sql.includes('\uFFFD')) {
  console.warn('⚠️  SQL 里出现替换字符 U+FFFD，可能不是 UTF-8，请检查');
}

function columnsOf(table) {
  const start = sql.indexOf(`CREATE TABLE \`${table}\``);
  if (start === -1) return null;
  const open = sql.indexOf('(', start);
  const end = sql.indexOf('\n)', open);
  const body = sql.slice(open + 1, end === -1 ? sql.length : end);
  const cols = [];
  for (const raw of body.split('\n')) {
    const m = raw.match(/^\s*`([^`]+)`\s+\S/);
    if (m) cols.push(m[1]);
  }
  return cols;
}

function parseTuples(s, i) {
  const rows = [];
  const n = s.length;
  for (;;) {
    while (i < n && /[\s,]/.test(s[i])) i++;
    if (i >= n || s[i] !== '(') break;
    i++;
    const row = [];
    for (;;) {
      while (i < n && /\s/.test(s[i])) i++;
      if (s[i] === "'") {
        i++;
        let out = '';
        while (i < n) {
          const c = s[i];
          if (c === '\\') {
            const e = s[i + 1];
            i += 2;
            switch (e) {
              case 'n': out += '\n'; break;
              case 'r': out += '\r'; break;
              case 't': out += '\t'; break;
              case '0': out += '\0'; break;
              case 'b': out += '\b'; break;
              case 'Z': out += '\x1a'; break;
              case "'": out += "'"; break;
              case '"': out += '"'; break;
              case '\\': out += '\\'; break;
              default: out += e; break;
            }
            continue;
          }
          if (c === "'") {
            if (s[i + 1] === "'") { out += "'"; i += 2; continue; }
            i++;
            break;
          }
          out += c;
          i++;
        }
        row.push(out);
      } else if (s.startsWith('NULL', i)) {
        row.push(null);
        i += 4;
      } else {
        let j = i;
        while (j < n && s[j] !== ',' && s[j] !== ')') j++;
        row.push(s.slice(i, j).trim());
        i = j;
      }
      while (i < n && /\s/.test(s[i])) i++;
      if (s[i] === ',') { i++; continue; }
      if (s[i] === ')') { i++; break; }
      break;
    }
    rows.push(row);
  }
  return { rows, end: i };
}

function tableRows(table) {
  const cols = columnsOf(table);
  if (!cols) return [];
  const out = [];
  const needle = `INSERT INTO \`${table}\``;
  let idx = 0;
  for (;;) {
    const p = sql.indexOf(needle, idx);
    if (p === -1) break;
    const vp = sql.indexOf('VALUES', p);
    if (vp === -1) break;
    const { rows, end } = parseTuples(sql, vp + 'VALUES'.length);
    for (const r of rows) {
      const o = {};
      cols.forEach((c, k) => { o[c] = r[k] === undefined ? null : r[k]; });
      out.push(o);
    }
    idx = end;
  }
  return out;
}

const T = (name) => tableRows(TABLE_PREFIX + name);
const posts = T('posts');
const terms = T('terms');
const termTaxonomy = T('term_taxonomy');
const termRelationships = T('term_relationships');

// ---------------------------------------------------------------------------
// 本地 uploads 索引
// ---------------------------------------------------------------------------
const uploadIndex = new Map(); // "2024/09/x.png" -> 绝对路径
(function walk(dir, rel) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(path.join(dir, e.name), r);
    else uploadIndex.set(r, path.join(dir, e.name));
  }
})(uploadsDir, '');
console.log(`本地 uploads 文件: ${uploadIndex.size}`);

/** 旧站图片 / 附件 URL → uploads 下的相对路径 */
function normAsset(url) {
  let p = url.replace(/^https?:\/\/[^/]+/, '').replace(/^\/usr\//, '/').replace(/^\//, '');
  p = p.replace(/^wp-content\/uploads\//, '').split('?')[0].split('#')[0];
  try { p = decodeURIComponent(p); } catch { /* 保持原样 */ }
  return p;
}

// ---------------------------------------------------------------------------
// slug 生成
// ---------------------------------------------------------------------------
/**
 * 白名单式清洗：只保留「各语言文字、数字、. _ -」，其余一律换成连字符。
 * 这样能顺带干掉 [] （） 等会破坏 URL 和 Markdown 的字符。
 */
function sanitizeFilename(s) {
  return (s || '')
    .replace(/[^\p{L}\p{N}._-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 80) || 'post';
}

/**
 * 优先从标题提取英文 / 技术词做 slug；
 * 提取结果太弱（只有 1 个词、太短、或全是数字）时退回中文标题。
 */
function makeSlug(title) {
  const ascii = (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const tokens = ascii ? ascii.split('-').filter(Boolean) : [];
  const hasWord = tokens.some((t) => /[a-z]{2,}/.test(t));
  const english = tokens.length >= 2 && ascii.length >= 6 && hasWord;
  return english ? ascii : sanitizeFilename(title);
}

const slugUsed = new Set();
function uniqueSlug(base) {
  let s = base || 'post';
  let i = 2;
  while (slugUsed.has(s)) s = `${base}-${i++}`;
  slugUsed.add(s);
  return s;
}

// ---------------------------------------------------------------------------
// 分类 / 标签
// ---------------------------------------------------------------------------
const termById = new Map(terms.map((t) => [String(t.term_id), t]));
const ttById = new Map(termTaxonomy.map((t) => [String(t.term_taxonomy_id), t]));

function taxonomiesOf(postId) {
  const cats = [];
  const tags = [];
  for (const rel of termRelationships) {
    if (String(rel.object_id) !== String(postId)) continue;
    const tt = ttById.get(String(rel.term_taxonomy_id));
    if (!tt) continue;
    const name = termById.get(String(tt.term_id))?.name;
    if (!name) continue;
    if (tt.taxonomy === 'category' && name !== 'uncategorized') cats.push(name);
    if (tt.taxonomy === 'post_tag') tags.push(name);
  }
  return { cats, tags };
}

// ---------------------------------------------------------------------------
// HTML → Markdown
// ---------------------------------------------------------------------------
const turndown = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined',
});
turndown.use(gfm);

const KEEP_TAGS = new Set([
  'div', 'span', 'p', 'br', 'hr', 'a', 'img', 'figure', 'figcaption',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'strong',
  'em', 'b', 'i', 'u', 's', 'del', 'ins', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'caption', 'colgroup', 'col', 'dl', 'dt', 'dd', 'sub', 'sup', 'small', 'mark', 'time', 'section',
  'article', 'header', 'footer', 'nav', 'aside', 'main', 'details', 'summary', 'abbr', 'cite', 'q',
  'kbd', 'samp', 'var', 'wbr', 'font', 'center', 'big', 'strike', 'tt', 'label', 'iframe', 'video',
  'audio', 'source', 'picture', 'map', 'area', 'noscript', 'svg', 'path',
]);

/** 去掉白名单之外标签的外壳，保留内部内容（WordPress 插件常塞自定义标签） */
function stripUnknownTags(html) {
  return html.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g, (m, _close, name) =>
    (KEEP_TAGS.has(name.toLowerCase()) ? m : ''));
}

function preprocess(html) {
  let h = html || '';
  h = h.replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '');                    // Gutenberg 块注释
  h = h.replace(/<!--\s*more\s*-->/gi, '\n\n@@MORE@@\n\n');          // 摘要分隔符
  h = h.replace(/<p[^>]*>\s*(?:&nbsp;|\u00a0|\s)*<\/p>/gi, '');      // 空段落
  h = stripUnknownTags(h);
  return `<div>${h}</div>`;
}

/** WordPress 短代码转换（只处理确认存在的三种） */
function convertShortcodes(html, collapseTitles) {
  let h = html;

  // [caption ...]...[/caption] → 保留内部内容（图片链接 + 说明文字）
  h = h.replace(/\[caption\b[^\]]*\]([\s\S]*?)\[\/caption\]/gi, '$1');

  // [github author="x" project="y" /] → 普通链接
  h = h.replace(/\[github\b([^\]]*?)\/\]/gi, (m, attrs) => {
    const author = (attrs.match(/author="([^"]*)"/) || [, ''])[1].trim();
    const project = (attrs.match(/project="([^"]*)"/) || [, ''])[1].trim();
    if (!author) return '';
    const url = project ? `https://github.com/${author}/${project}` : `https://github.com/${author}`;
    return `<p><a href="${url}">${project ? `${author}/${project}` : author}</a></p>`;
  });

  // [collapse title="..."] → 占位符，turndown 之后再还原成 <details>
  h = h.replace(/\[collapse\b([^\]]*)\]/gi, (m, attrs) => {
    const i = attrs.indexOf('title="');
    let title = i >= 0 ? attrs.slice(i + 7) : '';
    title = title.replace(/"\s*$/, '').replace(/<[^>]*>/g, '').trim();
    collapseTitles.push(title || '展开');
    return `\n\nXXCOLLAPSEOPEN${collapseTitles.length - 1}XX\n\n`;
  });
  h = h.replace(/\[\/collapse\]/gi, '\n\nXXCOLLAPSECLOSEXX\n\n');

  return h;
}

/** turndown 之后收尾 */
function postprocess(md, collapseTitles) {
  let s = md;
  s = s.replace(/XXCOLLAPSEOPEN(\d+)XX/g, (m, i) =>
    `\n\n<details>\n<summary>${collapseTitles[Number(i)]}</summary>\n\n`);
  s = s.replace(/XXCOLLAPSECLOSEXX/g, '\n\n</details>\n\n');
  s = s.replace(/@@MORE@@/g, '\n\n<!-- more -->\n\n');
  s = s.replace(/\u00a0/g, ' ');
  s = s.replace(/[ \t]+$/gm, '');
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.replace(/^\s+|\s+$/g, '') + '\n';
}

// ---------------------------------------------------------------------------
// 内链重映射（旧站文章链接 → 新 permalink）
// ---------------------------------------------------------------------------
const oldNameToSlug = new Map();

function remapInternalLink(url) {
  let u;
  try { u = new URL(url); } catch { return null; }
  if (!OLD_HOSTS.includes(u.host)) return null;
  if (/wp-content\/uploads/.test(u.pathname)) return null; // 交给资产重写
  const p = decodeURIComponent(u.pathname);
  let name = null;
  let m;
  if ((m = p.match(/\/archives\/([^/]+)/))) name = m[1];
  else if ((m = p.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)/))) name = m[4];
  else if ((m = p.match(/[?&]p=(\d+)/))) name = m[1];
  if (!name) return null;
  const slug = oldNameToSlug.get(name);
  return slug ? `${SITE}/posts/${slug}/` : null;
}

// ---------------------------------------------------------------------------
// 统计
// ---------------------------------------------------------------------------
const stats = {
  posts: 0, pages: 0, drafts: 0, assets: 0, assetBytes: 0, redacted: 0,
  missing: new Map(), external: new Map(), leftovers: [], slugMap: [], noContent: [],
};

/**
 * 移除正文里内联的私钥。
 * GitHub 的 Push Protection 会把任何 `-----BEGIN ... PRIVATE KEY-----` 块判定为
 * 「泄露私钥」并直接拒绝推送——CTF 题解里非常常见（那本来就是题目答案）。
 * 因此在写入仓库之前就替换成提示文字，指向原文链接。
 */
function redactPrivateKeys(text) {
  const re = /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g;
  const n = (text.match(re) || []).length;
  if (n) stats.redacted += n;
  return text.replace(re, '（原文此处内联了一段私钥；为避免被 GitHub 推送保护拦截，本站不再内联，请点上方链接查看原文）');
}

const isOldHost = (url) => {
  try { return OLD_HOSTS.includes(new URL(url).host); } catch { return false; }
};

/**
 * 重写正文资产 URL → 裸文件名，并把文件复制进资产目录。
 * 只处理旧站（OLD_HOSTS）的资源；第三方外链（例如厂商官网的图）保持原样不动。
 */
function rewriteAssets(html, assetDir) {
  const local = new Map();
  const usedNames = new Set();
  const urls = new Set();
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/gi)) {
    const u = m[1];
    if (/wp-content\/uploads\//.test(u) || /(^|\/)uploads\//.test(u)) urls.add(u);
  }

  for (const url of urls) {
    if (!isOldHost(url)) {
      // 第三方图床/官网的外链图，脚本无法本地化，保持绝对 URL
      stats.external.set(url, (stats.external.get(url) || 0) + 1);
      continue;
    }
    const key = normAsset(url);
    const src = uploadIndex.get(key);
    if (!src) {
      stats.missing.set(key, (stats.missing.get(key) || 0) + 1);
      continue;
    }
    const base = path.basename(key);
    let name = base;
    let i = 2;
    while (usedNames.has(name)) {
      const ext = path.extname(base);
      name = `${path.basename(base, ext)}-${i++}${ext}`;
    }
    usedNames.add(name);
    local.set(url, name);

    if (assetDir) {
      const dest = path.join(assetDir, name);
      const same = fs.existsSync(dest) && fs.statSync(dest).size === fs.statSync(src).size;
      if (!same) {
        if (!DRY) {
          fs.mkdirSync(assetDir, { recursive: true });
          fs.copyFileSync(src, dest);
        }
        stats.assets++;
        stats.assetBytes += fs.statSync(src).size;
      }
    }
  }

  let out = html;
  for (const [url, name] of local) out = out.split(url).join(name);

  // 兜底：还有指向旧站的引用就说明没处理干净
  for (const m of out.matchAll(/(?:src|href)="([^"]*blog\.tacoin\.site[^"]*)"/gi)) {
    stats.leftovers.push(m[1]);
  }
  return out;
}

// ---------------------------------------------------------------------------
// front-matter
// ---------------------------------------------------------------------------
function buildFrontMatter({ title, date, updated, cats, tags, description, extra }) {
  const q = (s) => JSON.stringify(String(s ?? ''));
  const lines = ['---', `title: ${q(title)}`];
  if (extra) lines.push(extra);
  lines.push(`date: ${date}`);
  if (updated) lines.push(`updated: ${updated}`);
  if (cats.length) {
    lines.push('categories:');
    cats.forEach((c) => lines.push(`  - ${q(c)}`));
  }
  if (tags.length) {
    lines.push('tags:');
    tags.forEach((t) => lines.push(`  - ${q(t)}`));
  }
  if (description) lines.push(`description: ${q(description)}`);
  lines.push('---', '');
  return lines.join('\n');
}

/**
 * 生成文章摘要（description）。
 * 优先取「摘要分隔符 <!-- more -->」之前的内容——这才是首页摘要的正确来源；
 * 若之前为空（例如开头就是图片），再退回全文。
 */
function summarize(md, limit = 120) {
  const clean = (s) => s
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<details[\s\S]*?<\/details>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s*/gm, ' ')
    .replace(/^\s*[-*+]\s+/gm, ' ')
    .replace(/^\s*\d+\.\s+/gm, ' ')
    .replace(/[>*_`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let text = clean(String(md).split(/<!--\s*more\s*-->/)[0]);
  if (!text) text = clean(md);
  return text.slice(0, limit) + (text.length > limit ? '…' : '');
}

/** 非 HTML 的纯文本页面（关于页是 ASCII 树）→ 用代码块保住排版 */
function plainTextToMarkdown(text) {
  const decoded = text
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, ' ');
  const body = decoded.replace(/```/g, "'''").replace(/[ \t]+$/gm, '').replace(/\s+$/, '');
  return '```\n' + body + '\n```\n';
}

const looksLikeHtml = (s) => /<(p|div|h[1-6]|ul|ol|img|table|blockquote|pre|figure)\b/i.test(s || '');

// ---------------------------------------------------------------------------
// 规划：先定 slug，内链重映射才查得到
// ---------------------------------------------------------------------------
const allPosts = posts.filter((p) => p.post_type === 'post');
const livePosts = allPosts.filter((p) => p.post_status === 'publish' && !SKIP_POST_IDS.has(String(p.ID)));
const draftPosts = allPosts.filter((p) => p.post_status !== 'publish');
const contentPages = posts.filter((p) => p.post_type === 'page' && !SKIP_PAGE_SLUGS.has(p.post_name || ''));

const plan = [];
for (const p of livePosts) {
  const title = (p.post_title || '').trim() || '(无标题)';
  const slug = uniqueSlug(makeSlug(title));
  oldNameToSlug.set(p.post_name || String(p.ID), slug);
  plan.push({ post: p, slug, kind: 'post', title });
  stats.slugMap.push({ from: p.post_name || String(p.ID), to: slug, title });
}
for (const p of draftPosts) {
  const title = (p.post_title || '').trim() || '(无标题)';
  const slug = uniqueSlug(makeSlug(title));
  oldNameToSlug.set(p.post_name || String(p.ID), slug);
  plan.push({ post: p, slug, kind: 'draft', title });
}
for (const p of contentPages) {
  const title = (p.post_title || '').trim() || '(无标题)';
  const slug = uniqueSlug(makeSlug(title));
  oldNameToSlug.set(p.post_name || String(p.ID), slug);
  plan.push({ post: p, slug, kind: p.post_name === ABOUT_PAGE_SLUG ? 'about' : 'page', title });
}

// ---------------------------------------------------------------------------
// 执行
// ---------------------------------------------------------------------------
console.log('\n=== 迁移 ===');
for (const item of plan) {
  const { post, slug, kind, title } = item;
  const isAbout = kind === 'about';
  const baseDir = kind === 'draft' ? DRAFTS_DIR : isAbout ? ABOUT_DIR : POSTS_DIR;
  const assetDir = path.join(baseDir, isAbout ? '' : slug);

  const collapseTitles = [];
  const rawContent = redactPrivateKeys(post.post_content || '');
  const { cats, tags } = taxonomiesOf(post.ID);
  const date = (post.post_date || '').slice(0, 19);

  let body;
  if (!looksLikeHtml(rawContent)) {
    // 纯文本页面：先重写资产，再包代码块（关于页是 ASCII 树，必须保住排版）
    body = plainTextToMarkdown(rewriteAssets(rawContent, assetDir));
    stats.noContent.push(`${title} (纯文本)`);
  } else {
    let html = preprocess(rawContent);
    html = convertShortcodes(html, collapseTitles);
    html = html.replace(/href="([^"]+)"/gi, (m, url) => {
      const nu = remapInternalLink(url);
      return nu ? `href="${nu}"` : m;
    });
    html = rewriteAssets(html, assetDir);
    body = postprocess(turndown.turndown(html), collapseTitles);
  }

  let updated = (post.post_modified || '').slice(0, 19);
  if (!updated || updated <= date) updated = '';
  else {
    const d1 = new Date(date.replace(' ', 'T') + 'Z');
    const d2 = new Date(updated.replace(' ', 'T') + 'Z');
    if ((d2 - d1) < 24 * 3600 * 1000) updated = '';
  }

  const file = isAbout
    ? path.join(ABOUT_DIR, 'index.md')
    : path.join(baseDir, `${slug}.md`);

  const out = buildFrontMatter({
    title,
    date,
    updated,
    cats,
    tags,
    description: summarize(body),
    extra: isAbout ? 'layout: about\ncomments: false' : null,
  }) + '\n' + body;

  if (!DRY) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, out, 'utf8');
  }
  if (kind === 'post') stats.posts++;
  else if (kind === 'draft') stats.drafts++;
  else stats.pages++;

  console.log(`  ${kind.padEnd(5)} ${String(post.ID).padStart(4)}  ${slug}`);
}

// ---------------------------------------------------------------------------
// 报告
// ---------------------------------------------------------------------------
console.log('\n=== 报告 ===');
console.log(`文章 ${stats.posts} / 页面 ${stats.pages} / 草稿 ${stats.drafts}`);
console.log(`复制资产 ${stats.assets} 个，共 ${(stats.assetBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`移除内联私钥 ${stats.redacted} 处（否则会被 GitHub 推送保护拒绝）`);
console.log(`\n缺失资产 ${stats.missing.size} 个（旧站有、本地包里没有）:`);
for (const [k, v] of stats.missing) console.log(`   ${k}  (引用 ${v} 次)`);
console.log(`\n第三方外链图片 ${stats.external.size} 个（不是你的文件，保持绝对 URL 未动）:`);
for (const [u, n] of stats.external) console.log(`   ${u}  (引用 ${n} 次)`);
console.log(`\n残留旧站链接 ${stats.leftovers.length} 处:`);
[...new Set(stats.leftovers)].forEach((u) => console.log('   ' + u));
if (stats.noContent.length) {
  console.log('\n按纯文本处理（包了代码块）:');
  stats.noContent.forEach((s) => console.log('   ' + s));
}
console.log('\n=== 旧 slug → 新 slug ===');
for (const s of stats.slugMap) console.log(`  ${String(s.from).padEnd(48)} -> ${s.to}`);
