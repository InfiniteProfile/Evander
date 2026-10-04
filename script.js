(function () {
'use strict';

var BASE_TITLE = document.title;
var MAXLEN = 1000, BUF = 3, EXTRA = 6, CAP = 14000, SHIFT = 7000, TEXT_H = 80;

/* ================= PROFILE ENGINE ================= */

var FIRST = 'Adrian Elena Marcus Sofia Julian Amara Lucas Naomi Theo Isabel Rafael Mira Felix Anika Callum Leila Dario Freya Emil Noor Soren Camila Idris Hana Lorenzo Tessa Kian Ingrid Oskar Yara Matteo Zara Gideon Lena Anders Priya Nico Odette Silas Mei Rowan Dalia Viktor Esme Tomas Ayla Jonas Selene Rhys Imani Leon Clara Pablo Wren Arjun Marta Henrik Talia Cyrus Beatrix'.split(' ');
var LAST = 'Vale Ray Okafor Lindqvist Moreau Castellan Haldane Ito Brandt Navarro Kessler Adeyemi Falk Marlowe Sato Rinaldi Whitlock Duarte Novak Ashby Calloway Petrov Quinn Santoro Thorne Varga Weller Yilmaz Ziegler Bellamy Cortez Dunmore Eriksen Fontaine Garrido Hollis Ishikawa Jovanovic Kovac Lacroix Mbeki Nakamura Orsini Pryce Rask Sinclair Tanaka Ulmer Voss Winslow Yuen Abara Baptiste Crowe Delacroix Ellery Farrow Greer Halloran Iyer'.split(' ');
var CITIES = 'Lisbon,Oslo,Kyoto,Lagos,Valparaíso,Edinburgh,Porto,Nairobi,Seoul,Reykjavik,Montréal,Cape Town,Vienna,Hobart,Tbilisi,Rotterdam,Mexico City,Marseille,Bergen,Istanbul,Wellington,Bologna,Buenos Aires,Gdańsk,Vancouver,Accra,Kraków,Sapporo,Seville,Ghent,Cork,Split,Tallinn,Lyon,Dunedin,Cusco'.split(',');
var INTERESTS = 'hiking,chess,jazz,ferry timetables,letterpress,cycling,sourdough,birdwatching,cinema,long walks,film photography,tea,board games,vinyl records,sketching,rock pools,astronomy,gardening,crosswords,swimming,old maps,radio,poetry,trains,stargazing,woodworking,calligraphy,coffee,opera,folk songs,museum visits,botanical drawing,kayaking,bookshops,typefaces,street markets,sailing'.split(',');
var COLLS = 'Field recordings,Postcards,Pressed leaves,Maps,Typefaces,Vinyl records,Tea tins,Film negatives,Pocket notebooks,Stamps,Seed packets,Ceramic tiles,Matchboxes,Bookplates,Ticket stubs'.split(',');
var CAPS = 'Morning light,Rooftops,Quiet street,Studio window,Harbour wall,Hillside,Workbench,Winter fields,Tide pools,Back garden,Station at dusk,Market stalls'.split(',');
var BLURBS = ['A quiet, long-form project shaped by weather, light and patience.','Started as a small experiment and grew into a full body of work.','Documented in notebooks and revisited each season.','Made in collaboration with a small local team.','Shown once, privately, then reworked for a wider audience.','Slow work, done in the margins of other commitments.','An attempt to do less, but more carefully.','Built around a single constraint and a lot of revision.'];
var ROLES = [
'Architect|Hillside house,Library extension,Courtyard pavilion,Timber footbridge,Corner bakery refit',
'Photographer|Harbour at dawn,Night buses,Salt flats series,Market portraits,Winter allotments',
'Cartographer|Tidal atlas,City bike map,Glacier survey,Island chart,Forest trail guide',
'Furniture maker|Oak writing desk,Ash dining table,Walnut shelving,Reading chair,Garden bench',
'Composer|String quartet no. 2,Radio suite,Piano miniatures,Film score sketches,Choral setting',
'Botanist|Meadow survey,Seed bank index,Moss catalogue,Hedgerow study,Alpine transect',
'Typographer|Serif for newsprint,Signage system,Book jacket series,Variable sans,Letterpress broadsides',
'Ceramicist|Tea bowl set,Glaze tests,Tile mural,Salt-fired vases,Studio kiln build',
'Translator|Essay collection,Poetry anthology,Archive letters,Short story cycle,Museum catalogue',
'Chef|Seasonal tasting menu,Fermentation notebook,Bread programme,Market kitchen,Supper club',
'Illustrator|Field guide plates,Children\u2019s alphabet,Editorial series,Map illustrations,Poster set',
'Sound designer|Field recordings,Museum soundscape,Radio drama,Short film mix,Podcast score',
'Urban planner|Riverside masterplan,Cycle network,Street trees plan,Market square,Night bus review',
'Historian|Port city archive,Letters from the coast,Railway oral history,Map collection,Guild records',
'Mountaineer|Alpine traverse,Winter ascents log,Route topos,Hut guide,Glacier notes',
'Engineer|Bridge inspection,Water system model,Wind turbine study,Sensor network,Retrofit manual',
'Pianist|Late Schubert programme,Recital series,Studio album,Teaching method,Duo commissions',
'Writer|Short story collection,Essays on cities,Travel notebook,Novel in progress,Radio talks',
'Horologist|Pocket watch restoration,Escapement study,Clock tower repair,Chronometer log,Workshop manual',
'Sailor|Atlantic crossing,Coastal logbook,Boat restoration,Navigation course,Winter refit',
'Landscape designer|Walled garden,Orchard plan,Roof terrace,Wetland path,Courtyard planting',
'Printmaker|Linocut series,Etching portfolio,Woodblock maps,Artist book,Screenprint edition',
'Ornithologist|Migration counts,Estuary survey,Nest box scheme,Song recordings,Hide guidebook',
'Bookbinder|Rebinding project,Vellum series,Archive boxes,Journal edition,Repair workshop',
'Film editor|Documentary cut,Short film,Festival trailer,Archive reel,Title sequence',
'Glassblower|Blown vessels,Lamp series,Studio commission,Cast glass study,Workshop notes',
'Linguist|Dialect survey,Word atlas,Field transcripts,Phrasebook,Corpus project',
'Astronomer|Variable star log,Dark-sky survey,Lecture series,Telescope build,Eclipse expedition',
'Sculptor|Stone figures,Bronze studies,Public commission,Wood carvings,Maquettes'
].map(function (s) { var a = s.split('|'); return { t: a[0], p: a[1].split(',') }; });

/* ---- ids: decimal strings, never rounded ---- */
function parseId(s) {
  if (typeof s !== 'string') return null;
  s = s.trim().replace(/^#/, '').replace(/[\s,_]/g, '');
  if (!/^\d+$/.test(s) || s.length > MAXLEN) return null;
  s = s.replace(/^0+/, '');
  return s === '' ? null : s;
}
function addSmall(s, n) {
  var d = s.split(''), i = d.length - 1, c = n, v;
  while (c > 0 && i >= 0) { v = +d[i] + c; d[i] = String(v % 10); c = Math.floor(v / 10); i--; }
  return (c > 0 ? String(c) : '') + d.join('');
}

/* ---- seeded random ---- */
function hash(str) {
  var h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762, i, k;
  for (i = 0; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}
function rng(id, salt) {
  var s = hash('evander:1:' + salt + ':' + id), a = s[0], b = s[1], c = s[2], d = s[3];
  function next() {
    var t = (a + b) | 0;
    a = b ^ (b >>> 9); b = (c + (c << 3)) | 0; c = (c << 21 | c >>> 11);
    d = (d + 1) | 0; t = (t + d) | 0; c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  }
  for (var i = 0; i < 12; i++) next();
  return {
    int: function (n) { return Math.floor(next() * n); },
    chance: function (p) { return next() < p; },
    pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
    many: function (arr, n) {
      var pool = arr.slice(), out = [];
      while (out.length < n && pool.length) out.push(pool.splice(Math.floor(next() * pool.length), 1)[0]);
      return out;
    }
  };
}

/* ---- sections: add an entry here and a renderer below to extend ---- */
var Q1 = '\u201C', Q2 = '\u201D';
var SECTIONS = [
  { key: 'about', title: 'About', p: 0.72, build: function (c, r) {
    var R = c.role, T = [
      R + ' in ' + c.city + '. Currently focused on ' + Q1 + c.subjects[0] + Q2 + '.',
      R + ' based in ' + c.city + ', with a long-running interest in ' + c.interests[0] + ' and ' + c.interests[1] + '.',
      'Divides the year between ' + c.city + ' and ' + c.city2 + '. ' + R + ' by trade, ' + c.interests[0] + ' by habit.',
      R + ' from ' + c.city + '. Prefers small commissions, slow schedules and ' + c.interests[2] + '.',
      'Practising as ' + R.toLowerCase() + ' since ' + c.year + ', mostly from ' + c.city + '. Latest piece: ' + Q1 + c.subjects[1] + Q2 + '.'
    ];
    var i = r.int(T.length), out = [T[i]];
    if (r.chance(0.35)) out.push(T[(i + 1 + r.int(T.length - 1)) % T.length]);
    return out.join(' ');
  } },
  { key: 'projects', title: 'Projects', p: 0.55, build: function (c, r) {
    var n = 1 + r.int(4), out = [], i, y;
    for (i = 0; i < n; i++) {
      y = 2006 + r.int(21);
      out.push({ title: c.subjects[i], year: y, status: y >= 2025 ? 'Ongoing' : (y < 2013 ? 'Archived' : 'Completed'), blurb: r.pick(BLURBS) });
    }
    return out.sort(function (a, b) { return b.year - a.year; });
  } },
  { key: 'photos', title: 'Photos', p: 0.5, build: function (c, r) {
    var n = 2 + r.int(7), out = [], i;
    for (i = 0; i < n; i++) out.push({ cap: r.pick(CAPS) + ', ' + (r.chance(0.7) ? c.city : c.city2) });
    return out;
  } },
  { key: 'documents', title: 'Documents', p: 0.4, build: function (c, r) {
    var C = [
      { t: 'Project notes: ' + c.subjects[0], k: 'Notes' }, { t: 'Statement of practice', k: 'Statement' },
      { t: 'Studio notebook', k: 'Notebook' }, { t: 'Reading list', k: 'List' },
      { t: 'Materials and methods', k: 'Notes' }, { t: 'Field notes from ' + c.city, k: 'Notes' }
    ];
    return r.many(C, 1 + r.int(3)).map(function (x) { return { title: x.t, kind: x.k, year: 2008 + r.int(19) }; });
  } },
  { key: 'interests', title: 'Interests', p: 0.45, build: function (c, r) { return c.interests.slice(0, 3 + r.int(4)); } },
  { key: 'collections', title: 'Collections', p: 0.25, build: function (c, r) {
    return r.many(COLLS, 1 + r.int(3)).map(function (n) { return { name: n, count: 12 + r.int(470) }; });
  } },
  { key: 'notes', title: 'Notes', p: 0.2, build: function (c, r) {
    var seasons = ['spring', 'summer', 'autumn', 'winter'];
    var N = [
      'Rewriting the opening of ' + Q1 + c.subjects[0] + Q2 + ' again. Slower is better.',
      'Spent the week on ' + c.interests[0] + '. The rest can wait.',
      'Finish the last details on ' + Q1 + c.subjects[1] + Q2 + ' before ' + r.pick(seasons) + '.',
      'Good conversation in ' + c.city + ' about ' + c.interests[1] + '. Worth following up.',
      'Fewer commitments this year. More time for ' + c.interests[2] + '.',
      'Still thinking about the light in ' + c.city2 + ' in ' + r.pick(seasons) + '.'
    ];
    return r.many(N, 1 + r.int(3));
  } },
  { key: 'timeline', title: 'Timeline', p: 0.3, build: function (c, r) {
    var y = 1995 + r.int(14), out = [];
    var E = ['Started professional practice in ' + c.city, 'Moved to ' + c.city2, 'Completed ' + Q1 + c.subjects[0] + Q2,
      'Presented ' + Q1 + c.subjects[1] + Q2 + ' to a small audience', 'Joined a small collective', 'Opened a studio in ' + c.city,
      'Took a year away from work to travel', 'Began teaching workshops'];
    r.many(E, 3 + r.int(3)).forEach(function (t) { out.push({ year: Math.min(2026, y), text: t }); y += 1 + r.int(5); });
    return out;
  } },
  { key: 'connections', title: 'Connections', p: 0.35, build: function (c, r) {
    var n = 2 + r.int(3), out = [], seen = {}, id;
    while (out.length < n) { id = addSmall(c.id, 1 + r.int(9999)); if (!seen[id]) { seen[id] = 1; out.push(id); } }
    return out;
  } }
];

function uname(f, l, r) {
  f = f.toLowerCase(); l = l.toLowerCase();
  var k = r.int(6);
  return k === 0 ? f + l : k === 1 ? f + '.' + l : k === 2 ? f + '_' + l : k === 3 ? f + l + (10 + r.int(90)) : k === 4 ? f.charAt(0) + l : l + '_' + f + (10 + r.int(90));
}

function generate(id) {
  var r = rng(id, 'core');
  var first = r.pick(FIRST), last = r.pick(LAST);
  var mid = r.chance(0.15) ? String.fromCharCode(65 + r.int(26)) : '';
  var role = r.pick(ROLES), city = r.pick(CITIES), city2 = r.pick(CITIES);
  var c = {
    id: id, role: role.t, city: city, city2: city2,
    interests: r.many(INTERESTS, 6), subjects: r.many(role.p, role.p.length), year: 2000 + r.int(20)
  };
  var p = {
    id: id, name: first + (mid ? ' ' + mid + '.' : '') + ' ' + last, username: uname(first, last, r),
    initials: first.charAt(0) + last.charAt(0), role: role.t, city: city, image: null,
    order: [], sections: {}, ctx: c
  };
  SECTIONS.forEach(function (s) {
    var sr = rng(id, s.key);
    if (!sr.chance(s.p)) return;
    var d = s.build(c, sr);
    if (d) { p.sections[s.key] = d; p.order.push(s.key); }
  });
  if (!p.order.length) { p.sections.about = SECTIONS[0].build(c, rng(id, 'about2')); p.order.push('about'); }
  var tags = [p.role.toLowerCase(), city.toLowerCase()];
  if (p.sections.interests) tags = tags.concat(p.sections.interests.map(function (x) { return x.toLowerCase(); }));
  p.hay = (p.name + ' ' + p.username + ' ' + tags.join(' ')).toLowerCase();
  return p;
}

var cache = new Map();
function makeProfile(id) {
  var p = cache.get(id);
  if (p) return p;
  p = generate(id);
  if (cache.size > 800) cache.clear();
  cache.set(id, p);
  return p;
}

/* ================= IMAGE SYSTEM ================= */

function uri(s) { return 'data:image/svg+xml,' + encodeURIComponent(s); }
function avatar(p) {
  if (p.av) return p.av;
  var r = rng(p.id, 'avatar'), h = 200 + r.int(38), s = 14 + r.int(16), l = 11 + r.int(5), k = r.int(4), g = '', i, cx, cy;
  var c1 = 'hsl(' + h + ',' + s + '%,' + l + '%)', c2 = 'hsl(' + (h + 10) + ',' + (s + 6) + '%,' + (l + 13) + '%)';
  if (k === 0) {
    cx = 30 + r.int(140); cy = 30 + r.int(140);
    for (i = 1; i <= 4; i++) g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (i * 34) + '" fill="none" stroke="#F2F4F7" stroke-opacity=".07" stroke-width="2"/>';
  } else if (k === 1) {
    for (i = 0; i < 7; i++) g += '<path d="M' + (-40 + i * 40) + ' 200L' + (60 + i * 40) + ' 0" stroke="#F2F4F7" stroke-opacity=".06" stroke-width="10"/>';
  } else if (k === 2) {
    g = '<circle cx="' + (r.int(2) ? 170 : 30) + '" cy="' + (r.int(2) ? 30 : 170) + '" r="' + (80 + r.int(40)) + '" fill="#F2F4F7" fill-opacity=".05"/>';
  } else {
    for (i = 0; i < 4; i++) g += '<rect x="0" y="' + (i * 52) + '" width="200" height="26" fill="#F2F4F7" fill-opacity=".035"/>';
  }
  p.av = uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/>' + g + '<text x="100" y="122" text-anchor="middle" font-family="Georgia,serif" font-size="68" fill="#F2F4F7" fill-opacity=".92">' + p.initials + '</text></svg>');
  return p.av;
}
/* a real image URL on p.image is used first; the generated avatar is the fallback */
function setImg(img, p) {
  img.src = p.image || avatar(p);
  if (p.image) img.setAttribute('data-fb', avatar(p));
}
function art(id, i) {
  var r = rng(id, 'art' + i), h = 198 + r.int(40), k, y;
  var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(' + h + ',30%,11%)"/><stop offset="1" stop-color="hsl(' + (h + 8) + ',24%,' + (26 + r.int(8)) + '%)"/></linearGradient></defs><rect width="400" height="300" fill="url(#s)"/>';
  s += '<circle cx="' + (60 + r.int(280)) + '" cy="' + (50 + r.int(60)) + '" r="' + (12 + r.int(14)) + '" fill="#F2F4F7" fill-opacity=".7"/>';
  for (k = 0; k < 3; k++) {
    y = 150 + k * 45 + r.int(25);
    s += '<path d="M0 ' + y + 'C' + (80 + r.int(60)) + ' ' + (y - 30 - r.int(40)) + ' ' + (220 + r.int(80)) + ' ' + (y + r.int(40) - 10) + ' 400 ' + (y - r.int(30)) + 'V300H0Z" fill="hsl(' + (h + k * 4) + ',22%,' + (17 - k * 4) + '%)"/>';
  }
  return uri(s + '</svg>');
}

/* ================= STORAGE (memory is the source of truth) ================= */

function readList(k) {
  try {
    var v = JSON.parse(window.localStorage.getItem(k) || '[]'), seen = {};
    if (!Array.isArray(v)) return [];
    return v.filter(function (x) {
      if (typeof x !== 'string' || !/^[1-9]\d{0,999}$/.test(x) || seen[x]) return false;
      seen[x] = 1; return true;
    }).slice(0, 500);
  } catch (e) { return []; }
}
function writeList(k, a) { try { window.localStorage.setItem(k, JSON.stringify(a)); } catch (e) { /* keep working in memory */ } }
var favs = readList('evander:fav'), recent = readList('evander:recent').slice(0, 60);

/* ================= DOM ================= */

function $(id) { return document.getElementById(id); }
function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
function up(n, attr) { while (n && n !== document) { if (n.hasAttribute && n.hasAttribute(attr)) return n; n = n.parentNode; } return null; }
function getParam(name) {
  try {
    var m = location.search.match(new RegExp('[?&]' + name + '=([^&#]*)'));
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  } catch (e) { return ''; }
}

var intro = $('intro'), app = $('app'), qEl = $('q'), toolbar = $('toolbar'), statusEl = $('status'),
  dir = $('dir'), vlist = $('vlist'), flist = $('flist'), moreWrap = $('more'), moreBtn = $('moreBtn'),
  modal = $('modal'), panel = $('panel'), scroller = $('scroller'), pmBody = $('pm-body'), toastEl = $('toast'), tabSaved = $('tabSaved');

var tt;
function toast(m) { toastEl.textContent = m; toastEl.hidden = false; clearTimeout(tt); tt = setTimeout(function () { toastEl.hidden = true; }, 2800); }
function status(m) { statusEl.textContent = m || ''; }

/* ---- cards ---- */
function makeCard(p) {
  var b = el('button', 'card');
  b.type = 'button'; b.setAttribute('data-id', p.id);
  b.setAttribute('aria-label', p.name + ', @' + p.username + ', ' + p.role);
  var im = el('img', 'card-img'); im.alt = ''; im.loading = 'lazy'; im.decoding = 'async'; setImg(im, p);
  var m = el('span', 'card-meta');
  m.appendChild(el('span', 'card-name', p.name));
  m.appendChild(el('span', 'card-user', '@' + p.username));
  m.appendChild(el('span', 'card-role', p.role));
  b.appendChild(im); b.appendChild(m);
  return b;
}
document.addEventListener('error', function (e) {
  var t = e.target;
  if (t && t.tagName === 'IMG') { var fb = t.getAttribute('data-fb'); if (fb) { t.removeAttribute('data-fb'); t.src = fb; } }
}, true);

/* ================= DIRECTORY: windowed infinite grid ================= */

var V = { base: '1', cols: 0, rowH: 300, rows: 0, top: 0, els: new Map() };
var mode = 'browse', browseY = 0, inited = false, curList = [];

function vtop() { return vlist.getBoundingClientRect().top + window.pageYOffset; }
function setHeight() { vlist.style.height = (V.rows * V.rowH) + 'px'; }
function clearRows() { V.els.forEach(function (e) { if (e.parentNode) e.parentNode.removeChild(e); }); V.els.clear(); }

function measure() {
  var W = dir.clientWidth || 320, gap = W < 600 ? 10 : 16, minW = W < 600 ? 134 : (W < 1000 ? 180 : 200);
  var cols = Math.max(1, Math.floor((W + gap) / (minW + gap)));
  if (W < 560) cols = Math.min(cols, 2);
  cols = Math.min(cols, 7);
  var w = (W - gap * (cols - 1)) / cols, img = Math.round(w * 0.92), card = img + TEXT_H, rowH = card + gap;
  var changed = cols !== V.cols || rowH !== V.rowH;
  V.cols = cols; V.rowH = rowH;
  var st = dir.style;
  st.setProperty('--cols', cols); st.setProperty('--gap', gap + 'px');
  st.setProperty('--img-h', img + 'px'); st.setProperty('--card-h', card + 'px');
  return changed;
}

function makeRow(r) {
  var d = el('div', 'vrow'), c, id;
  d.style.top = (r * V.rowH) + 'px';
  for (c = 0; c < V.cols; c++) {
    id = addSmall(V.base, r * V.cols + c);
    d.appendChild(makeCard(makeProfile(id)));
  }
  return d;
}

function rebase() {
  V.base = addSmall(V.base, SHIFT * V.cols);
  V.rows -= SHIFT;
  clearRows(); setHeight();
  window.scrollTo(0, window.pageYOffset - SHIFT * V.rowH);
}

function update() {
  if (!inited || mode !== 'browse' || !V.cols) return;
  V.top = vtop();
  var y = window.pageYOffset - V.top, vh = window.innerHeight;
  var r0 = Math.max(0, Math.floor(y / V.rowH) - BUF), r1 = Math.ceil((y + vh) / V.rowH) + BUF;
  if (r1 < r0 + BUF) r1 = r0 + BUF;
  if (V.rows > CAP && r0 > SHIFT + BUF) { rebase(); update(); return; }
  if (r1 + EXTRA + 1 > V.rows) { V.rows = r1 + EXTRA + 1; setHeight(); }
  V.els.forEach(function (e, r) { if (r < r0 || r > r1) { vlist.removeChild(e); V.els.delete(r); } });
  var r, k, ref, row;
  for (r = r0; r <= r1; r++) {
    if (V.els.has(r)) continue;
    row = makeRow(r); ref = null;
    for (k = r + 1; k <= r1; k++) { if (V.els.has(k)) { ref = V.els.get(k); break; } }
    vlist.insertBefore(row, ref);
    V.els.set(r, row);
  }
}

function relayout() {
  var oldTop = V.top, y = window.pageYOffset, oldCols = V.cols;
  var anchor = Math.max(0, Math.floor((y - oldTop) / V.rowH)) * oldCols, loaded = V.rows * oldCols;
  if (!measure()) { update(); return; }
  clearRows(); V.rows = Math.ceil(loaded / V.cols); setHeight(); V.top = vtop();
  if (y > oldTop) window.scrollTo(0, V.top + Math.floor(anchor / V.cols) * V.rowH);
  update();
}

var ticking = false, lastY = 0;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(function () {
    ticking = false;
    var y = window.pageYOffset;
    if (window.innerWidth < 700 && y > 140 && y > lastY + 4 && document.activeElement !== qEl) toolbar.classList.add('away');
    else if (y < lastY - 4 || y <= 140) toolbar.classList.remove('away');
    lastY = y;
    update();
  });
}
var rt;
function onResize() {
  clearTimeout(rt);
  rt = setTimeout(function () {
    if (!inited) return;
    if (mode === 'browse') relayout(); else { measure(); renderList(); }
  }, 150);
}
function initDir() {
  if (inited) return;
  inited = true;
  measure(); update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
}

/* ---- list views (search, saved, recent) ---- */
function appendCards(from) { for (var i = from; i < curList.length; i++) flist.appendChild(makeCard(curList[i])); }
function renderList() { flist.textContent = ''; appendCards(0); }

function setMode(m) {
  if (mode === 'browse' && m !== 'browse') browseY = window.pageYOffset;
  var was = mode; mode = m;
  var tabs = document.querySelectorAll('.tab'), i;
  for (i = 0; i < tabs.length; i++) tabs[i].setAttribute('aria-pressed', tabs[i].getAttribute('data-tab') === m ? 'true' : 'false');
  moreWrap.hidden = true;
  if (m === 'browse') {
    flist.hidden = true; vlist.hidden = false; status('');
    if (was !== 'browse') window.scrollTo(0, browseY);
    update();
  } else {
    vlist.hidden = true; flist.hidden = false;
    if (was === 'browse') window.scrollTo(0, 0);
  }
}
function tabLabels() { tabSaved.textContent = 'Saved' + (favs.length ? ' (' + favs.length + ')' : ''); }
function showSaved() {
  S.token++; setMode('saved');
  curList = favs.map(makeProfile); renderList();
  status(curList.length ? '' : 'No saved profiles yet. Open a profile and choose Save.');
}
function showRecent() {
  S.token++; setMode('recent');
  curList = recent.map(makeProfile); renderList();
  status(curList.length ? '' : 'Nothing viewed yet. Profiles you open will appear here.');
}

/* ---- search ---- */
var S = { token: 0, toks: [], next: '1', res: [], scanned: 0, round: 0, roundStart: 0, q: '' };
var WANT = 24, LIMIT = 20000, deb;

function runSearch() {
  var raw = qEl.value.trim();
  S.token++;
  if (!raw) { setMode('browse'); return; }
  setMode('search');
  var id = parseId(raw);
  if (id) {
    curList = [makeProfile(id)]; renderList();
    status('Profile ' + id + '. Press Enter to open it.');
    return;
  }
  var toks = raw.toLowerCase().split(/\s+/).map(function (t) { return t.replace(/^@/, ''); }).filter(Boolean);
  if (!toks.length) { setMode('browse'); return; }
  S.toks = toks; S.q = raw; S.next = '1'; S.scanned = 0; S.res = []; curList = S.res;
  flist.textContent = ''; status('Searching...');
  S.round = 0; S.roundStart = 0;
  scan(S.token);
}
function matches(p) { for (var i = 0; i < S.toks.length; i++) if (p.hay.indexOf(S.toks[i]) === -1) return false; return true; }
function scan(tk) {
  if (tk !== S.token) return;
  var t0 = Date.now(), before = S.res.length, p;
  while (Date.now() - t0 < 12) {
    p = generate(S.next);
    if (matches(p)) S.res.push(p);
    S.next = addSmall(S.next, 1); S.scanned++; S.round++;
  }
  appendCards(before);
  if (S.res.length - S.roundStart >= WANT || S.round >= LIMIT) {
    var n = S.res.length;
    status(n ? n + ' profile' + (n === 1 ? '' : 's') + ' found among the first ' + S.scanned + ' profiles.' : 'No match among the first ' + S.scanned + ' profiles. Keep searching or try another word.');
    moreWrap.hidden = false;
  } else {
    setTimeout(function () { scan(tk); }, 0);
  }
}
moreBtn.addEventListener('click', function () {
  moreWrap.hidden = true; S.round = 0; S.roundStart = S.res.length; status('Searching...'); scan(S.token);
});

qEl.addEventListener('input', function () { clearTimeout(deb); deb = setTimeout(runSearch, 260); });
qEl.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return;
  e.preventDefault(); clearTimeout(deb);
  var id = parseId(qEl.value);
  if (id) openProfile(id, false); else runSearch();
});
toolbar.addEventListener('click', function (e) {
  var t = up(e.target, 'data-tab');
  if (!t) return;
  clearTimeout(deb); qEl.value = '';
  var m = t.getAttribute('data-tab');
  if (m === 'saved') showSaved(); else if (m === 'recent') showRecent(); else { S.token++; setMode('browse'); }
});
dir.addEventListener('click', function (e) {
  var c = up(e.target, 'data-id');
  if (c) { openProfile(c.getAttribute('data-id'), false); }
});

/* ================= PROFILE VIEW ================= */

function section(title, child) {
  var s = el('section', 'sec');
  s.appendChild(el('h3', 'sec-title', title)); s.appendChild(child);
  return s;
}
var RENDER = {
  about: function (d) { return el('p', 'about', d); },
  projects: function (d) {
    var ul = el('ul', 'plain');
    d.forEach(function (x) {
      var li = el('li', 'proj'), h = el('div', 'proj-head');
      h.appendChild(el('span', 'proj-title', x.title));
      h.appendChild(el('span', 'proj-meta', x.year + ', ' + x.status));
      li.appendChild(h); li.appendChild(el('p', 'proj-blurb', x.blurb)); ul.appendChild(li);
    });
    return ul;
  },
  photos: function (d, p) {
    var g = el('div', 'photos');
    d.forEach(function (x, i) {
      var f = el('figure'), im = el('img');
      im.src = art(p.id, i); im.alt = 'Generated image: ' + x.cap; im.loading = 'lazy'; im.width = 400; im.height = 300;
      f.appendChild(im); f.appendChild(el('figcaption', null, x.cap)); g.appendChild(f);
    });
    return g;
  },
  documents: function (d) {
    var w = el('div');
    d.forEach(function (x, i) {
      var b = el('button', 'doc'), t = el('span');
      b.type = 'button'; b.setAttribute('data-doc', i);
      t.appendChild(el('span', 'doc-title', x.title)); t.appendChild(el('span', 'doc-meta', x.kind + ', ' + x.year));
      b.appendChild(t); b.appendChild(el('span', 'doc-act', 'Download')); w.appendChild(b);
    });
    return w;
  },
  interests: function (d) {
    var ul = el('ul', 'chips');
    d.forEach(function (x) {
      var li = el('li'), b = el('button', 'chip', x);
      b.type = 'button'; b.setAttribute('data-q', x); b.setAttribute('aria-label', 'Search profiles for ' + x);
      li.appendChild(b); ul.appendChild(li);
    });
    return ul;
  },
  collections: function (d) {
    var w = el('div');
    d.forEach(function (x) { var r = el('div', 'coll'); r.appendChild(el('span', null, x.name)); r.appendChild(el('span', null, x.count + ' items')); w.appendChild(r); });
    return w;
  },
  notes: function (d) { var w = el('div'); d.forEach(function (x) { w.appendChild(el('p', 'note', x)); }); return w; },
  timeline: function (d) {
    var ol = el('ol', 'timeline');
    d.forEach(function (x) { var li = el('li'); li.appendChild(el('span', 't-year', x.year)); li.appendChild(el('span', null, x.text)); ol.appendChild(li); });
    return ol;
  },
  connections: function (d) {
    var w = el('div');
    d.forEach(function (id) {
      var q = makeProfile(id), b = el('button', 'conn'), im = el('img'), t = el('span', 'conn-txt');
      b.type = 'button'; b.setAttribute('data-id', id);
      im.alt = ''; im.width = 44; im.height = 44; setImg(im, q);
      t.appendChild(el('span', 'conn-name', q.name)); t.appendChild(el('span', 'conn-sub', '@' + q.username + ', ' + q.role));
      b.appendChild(im); b.appendChild(t); w.appendChild(b);
    });
    return w;
  }
};

var cur = null, isOpen = false, pushed = 0, closing = false, ct, hideT, lastFocus = null, savedY = 0, pendingSearch = null;

function saveLabel(b, id) {
  var on = favs.indexOf(id) !== -1;
  b.textContent = on ? 'Saved' : 'Save profile';
  b.setAttribute('aria-pressed', on ? 'true' : 'false');
}
function renderProfile(p) {
  pmBody.textContent = '';
  var head = el('div', 'pm-head'), im = el('img', 'pm-avatar');
  im.alt = 'Avatar for ' + p.name; im.width = 112; im.height = 112; setImg(im, p);
  var h = el('h2', 'pm-name', p.name); h.id = 'pm-name';
  head.appendChild(im); head.appendChild(h);
  head.appendChild(el('p', 'pm-user', '@' + p.username));
  head.appendChild(el('p', 'pm-role', p.role + ' in ' + p.city));
  head.appendChild(el('p', 'pm-pid', 'EVANDER / ' + p.id));
  var act = el('div', 'pm-actions'), sv = el('button', 'btn'), cp = el('button', 'btn', 'Copy link');
  sv.type = 'button'; sv.setAttribute('data-act', 'save'); saveLabel(sv, p.id);
  cp.type = 'button'; cp.setAttribute('data-act', 'copy');
  act.appendChild(sv); act.appendChild(cp); head.appendChild(act);
  pmBody.appendChild(head);
  SECTIONS.forEach(function (s) {
    if (p.sections[s.key] && RENDER[s.key]) pmBody.appendChild(section(s.title, RENDER[s.key](p.sections[s.key], p)));
  });
  pmBody.appendChild(el('p', 'pm-foot', 'Generated from profile ID ' + p.id + '. The same ID always gives the same profile.'));
}

function openProfile(id, fromPop) {
  id = parseId(String(id));
  if (!id) { toast('That profile ID is not valid. Use whole numbers from 1 upwards.'); return; }
  if (isOpen && cur && cur.id === id && !fromPop) return;
  var p = makeProfile(id); cur = p;
  renderProfile(p);
  clearTimeout(hideT);
  if (!isOpen) {
    isOpen = true; lastFocus = document.activeElement; savedY = window.pageYOffset;
    document.documentElement.classList.add('lock');
    modal.hidden = false; void modal.offsetWidth; modal.classList.add('open');
  }
  scroller.scrollTop = 0;
  document.title = p.name + ' (@' + p.username + ') — EVANDER';
  if (!fromPop) {
    pushed++;
    try { history.pushState({ n: pushed }, '', location.pathname + '?profile=' + id); } catch (e) { /* ignore */ }
  }
  recent = [id].concat(recent.filter(function (x) { return x !== id; })).slice(0, 60);
  writeList('evander:recent', recent);
  try { document.getElementById('closeBtn').focus({ preventScroll: true }); } catch (e) { /* ignore */ }
}

function hideModal() {
  if (!isOpen) return;
  isOpen = false; closing = false; pushed = 0;
  modal.classList.remove('open');
  hideT = setTimeout(function () {
    modal.hidden = true;
    document.documentElement.classList.remove('lock');
    window.scrollTo(0, savedY);
    document.title = BASE_TITLE;
    if (mode === 'recent') showRecent();
    if (lastFocus && document.contains(lastFocus)) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    if (pendingSearch) { var s = pendingSearch; pendingSearch = null; qEl.value = s; runSearch(); }
  }, 190);
}
function closeModal() {
  if (!isOpen) return;
  if (pushed > 0) {
    closing = true; clearTimeout(ct);
    ct = setTimeout(function () { if (closing) hideModal(); }, 450);
    try { history.go(-pushed); } catch (e) { hideModal(); }
  } else {
    hideModal();
    try { if (getParam('profile') !== null) history.replaceState(null, '', location.pathname); } catch (e) { /* ignore */ }
  }
}

window.addEventListener('popstate', function (e) {
  var raw = getParam('profile'), id = raw === null ? null : parseId(raw);
  if (closing) {
    clearTimeout(ct); closing = false;
    hideModal();
    if (id) { try { history.replaceState(null, '', location.pathname); } catch (x) { /* ignore */ } }
    return;
  }
  pushed = (e.state && e.state.n) || 0;
  if (id) openProfile(id, true); else if (isOpen) hideModal();
});

/* ---- favorites, links, documents ---- */
function toggleFav(id) {
  var i = favs.indexOf(id);
  if (i >= 0) { favs.splice(i, 1); toast('Removed from saved'); }
  else {
    if (favs.length >= 500) { toast('Saved list is full. Remove a profile first.'); return; }
    favs.unshift(id); toast('Saved');
  }
  writeList('evander:fav', favs); tabLabels();
  if (mode === 'saved') { curList = favs.map(makeProfile); renderList(); status(curList.length ? '' : 'No saved profiles yet. Open a profile and choose Save.'); }
}
function legacyCopy(url) {
  var t = document.createElement('textarea');
  t.value = url; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
  document.body.appendChild(t); t.select();
  var ok = false;
  try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
  document.body.removeChild(t);
  toast(ok ? 'Link copied' : 'Copy this link: ' + url);
}
function copyLink(p) {
  var url = location.href.split('#')[0].split('?')[0] + '?profile=' + p.id;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, function () { legacyCopy(url); });
  } else legacyCopy(url);
}
function docText(p, i) {
  var d = p.sections.documents[i], c = p.ctx, r = rng(p.id, 'doc' + i);
  var S8 = [
    'This document collects working notes from ' + c.city + '.',
    'The central question is how ' + c.interests[0] + ' shapes everyday practice.',
    'Most of the material was written in short sessions, usually early in the morning.',
    'Drafts were revised several times before anything was shared.',
    'It is meant as a working record rather than a finished statement.',
    'Where possible, methods are described in plain language.',
    'Related work includes ' + Q1 + c.subjects[0] + Q2 + '.',
    'Further notes will be added as the work develops.'
  ];
  return d.title + '\n' + p.name + ' (@' + p.username + ')\nEVANDER / ' + p.id + '\n\n' + r.many(S8, 5).join('\n\n') + '\n';
}
function download(p, i) {
  try {
    var d = p.sections.documents[i];
    var url = URL.createObjectURL(new Blob([docText(p, i)], { type: 'text/plain;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url; a.download = d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  } catch (e) { toast('Download is not available in this browser.'); }
}

pmBody.addEventListener('click', function (e) {
  var t;
  if ((t = up(e.target, 'data-act')) && cur) {
    if (t.getAttribute('data-act') === 'save') { toggleFav(cur.id); saveLabel(t, cur.id); } else copyLink(cur);
  } else if ((t = up(e.target, 'data-doc')) && cur) {
    download(cur, +t.getAttribute('data-doc'));
  } else if ((t = up(e.target, 'data-q'))) {
    pendingSearch = t.getAttribute('data-q'); closeModal();
  } else if ((t = up(e.target, 'data-id'))) {
    openProfile(t.getAttribute('data-id'), false);
  }
});
modal.addEventListener('click', function (e) { if (up(e.target, 'data-close')) closeModal(); });
document.addEventListener('keydown', function (e) {
  if (!isOpen) return;
  if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
  if (e.key !== 'Tab') return;
  var f = panel.querySelectorAll('button:not([disabled]),[href],input'), first = f[0], last = f[f.length - 1];
  if (!first) return;
  if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ================= BOOT ================= */

$('enter').addEventListener('click', function () {
  intro.classList.add('leave'); app.hidden = false; initDir();
  setTimeout(function () { intro.hidden = true; }, 380);
});

(function boot() {
  tabLabels();
  var raw = getParam('profile');
  if (raw !== null) {
    var id = parseId(raw);
    intro.hidden = true; app.hidden = false; initDir();
    if (id) {
      try { history.replaceState({ n: 0 }, '', location.pathname + '?profile=' + id); } catch (e) { /* ignore */ }
      openProfile(id, true);
    } else {
      toast('That profile ID is not valid, so the directory is shown instead.');
      try { history.replaceState(null, '', location.pathname); } catch (e) { /* ignore */ }
    }
  } else {
    try { $('enter').focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }
})();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* optional */ }); });
}
})();
