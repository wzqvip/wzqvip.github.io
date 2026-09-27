/* global hexo */
/**
 * 「拆解」板块（/teardown/）
 * =============================================================================
 * 这个文件放在站点根目录的 scripts/ 下，Hexo 会自动当插件加载
 * （Hexo 把 <站点>/scripts/ 当作插件目录，里面的 .js 会被逐个加载）。
 *
 * 它做两件事：
 *   1. 把「拆解」类文章从首页列表中剔除 —— 只影响首页，归档页 / 分类页 /
 *      标签页 / 文章页都照常保留；
 *   2. 生成一个独立的 /teardown/ 板块页，用卡片网格展示，每张卡片带封面图。
 *
 * 为什么不用简单的 `archive: true` 前置参数？
 *   Fluid 的 post-filter 里 `archive: true` 确实能把文章从首页剔除，
 *   但同一个字段还被 in_scope() 用来判断「当前页面属于哪个作用域」，
 *   会给这些文章页悄悄改掉一部分主题特性的生效范围。用过滤器只动 index_posts，
 *   没有副作用。
 * =============================================================================
 */

'use strict';

const TEARDOWN_CATEGORY = 'Teardown';
const SECTION_PATH = 'teardown/index.html';
const SECTION_URL = '/teardown/';

// ---------------------------------------------------------------------------
// 小工具
// ---------------------------------------------------------------------------

/** Hexo 的 Query 是类数组（warehouse 的 Query 继承自 Array），统一转成真数组 */
function toArray(q) {
  if (!q) return [];
  if (typeof q.toArray === 'function') return q.toArray();
  return Array.from(q);
}

function hasCategory(post, name) {
  return toArray(post.categories).some((c) => c && c.name === name);
}

const isTeardown = (post) => hasCategory(post, TEARDOWN_CATEGORY);

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 取 url_for 助手；拿不到就退回按 root 手拼，保证路径和主题一致 */
function makeUrlFor() {
  const helper = hexo.extend.helper.get('url_for');
  if (typeof helper === 'function') return (p) => helper.call(hexo, p);
  const root = String(hexo.config.root || '/').replace(/\/?$/, '/');
  return (p) => root + String(p || '').replace(/^\/+/, '');
}

/**
 * 取 Hexo 核心的 date 助手来格式化日期。
 * 不要用 post.date.format()：post.date 是 UTC 的 moment，直接 format 会得到 UTC 日期，
 * 北京时间凌晨发布的文章会显示成前一天。核心的 date 助手会按 config.timezone 转换
 * （见 hexo/dist/plugins/helper/date.js 的 getMoment）。
 * 该助手读 this.page.lang 与 this.config，所以要喂一个带这两项的上下文。
 */
function makeDateFormatter() {
  const helper = hexo.extend.helper.get('date');
  const format = hexo.config.date_format || 'YYYY-MM-DD';
  if (typeof helper !== 'function') return (d) => d.format(format);
  const ctx = { config: hexo.config, page: {} };
  return (d) => helper.call(ctx, d, format);
}

function plainText(html, limit) {
  const text = String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > limit ? text.slice(0, limit) + '…' : text;
}

// ---------------------------------------------------------------------------
// 1. 首页剔除「拆解」类文章
//    Fluid 在 before_generate（默认优先级 10）里设置 index_posts，
//    这里用 20 保证跑在它之后，只重新过滤 index_posts。
// ---------------------------------------------------------------------------
hexo.extend.filter.register('before_generate', function () {
  const posts = this.locals.get('index_posts');
  if (!posts) return;
  const kept = posts.filter((post) => !isTeardown(post));
  this.locals.set('index_posts', kept);
  hexo.log.debug(
    '[teardown] 首页剔除拆解文章 %d 篇，剩 %d 篇',
    posts.length - kept.length,
    kept.length
  );
}, 20);

// ---------------------------------------------------------------------------
// 2. 生成 /teardown/ 板块页
// ---------------------------------------------------------------------------
hexo.extend.generator.register('teardown', function (locals) {
  const urlFor = makeUrlFor();
  const fmtDate = makeDateFormatter();

  const posts = toArray(locals.posts)
    .filter(isTeardown)
    .sort((a, b) => b.date - a.date);

  if (posts.length === 0) return;

  const cards = posts.map((post) => {
    const href = urlFor(post.path);
    const cover = post.index_img ? urlFor(post.index_img) : null;
    const desc = plainText(post.description || post.excerpt || '', 110);
    const date = fmtDate(post.date);
    const cats = toArray(post.categories).map((c) => c.name);
    const tags = toArray(post.tags).map((t) => t.name);
    const metaLabel = cats.length ? cats.join(' / ') : tags.slice(0, 2).join(' / ');

    const coverHtml = cover
      ? `<div class="td-cover"><img src="${escapeHtml(cover)}" alt="${escapeHtml(post.title)}" loading="lazy"></div>`
      : '<div class="td-cover td-cover--none">没有配图</div>';

    return [
      `<a class="td-card" href="${escapeHtml(href)}">`,
      coverHtml,
      '<div class="td-body">',
      `<h3 class="td-title">${escapeHtml(post.title)}</h3>`,
      desc ? `<p class="td-desc">${escapeHtml(desc)}</p>` : '',
      '<div class="td-meta">',
      `<span><i class="iconfont icon-date"></i>${escapeHtml(date)}</span>`,
      metaLabel ? `<span><i class="iconfont icon-category"></i>${escapeHtml(metaLabel)}</span>` : '',
      '</div>',
      '</div>',
      '</a>',
    ].join('');
  }).join('');

  const content = [
    `<p class="td-intro">硬件拆解笔记：买回来先拆开看看里面到底用了什么方案、值不值这个价。共 ${posts.length} 篇。</p>`,
    `<div class="td-grid">${cards}</div>`,
  ].join('');

  return {
    path: SECTION_PATH,
    layout: 'page',
    data: {
      title: '拆解',
      content,
      comments: false,
      // 给 Fluid 的 page 模板用；不设 subtitle 时横幅会显示 title
      __teardown: true,
    },
  };
});

// 让板块页的导航链接有个记录点，方便排查
hexo.log.debug('[teardown] 板块地址 %s', SECTION_URL);
