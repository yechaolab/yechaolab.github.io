/* ============================================================
   Ye Chao's Lab — Shared JavaScript
   ============================================================ */

var currentLang = 'zh';
var allPubs = [];

/* --- 语言切换 --- */
function toggleLang() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  document.getElementById('lang-label').textContent = currentLang === 'zh' ? 'EN' : '中文';
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-zh]').forEach(function (el) {
    var val = el.getAttribute('data-' + currentLang);
    if (val) el.textContent = val;
  });
  // 重新渲染论文列表（如果页面上有的话）
  if (document.getElementById('pub-list')) {
    var filter = document.getElementById('pub-list').getAttribute('data-filter') || '';
    var filterVal = document.getElementById('pub-list').getAttribute('data-filter-value') || '';
    var limit = parseInt(document.getElementById('pub-list').getAttribute('data-limit')) || 0;
    renderPubs('pub-list', filter, filterVal, limit);
  }
}

/* --- 导航栏滚动效果 --- */
window.addEventListener('scroll', function () {
  var nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 10);
});

/* --- 平滑滚动 --- */
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href^="#"]');
  if (a) {
    e.preventDefault();
    var t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var nl = document.getElementById('nav-links');
    if (nl) nl.classList.remove('open');
  }
});

/* --- 移动端菜单 --- */
function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

/* --- 加载论文数据 --- */
function loadPublications(callback) {
  if (window.location.pathname.indexOf('/team/') !== -1 ||
      window.location.pathname.indexOf('/research/') !== -1 ||
      window.location.pathname.indexOf('/news/') !== -1) {
    base = '../';
  }
  fetch(base + 'data/publications.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      allPubs = data.sort(function (a, b) { return (b.year * 100 + (b.month || 0)) - (a.year * 100 + (a.month || 0)); });
      if (callback) callback(allPubs);
    })
    .catch(function (err) {
      console.log('No publications data found:', err);
    });
}

/* --- 渲染论文列表 ---
   container: 目标 DOM id
   filterKey: 筛选字段 ('direction' 或 'author')
   filterVal: 筛选值 (如 'governance' 或 'ye-chao')
   limit: 最多显示几条 (0 = 全部)
*/
function renderPubs(containerId, filterKey, filterVal, limit) {
  var container = document.getElementById(containerId);
  if (!container || allPubs.length === 0) return;

  var pubs = allPubs;
  if (filterKey === 'direction' && filterVal) {
    pubs = pubs.filter(function (p) { return p.direction === filterVal; });
  }
  if (filterKey === 'author' && filterVal) {
    pubs = pubs.filter(function (p) { return p.authors.indexOf(filterVal) !== -1; });
  }

  // Separate articles and books
  var articles = pubs.filter(function(p) { return p.type !== 'book'; });
  var books = pubs.filter(function(p) { return p.type === 'book'; });

  if (limit > 0) articles = articles.slice(0, limit);

  var html = '';

  // Render articles grouped by year
  var years = {};
  articles.forEach(function (p) {
    if (!years[p.year]) years[p.year] = [];
    years[p.year].push(p);
  });
  var sortedYears = Object.keys(years).sort(function (a, b) { return b - a; });

  sortedYears.forEach(function (year) {
    html += '<h3 class="pub-year">' + year + '</h3>';
    years[year].forEach(function (p) {
      html += renderOnePub(p);
    });
  });

  // Render books separately (only when no limit, i.e. full page)
  if (limit === 0 && books.length > 0) {
    var bookLabel = currentLang === 'en' ? 'Books & Chapters' : '著作/章节';
    html += '<h2 class="section-title" style="margin-top:40px;">' + bookLabel + '</h2>';
    var byears = {};
    books.forEach(function(p) {
      if (!byears[p.year]) byears[p.year] = [];
      byears[p.year].push(p);
    });
    Object.keys(byears).sort(function(a,b){return b-a;}).forEach(function(year) {
      html += '<h3 class="pub-year">' + year + '</h3>';
      byears[year].forEach(function(p) {
        html += renderOnePub(p);
      });
    });
  }

  if (articles.length === 0 && books.length === 0) {
    html = '<p class="no-data">' + (currentLang === 'en' ? 'No publications yet.' : '暂无数据') + '</p>';
  }

  container.innerHTML = html;
}

