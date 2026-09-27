/* global hexo */
/**
 * 首页简介区
 * =============================================================================
 * 主题的首页模板只有「横幅 + 卡片列表」，横幅下面到卡片之间是一大片空白。
 * 这里在瀑布流上方注入一块简介区：一段自我介绍 + 几个统计数字 + 「最新随记」
 * 小标题，参考的是 terminalbytes.com 那种「先讲清楚这是什么地方，再列文章」的做法。
 *
 * 为什么用 after_render:html 过滤器，而不是改主题模板：
 *   主题是 npm 装的，直接改 node_modules 里的文件会在 CI 上被重新安装覆盖掉；
 *   而 Hexo 的主题目录不支持「只覆盖某一个模板文件」。
 *   这个过滤器拿到的是渲染完的整页 HTML，只在首页开头的第一个卡片前插一段，
 *   实测 index 页的 data.path 正好是 "index.html"，
 *   分页页是 "page/2/index.html"，所以不会被重复注入。
 *
 * 文案在 _config.fluid.yml 的 home_intro 段里改，不用动这个文件。
 * =============================================================================
 */

'use strict';

/** Hexo 的 Query 是类数组，统一转成真数组 */
function toArray(q) {
  if (!q) return [];
  if (typeof q.toArray === 'function') return q.toArray();
  return Array.from(q);
}

/**
 * 按「名字」去重。
 * ⚠️ 实测 locals.categories 在这里不是「每个分类一条」，而是每个分类*路径*一条：
 *    categories/Homelab/、categories/Server/Homelab/、categories/Network/Homelab/ …
 * 因为 Hexo 把 front-matter 里的 categories 列表当层级处理
 * （[Server, Homelab] 会被理解成「Homelab 是 Server 的子分类」）。
 * 用户看到的 /categories/ 页只有 9 个顶层分类，所以这里按名字去重再统计。
 */
function uniqByName(list) {
  const seen = new Set();
  const out = [];
  for (const it of list) {
    const key = it.name || it.path || it._id;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

function makeUrlFor() {
  const helper = hexo.extend.helper.get('url_for');
  if (typeof helper === 'function') return (p) => helper.call(hexo, p);
  const root = String(hexo.config.root || '/').replace(/\/?$/, '/');
  return (p) => root + String(p || '').replace(/^\/+/, '');
}

/** 顺手算几个统计数字，用真实数据而不是写死的 */
function collectStats() {
  const posts = toArray(hexo.locals.get('posts'));
  const categories = uniqByName(toArray(hexo.locals.get('categories')));
  const tags = uniqByName(toArray(hexo.locals.get('tags')));

  const teardownCount = posts.filter((p) =>
    toArray(p.categories).some((c) => c && c.name === 'Teardown')).length;

  return { posts: posts.length, categories: categories.length, tags: tags.length, teardown: teardownCount };
}

function buildIntro(cfg) {
  const urlFor = makeUrlFor();
  const s = collectStats();

  const sectionTitle = cfg.section_title || '最新随记';
  const moreText = cfg.more_text || '全部文章';
  const moreLink = cfg.more_link || '/archives/';

  const lead = cfg.lead
    ? `<p class="home-intro-lead">${cfg.lead}</p>`
    : '';

  const stats = [
    { n: s.posts, label: '篇文章', href: urlFor('/archives/') },
    { n: s.categories, label: '个分类', href: urlFor('/categories/') },
    { n: s.tags, label: '个标签', href: urlFor('/tags/') },
    { n: s.teardown, label: '篇拆解', href: urlFor('/teardown/') },
  ].map((it) => [
    '<li>',
    `<a href="${it.href}">`,
    `<strong>${it.n}</strong><span>${it.label}</span>`,
    '</a>',
    '</li>',
  ].join('')).join('');

  return [
    '<section class="home-intro">',
    lead,
    `<ul class="home-intro-stats">${stats}</ul>`,
    '<div class="home-intro-head">',
    `<h2>${sectionTitle}</h2>`,
    `<a class="home-intro-more" href="${urlFor(moreLink)}">${moreText} →</a>`,
    '</div>',
    '</section>',
  ].join('');
}

hexo.extend.filter.register('after_render:html', function (str, data) {
  // 只处理首页本身；分页页 data.path 是 page/N/index.html，天然被排除
  if (!data || data.path !== 'index.html') return str;

  const cfg = hexo.theme.config.home_intro;
  if (!cfg || cfg.enable === false) return str;

  // 锚点：第一个文章卡片。找不到就原样返回，绝不把页面弄坏
  const marker = '<div class="row mx-auto index-card">';
  const at = str.indexOf(marker);
  if (at === -1) {
    hexo.log.warn('[home-intro] 首页里没找到卡片锚点，跳过注入');
    return str;
  }

  let block;
  try {
    block = buildIntro(cfg);
  } catch (err) {
    hexo.log.warn('[home-intro] 生成简介区失败，跳过：%s', err.message);
    return str;
  }

  hexo.log.debug('[home-intro] 已注入首页简介区');
  return str.slice(0, at) + block + str.slice(at);
}, 20);
