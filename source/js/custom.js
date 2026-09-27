/**
 * 首页瀑布流（两列独立堆叠）
 * =============================================================================
 * 由 _config.fluid.yml 的 `custom_js: /js/custom.js` 引入。
 *
 * 为什么需要这段 JS：
 *   首页原本是 CSS 网格的两栏布局，同一行的两张卡片必然等高。只要一篇有配图、
 *   一篇没有，高度差就会变成一片空白（卡片下方空一块）。
 *   真正的瀑布流需要让每一列独立堆叠 —— 但原生 CSS 瀑布流
 *   （grid-template-rows: masonry）Chrome 153 都还不支持，所以在 JS 里
 *   把卡片按顺序分进两列，之后完全交给 CSS 流式排布。
 *
 * 这个做法有两个好处：
 *   1. 分栏后不再需要测量高度、也不需要监听图片加载 —— 每列是独立的
 *      纵向流，图片加载完列自己会长高，天然不会留洞；
 *   2. 按「奇数进左列、偶数进右列」分配，从左到右读仍然是时间倒序
 *      （第 1 篇在左上，第 2 篇在右上，第 3 篇在左列第二张……）。
 *
 * 窄屏（< 768px）不分栏，保持单列。
 * =============================================================================
 */
(function () {
  'use strict';

  var DESKTOP = '(min-width: 768px)';

  function init() {
    var container = document.querySelector('#board .col-12');
    if (!container) return;

    // 收集首页卡片（容器里还有隐藏的 h1 和分页器，要排除掉）
    var cards = [];
    for (var i = 0; i < container.children.length; i++) {
      var el = container.children[i];
      if (el.classList && el.classList.contains('index-card')) cards.push(el);
    }
    if (cards.length < 2) return;

    var nav = container.querySelector(':scope > nav[aria-label="navigation"]');
    var mq = window.matchMedia(DESKTOP);
    var wrap = null;

    /** 还原成单列：把卡片按原顺序放回容器 */
    function teardown() {
      if (!wrap) return;
      var frag = document.createDocumentFragment();
      for (var i = 0; i < cards.length; i++) frag.appendChild(cards[i]);
      container.insertBefore(frag, wrap);
      container.removeChild(wrap);
      wrap = null;
    }

    /** 分栏 */
    function build() {
      teardown();
      if (!mq.matches) return;

      var cols = [document.createElement('div'), document.createElement('div')];
      cols[0].className = 'index-col';
      cols[1].className = 'index-col';
      for (var i = 0; i < cards.length; i++) cols[i % 2].appendChild(cards[i]);

      wrap = document.createElement('div');
      wrap.className = 'index-masonry';
      wrap.appendChild(cols[0]);
      wrap.appendChild(cols[1]);

      // 插在分页器之前，分页器仍然独占一行
      container.insertBefore(wrap, nav || null);
    }

    build();

    var onChange = function () { build(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  // 这段 JS 由主题放在 body 末尾同步执行，此时 #board 已经存在，
  // 直接跑就能赶在首次绘制之前完成分栏，避免闪一下单列。
  if (document.querySelector('#board .col-12')) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