function renderOnePub(p) {
  var title = currentLang === 'en' && p.title_en ? p.title_en : p.title;
  var authors = currentLang === 'en' && p.authors_display_en ? p.authors_display_en : p.authors_display;
  var h = '<div class="pub">';
  h += '<span class="pub-title">' + title + '</span><br>';
  h += '<span class="pub-authors">' + authors + '</span><br>';
  h += '<span class="pub-venue"><em>' + p.journal + '</em>, ' + p.year + '.</span>';
  h += '<span class="pub-links">';
  if (p.pdf) {
    var pdfPath = (base || '') + p.pdf;
    h += '<a href="' + pdfPath + '" target="_blank" class="pub-btn btn-pdf" download>&#128196; PDF</a>';
  }
  if (p.doi) h += '<a href="https://doi.org/' + p.doi + '" target="_blank" class="pub-btn btn-doi">DOI</a>';
  h += '<button class="pub-btn btn-cite" onclick="showCite(\'' + p.id + '\')">&#128203; Cite</button>';
  h += '</span>';
  var gb = buildGB(p);
  var apa = buildAPA(p);
  h += '<div class="cite-box" id="cite-' + p.id + '">';
  h += '<div class="cite-tabs"><span class="cite-tab active" onclick="switchCiteTab(this,\'' + p.id + '\',\'gb\')">GB/T 7714</span><span class="cite-tab" onclick="switchCiteTab(this,\'' + p.id + '\',\'apa\')">APA</span></div>';
  h += '<div class="cite-content" id="cite-gb-' + p.id + '">' + gb + '</div>';
  h += '<div class="cite-content" id="cite-apa-' + p.id + '" style="display:none">' + apa + '</div>';
  h += '<button class="cite-copy" onclick="copyCite(\'' + p.id + '\')">&#128203; Copy</button>';
  h += '</div>';
  h += '</div>';
  return h;
}

/* --- 生成 GB/T 7714 引用 --- */
function buildGB(p) {
  var authors = p.authors_display || '';
  var tag = p.type === 'book' ? '[M]' : '[J]';
  return authors + '. ' + (p.title || p.title_en) + tag + '. ' + p.journal + ', ' + p.year + '.' + (p.doi ? ' DOI:' + p.doi : '');
}

/* --- 生成 APA 引用 --- */
function buildAPA(p) {
  var authors = p.authors_display_en || p.authors_display || '';
  return authors + ' (' + p.year + '). ' + (p.title_en || p.title) + '. <em>' + p.journal + '</em>.' + (p.doi ? ' https://doi.org/' + p.doi : '');
}

/* --- 显示/隐藏引用框 --- */
function showCite(id) {
  var box = document.getElementById('cite-' + id);
  box.style.display = box.style.display === 'block' ? 'none' : 'block';
}

/* --- 切换引用格式 --- */
function switchCiteTab(tab, id, format) {
  var tabs = tab.parentNode.querySelectorAll('.cite-tab');
  tabs.forEach(function(t) { t.classList.remove('active'); });
  tab.classList.add('active');
  document.getElementById('cite-gb-' + id).style.display = format === 'gb' ? 'block' : 'none';
  document.getElementById('cite-apa-' + id).style.display = format === 'apa' ? 'block' : 'none';
}

/* --- 复制引用 --- */
function copyCite(id) {
  var gb = document.getElementById('cite-gb-' + id);
  var apa = document.getElementById('cite-apa-' + id);
  var text = (gb.style.display !== 'none' ? gb : apa).textContent;
  navigator.clipboard.writeText(text).then(function() {
    var btn = event.target;
    btn.textContent = '✓ Copied';
    setTimeout(function() { btn.innerHTML = '&#128203; Copy'; }, 1500);
  });
}

var base = '';
/* --- 页面加载时自动加载论文 --- */
document.addEventListener('DOMContentLoaded', function () {
  var pubList = document.getElementById('pub-list');
  if (pubList) {
    var filter = pubList.getAttribute('data-filter') || '';
    var filterVal = pubList.getAttribute('data-filter-value') || '';
    var limit = parseInt(pubList.getAttribute('data-limit')) || 0;
    loadPublications(function () {
      renderPubs('pub-list', filter, filterVal, limit);
    });
  }
});
