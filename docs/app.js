const PAGES = [
  { id: "README", title: "Overview", group: "Start", icon: "home" },
  { id: "known-issues", title: "Known issues", group: "Track work", icon: "alert" },
  { id: "features-todo", title: "Features to do", group: "Track work", icon: "list" },
  { id: "features-done", title: "Features done", group: "Track work", icon: "check" },
  { id: "dead-code", title: "Dead code", group: "Track work", icon: "trash" },
  { id: "entities", title: "Entities", group: "Reference", icon: "db" },
  { id: "api-endpoints", title: "API endpoints", group: "Reference", icon: "plug" },
  { id: "frontend", title: "Frontend", group: "Reference", icon: "layout" },
  { id: "archive/ToDo", title: "Old plan (archived)", group: "Archive", icon: "archive" },
];

const SEVERITIES = ["Critical", "High", "Medium", "Low"];
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const CARD_PAGES = new Set(["features-todo", "features-done", "dead-code", "entities", "api-endpoints", "frontend"]);
const LAYERS = [
  { key: "BE", label: "Backend", cls: "be" },
  { key: "DB", label: "Database", cls: "db" },
  { key: "FE", label: "Frontend", cls: "fe" },
  { key: "infra", label: "Infra", cls: "infra" },
];

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  list: '<path d="M10 6h11M10 12h11M10 18h11"/><path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  archive: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9M10 13h4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const icon = (name, cls = "icon") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const slugify = (s) => s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
const stripMd = (s) =>
  s.replace(/<[^>]+>/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*>|#]/g, " ")
    .replace(/-{3,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const routeHref = (page, anchor) => `#/${page}${anchor ? `?a=${encodeURIComponent(anchor)}` : ""}`;
const sevBadge = (sev) => `<span class="badge badge-${sev.toLowerCase()}" data-sev="${sev}">${sev}</span>`;
const methodPill = (m) => `<span class="method m-${m.toLowerCase()}">${m}</span>`;

/* ---------- data loading ---------- */

const cache = new Map();

async function loadDoc(id) {
  if (!cache.has(id)) {
    const res = await fetch(`${id}.md`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${id}.md returned HTTP ${res.status}`);
    cache.set(id, await res.text());
  }
  return cache.get(id);
}

let statsPromise = null;

function getStats() {
  statsPromise ||= (async () => {
    const [ki, done, todo, dead] = await Promise.all(
      ["known-issues", "features-done", "features-todo", "dead-code"].map((id) => loadDoc(id).catch(() => ""))
    );
    const sev = Object.fromEntries(SEVERITIES.map((s) => [s, 0]));
    for (const m of ki.matchAll(/^## KI-\d+ .*·\s*\*\*(\w+)\*\*\s*$/gm)) if (m[1] in sev) sev[m[1]]++;
    const count = (s, re) => (s.match(re) || []).length;
    return {
      sev,
      issues: Object.values(sev).reduce((a, b) => a + b, 0),
      done: count(done, /^\s*- \[x\]/gim),
      todo: count(todo, /^\s*- \[ \]/gm),
      dead: count(dead, /^\|.*\|\s*\*\*[^|]*\|\s*$/gm),
    };
  })();
  return statsPromise;
}

/* ---------- routing ---------- */

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [pagePart, anchorPart] = raw.split("?a=");
  const page = decodeURIComponent(pagePart || "");
  return {
    page: PAGES.some((p) => p.id === page) ? page : "README",
    anchor: anchorPart ? decodeURIComponent(anchorPart) : null,
  };
}

let renderedPage = null;

window.addEventListener("hashchange", () => {
  const { page, anchor } = parseRoute();
  if (page === renderedPage) scrollToAnchor(anchor);
  else render();
});

async function render() {
  const { page, anchor } = parseRoute();
  const meta = PAGES.find((p) => p.id === page);
  const content = $("#content");
  updateChrome(meta);
  document.body.classList.remove("sidebar-open");

  if (typeof marked === "undefined") {
    content.innerHTML = errorBox(
      "Markdown library didn't load",
      "<p>The page loads <code>marked</code> from a CDN. Check your internet connection and reload.</p>"
    );
    return;
  }

  let md;
  try {
    md = await loadDoc(page);
  } catch (err) {
    content.innerHTML = loadErrorHtml(page, err);
    $("#toc").innerHTML = "";
    renderedPage = null;
    return;
  }

  content.innerHTML = marked.parse(md);
  content.className = `content page-${slugify(page)}`;
  enhanceCommon(content, page);
  await (ENHANCERS[page] || (() => {}))(content);
  if (CARD_PAGES.has(page)) cardify(content);
  buildToc(content);
  renderedPage = page;
  scrollToAnchor(anchor);
}

function scrollToAnchor(anchor) {
  if (!anchor) {
    window.scrollTo({ top: 0 });
    return;
  }
  const el = document.getElementById(anchor);
  if (!el) return;
  const details = el.matches("details") ? el : el.closest("details");
  if (details) details.open = true;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}

/* ---------- chrome: nav, crumbs, theme ---------- */

function buildNav() {
  const groups = {};
  PAGES.forEach((p) => (groups[p.group] ||= []).push(p));
  $("#nav").innerHTML = Object.entries(groups)
    .map(
      ([group, pages]) => `
      <div class="nav-group">
        <div class="nav-label">${group}</div>
        ${pages
          .map(
            (p) => `<a class="nav-link" data-page="${p.id}" href="${routeHref(p.id)}">
              ${icon(p.icon)}<span>${p.title}</span><span class="nav-count" data-count="${p.id}"></span>
            </a>`
          )
          .join("")}
      </div>`
    )
    .join("");

  getStats().then((s) => {
    const counts = { "known-issues": s.issues, "features-todo": s.todo, "features-done": s.done, "dead-code": s.dead };
    Object.entries(counts).forEach(([id, n]) => $$(`[data-count="${id}"]`).forEach((el) => (el.textContent = n || "")));
  });
}

function updateChrome(meta) {
  $$(".nav-link").forEach((a) => a.classList.toggle("active", a.dataset.page === meta.id));
  $("#crumbs").innerHTML = `
    <span class="crumb-group">${meta.group}</span>
    <span class="crumb-sep">/</span>
    <span class="crumb-title">${meta.title}</span>
    <span class="crumb-source" title="Edit this file to change the page">${icon("file")}docs/${meta.id}.md</span>`;
  document.title = `${meta.title} · Job Tracker Docs`;
}

function setupTheme() {
  const btn = $("#theme-toggle");
  const paint = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    btn.innerHTML = `${icon(dark ? "sun" : "moon")}<span>${dark ? "Light mode" : "Dark mode"}</span>`;
  };
  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("docs-theme", next);
    paint();
  });
  paint();
}

function setupMobileMenu() {
  const btn = $("#menu-toggle");
  btn.innerHTML = icon("menu");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    document.body.classList.toggle("sidebar-open");
  });
  document.addEventListener("click", (e) => {
    if (document.body.classList.contains("sidebar-open") && !e.target.closest("#sidebar")) {
      document.body.classList.remove("sidebar-open");
    }
  });
}

/* ---------- generic enhancements ---------- */

function enhanceCommon(root, page) {
  assignHeadingIds(root);
  rewriteLinks(root, page);

  $$("table", root).forEach((table) => {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    table.replaceWith(wrap);
    wrap.appendChild(table);
  });

  $$("td", root).forEach((td) => {
    const text = td.textContent.trim();
    if (METHODS.includes(text)) td.innerHTML = methodPill(text);
    else if (text === "Public" || text === "Protected") td.innerHTML = `<span class="pill pill-${text.toLowerCase()}">${text}</span>`;
  });

  $$("code", root).forEach((code) => {
    if (code.closest("pre")) return;
    const m = code.textContent.match(/^(GET|POST|PUT|PATCH|DELETE) (\/\S*)$/);
    if (m) code.outerHTML = `<span class="endpoint">${methodPill(m[1])}<code>${escapeHtml(m[2])}</code></span>`;
  });

  $$("li", root).forEach((li) => {
    const box = li.querySelector('input[type="checkbox"]');
    if (!box || box.closest("li") !== li) return;
    li.classList.add("task");
    if (box.checked) li.classList.add("done");
    li.parentElement.classList.add("task-list");
  });

  $$("p", root)
    .filter((p) => !p.textContent.trim() && p.querySelector("a[id]"))
    .forEach((p) => p.remove());
}

function assignHeadingIds(root) {
  const used = new Set();
  $$("h1, h2, h3, h4", root).forEach((h) => {
    const base = slugify(h.textContent) || "section";
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    h.id = id;
  });
}

function rewriteLinks(root, page) {
  $$("a[href]", root).forEach((a) => {
    const href = a.getAttribute("href");
    if (/^[a-z]+:/i.test(href)) {
      a.target = "_blank";
      a.rel = "noopener";
      a.classList.add("external");
      return;
    }
    if (href.startsWith("#")) {
      a.setAttribute("href", routeHref(page, href.slice(1)));
      return;
    }
    const url = new URL(href, `https://docs.local/${page}`);
    const m = url.pathname.match(/^\/(.+)\.md$/);
    if (m) a.setAttribute("href", routeHref(decodeURIComponent(m[1]), url.hash.slice(1) || null));
  });
}

function sectionsBy(root, tag) {
  const sections = [];
  let current = null;
  [...root.children].forEach((node) => {
    if (node.tagName === tag) {
      current = { heading: node, nodes: [] };
      sections.push(current);
    } else if (current) {
      current.nodes.push(node);
    }
  });
  return sections;
}

function cardify(root) {
  $$(":scope > hr", root).forEach((hr) => hr.remove());
  sectionsBy(root, "H2").forEach(({ heading, nodes }) => {
    const card = document.createElement("section");
    card.className = "section-card";
    heading.replaceWith(card);
    card.append(heading, ...nodes);
  });
}

function progressCard(label, done, total) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return `
    <div class="progress-card">
      <div class="progress-head"><span>${label}</span><strong>${done} / ${total} · ${pct}%</strong></div>
      <div class="progress"><div style="width:${pct}%"></div></div>
    </div>`;
}

function insertAfterIntro(root, html) {
  const h1 = $(":scope > h1", root);
  const anchor = h1?.nextElementSibling?.tagName === "P" ? h1.nextElementSibling : h1;
  (anchor || root.firstElementChild)?.insertAdjacentHTML("afterend", html);
}

const plainText = (html) => {
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.textContent.replace(/\s+/g, " ").trim();
};

/* ---------- page-specific enhancements ---------- */

const ENHANCERS = {
  README: enhanceHome,
  "known-issues": enhanceKnownIssues,
  "features-todo": enhanceFeaturesTodo,
  "features-done": enhanceFeaturesDone,
  "dead-code": enhanceDeadCode,
};

async function enhanceHome(root) {
  const wrap = $(".table-wrap", root);
  if (wrap) {
    const cards = $$("tbody tr", wrap)
      .map((tr) => {
        const [fileTd, forTd, whenTd] = tr.children;
        const href = fileTd.querySelector("a")?.getAttribute("href") || "#";
        const id = href.replace(/^#\//, "").split("?")[0];
        const meta = PAGES.find((p) => p.id === id);
        if (!meta) return "";
        const clean = (td) => td.innerHTML.replace(/<\/?a\b[^>]*>/g, "");
        return `
          <a class="doc-card" href="${href}">
            <div class="doc-card-head">
              <span class="doc-icon">${icon(meta.icon)}</span>
              <span class="doc-title">${meta.title}</span>
              <span class="nav-count" data-count="${id}"></span>
            </div>
            <p>${clean(forTd)}</p>
            <div class="doc-when"><span>Update when</span>${clean(whenTd)}</div>
          </a>`;
      })
      .join("");
    wrap.outerHTML = `<h2 class="home-label">Documents</h2><div class="doc-grid">${cards}</div>`;
  }

  const s = await getStats();
  const sevRow = SEVERITIES.filter((k) => s.sev[k])
    .map((k) => `<span class="badge badge-${k.toLowerCase()}">${k}<b>${s.sev[k]}</b></span>`)
    .join("");
  insertAfterIntro(
    root,
    `<div class="stats">
      <a class="stat" href="${routeHref("known-issues")}">
        <div class="stat-label">${icon("alert")}Open issues</div>
        <div class="stat-value">${s.issues}</div>
        <div class="stat-sub sev-row">${sevRow}</div>
      </a>
      <a class="stat" href="${routeHref("features-done")}">
        <div class="stat-label">${icon("check")}Features done</div>
        <div class="stat-value">${s.done}</div>
        <div class="stat-sub">Built and working</div>
      </a>
      <a class="stat" href="${routeHref("features-todo")}">
        <div class="stat-label">${icon("list")}Features to do</div>
        <div class="stat-value">${s.todo}</div>
        <div class="stat-sub">Planned or partial</div>
      </a>
      <a class="stat" href="${routeHref("dead-code")}">
        <div class="stat-label">${icon("trash")}Cleanup items</div>
        <div class="stat-value">${s.dead}</div>
        <div class="stat-sub">Dead code to remove</div>
      </a>
    </div>
    ${progressCard("Overall feature progress", s.done, s.done + s.todo)}`
  );

  $$("[data-count]", root).forEach((el) => {
    const map = { "known-issues": s.issues, "features-todo": s.todo, "features-done": s.done, "dead-code": s.dead };
    el.textContent = map[el.dataset.count] || "";
  });
}

function enhanceKnownIssues(root) {
  $$(":scope > hr", root).forEach((hr) => hr.remove());

  $$("td", root).forEach((td) => {
    const t = td.textContent.trim();
    if (SEVERITIES.includes(t)) td.innerHTML = sevBadge(t);
  });
  $$("li > strong:first-child", root).forEach((strong) => {
    const t = strong.textContent.trim();
    if (SEVERITIES.includes(t)) strong.outerHTML = sevBadge(t);
  });

  const counts = Object.fromEntries(SEVERITIES.map((s) => [s, 0]));
  const cards = [];

  sectionsBy(root, "H2").forEach(({ heading, nodes }) => {
    const m = heading.innerHTML.match(/^(KI-\d+)\s*—\s*([\s\S]*?)\s*·\s*<strong>(\w+)<\/strong>\s*$/);
    if (!m) return;
    const [, id, title, sev] = m;
    counts[sev] = (counts[sev] || 0) + 1;

    const card = document.createElement("details");
    card.className = `issue sev-${sev.toLowerCase()}`;
    card.id = id.toLowerCase();
    card.dataset.severity = sev;
    card.dataset.toc = `${id} · ${plainText(title)}`;
    card.innerHTML = `
      <summary>
        <span class="issue-id">${id}</span>
        <span class="issue-title">${title}</span>
        ${sevBadge(sev)}
        ${icon("chevron", "chevron")}
      </summary>
      <div class="issue-body"></div>`;
    heading.replaceWith(card);
    const body = $(".issue-body", card);
    nodes.forEach((n) => body.appendChild(n));
    $$(":scope > p", body).forEach((p) => {
      const label = p.querySelector(":scope > strong:first-child")?.textContent || "";
      if (/^Fix/.test(label)) p.classList.add("fix");
      if (/^Where/.test(label)) p.classList.add("where");
    });
    cards.push(card);
  });

  const summary = $$(":scope > h2", root).find((h) => h.textContent.trim() === "Summary");
  if (!summary) return;

  const bar = document.createElement("div");
  bar.className = "filter-bar";
  bar.innerHTML =
    [["All", cards.length], ...SEVERITIES.map((s) => [s, counts[s]])]
      .map(
        ([label, n], i) =>
          `<button type="button" class="chip ${i === 0 ? "active" : ""} ${label !== "All" ? `chip-${label.toLowerCase()}` : ""}" data-filter="${label}">${label}<span>${n}</span></button>`
      )
      .join("") +
    `<span class="filter-spacer"></span>
     <button type="button" class="chip chip-ghost" data-action="expand">Expand all</button>
     <button type="button" class="chip chip-ghost" data-action="collapse">Collapse all</button>`;

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.action) {
      cards.forEach((c) => (c.open = btn.dataset.action === "expand"));
      return;
    }
    const f = btn.dataset.filter;
    $$("[data-filter]", bar).forEach((b) => b.classList.toggle("active", b === btn));
    cards.forEach((c) => (c.hidden = f !== "All" && c.dataset.severity !== f));
    $$("tbody tr", root).forEach((tr) => {
      const sev = $(".badge", tr)?.dataset.sev;
      if (sev) tr.hidden = f !== "All" && sev !== f;
    });
  });

  summary.after(bar);
  const firstCard = cards[0];
  if (firstCard) firstCard.insertAdjacentHTML("beforebegin", `<h2 class="home-label" id="all-issues">All issues</h2>`);
}

function enhanceFeaturesTodo(root) {
  $$(":scope > ul > li > strong:first-child", root).forEach((strong) => {
    const t = strong.textContent.trim();
    if (/^P\d$/.test(t)) strong.outerHTML = `<span class="prio prio-${t.toLowerCase()}">${t}</span>`;
  });
  $$(":scope > p > strong", root).forEach((strong) => {
    const layer = LAYERS.find((l) => l.key === strong.textContent.trim());
    if (layer) strong.outerHTML = `<span class="layer layer-${layer.cls}">${layer.label}</span>`;
  });

  $$(":scope > h2", root).forEach((h) => {
    const m = h.textContent.match(/^(P\d)\s*—\s*(.*)$/);
    if (!m) return;
    h.dataset.toc = `${m[1]} · ${m[2]}`;
    h.innerHTML = `<span class="prio prio-${m[1].toLowerCase()}">${m[1]}</span>${escapeHtml(m[2])}`;
  });

  $$("li.task", root).forEach((li) => {
    const sub = $(":scope > ul", li);
    if (!sub) return;
    const items = [...sub.children];
    const layersLi = items.find((x) => /^Layers:/.test(x.textContent.trim()));
    const statusLi = items.find((x) => /^Status:/.test(x.textContent.trim()));

    const layerText = (layersLi?.textContent || "").split(/·\s*Status:/)[0];
    const chips = LAYERS.filter((l) => new RegExp(`\\b${l.key}\\b`).test(layerText))
      .map((l) => `<span class="layer layer-${l.cls}">${l.label}</span>`)
      .join("");

    const statusSource = statusLi?.textContent || (layersLi?.textContent.includes("Status:") ? layersLi.textContent : "");
    let status = "";
    if (statusSource) {
      let s = statusSource.replace(/^[\s\S]*?Status:\s*/, "").split(/\s+—\s+|\.\s|\s+-\s+/)[0].trim().replace(/\.$/, "");
      if (s.length > 28) s = `${s.slice(0, 26)}…`;
      const cls = /partial|scaffold|progress/i.test(s) ? "status-partial" : "status-todo";
      status = `<span class="status ${cls}">${escapeHtml(s)}</span>`;
    }

    const head = $(":scope > p", li) || li;
    const meta = document.createElement("span");
    meta.className = "task-meta";
    meta.innerHTML = chips + status;
    if (head === li) li.insertBefore(meta, sub);
    else head.appendChild(meta);

    const details = document.createElement("details");
    details.className = "task-details";
    details.innerHTML = `<summary>${icon("chevron", "chevron")}Details</summary>`;
    sub.replaceWith(details);
    details.appendChild(sub);
  });

  const total = $$("li.task", root).length;
  const done = $$("li.task.done", root).length;
  insertAfterIntro(root, progressCard("Planned features completed", done, total));
}

function enhanceFeaturesDone(root) {
  $$(":scope > h2", root).forEach((h) => {
    let n = 0;
    for (let el = h.nextElementSibling; el && el.tagName !== "H2"; el = el.nextElementSibling) {
      n += $$("li.task", el).length;
    }
    h.dataset.toc = h.textContent.trim();
    if (n) h.insertAdjacentHTML("beforeend", `<span class="count">${n}</span>`);
  });
  const total = $$("li.task", root).length;
  insertAfterIntro(
    root,
    `<div class="done-banner">${icon("check")}<div><strong>${total} features</strong> built and working across ${$$(":scope > h2", root).length} areas</div></div>`
  );
}

function enhanceDeadCode(root) {
  $$("td > strong:first-child", root).forEach((strong) => {
    const t = strong.textContent.trim();
    const cls = /^Safe to delete/i.test(t)
      ? "action-safe"
      : /^Delete/i.test(t)
        ? "action-delete"
        : /^Decide/i.test(t)
          ? "action-decide"
          : "action-fix";
    strong.classList.add("action", cls);
    strong.textContent = t.replace(/:$/, "");
  });

  $$(".table-wrap", root).forEach((wrap) => {
    const headers = $$("th", wrap).map((th) => th.textContent.trim().toLowerCase());
    const col = (name) => headers.findIndex((h) => h.startsWith(name));
    const [iItem, iLoc, iWhy, iAction] = ["item", "location", "why", "action"].map(col);
    if ([iItem, iWhy, iAction].includes(-1)) return;

    const items = $$("tbody tr", wrap).map((tr) => {
      const cells = [...tr.children];
      const action = cells[iAction];
      const badge = $(".action", action);
      const actionRest = badge ? action.innerHTML.replace(badge.outerHTML, "").trim() : action.innerHTML;
      return `
        <div class="dead-item">
          <div class="dead-head">
            <div class="dead-title">${cells[iItem].innerHTML}</div>
            ${badge ? badge.outerHTML : ""}
          </div>
          ${iLoc !== -1 ? `<div class="dead-loc">${icon("file")}${cells[iLoc].innerHTML}</div>` : ""}
          <div class="dead-why">${cells[iWhy].innerHTML}${actionRest ? ` <span class="dead-note">${actionRest}</span>` : ""}</div>
        </div>`;
    });
    wrap.outerHTML = `<div class="dead-list">${items.join("")}</div>`;
  });
}

/* ---------- table of contents ---------- */

let tocTargets = [];

function buildToc(root) {
  const toc = $("#toc");
  tocTargets = $$("h2, h3, details.issue", root).filter((el) => el.id && !el.closest(".issue-body, .task-details"));
  if (tocTargets.length < 2) {
    toc.innerHTML = "";
    return;
  }
  const page = parseRoute().page;
  toc.innerHTML = `
    <div class="toc-label">On this page</div>
    ${tocTargets
      .map((el) => {
        const label = el.dataset.toc || el.textContent.trim();
        const level = el.tagName === "H3" ? "toc-l3" : "";
        return `<a class="toc-link ${level}" data-target="${el.id}" href="${routeHref(page, el.id)}">${escapeHtml(label)}</a>`;
      })
      .join("")}`;
  updateTocActive();
}

function updateTocActive() {
  let active = tocTargets[0];
  for (const el of tocTargets) {
    if (el.offsetParent === null) continue;
    if (el.getBoundingClientRect().top < 120) active = el;
    else break;
  }
  $$(".toc-link").forEach((a) => a.classList.toggle("active", a.dataset.target === active?.id));
}

let tocTick = false;
window.addEventListener("scroll", () => {
  if (tocTick) return;
  tocTick = true;
  requestAnimationFrame(() => {
    updateTocActive();
    tocTick = false;
  });
});

/* ---------- search ---------- */

let searchIndex = null;

async function getSearchIndex() {
  if (searchIndex) return searchIndex;
  const entries = [];
  await Promise.all(
    PAGES.map(async (p) => {
      let md;
      try {
        md = await loadDoc(p.id);
      } catch {
        return;
      }
      let heading = p.title;
      let anchor = null;
      let buf = [];
      let inFence = false;
      const flush = () => {
        entries.push({ page: p.id, pageTitle: p.title, heading, anchor, text: stripMd(buf.join(" ")) });
        buf = [];
      };
      md.split("\n").forEach((line) => {
        if (/^\s*```/.test(line)) inFence = !inFence;
        const h = !inFence && line.match(/^(#{1,4})\s+(.*)$/);
        if (h) {
          flush();
          const text = stripMd(h[2]);
          const ki = text.match(/^(KI-\d+)/);
          heading = h[1].length === 1 ? p.title : text;
          anchor = h[1].length === 1 ? null : ki ? ki[1].toLowerCase() : slugify(text);
        } else {
          buf.push(line);
        }
      });
      flush();
    })
  );
  searchIndex = entries;
  return entries;
}

function setupSearch() {
  const input = $("#search");
  const box = $("#search-results");
  $("#search-icon").innerHTML = icon("search");
  let results = [];
  let activeIdx = 0;

  const close = () => {
    box.hidden = true;
    results = [];
  };

  const highlight = (text, terms) => {
    let html = escapeHtml(text);
    terms.forEach((t) => {
      const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      html = html.replace(re, "<mark>$1</mark>");
    });
    return html;
  };

  const paint = (terms) => {
    if (!results.length) {
      box.innerHTML = `<div class="search-empty">No results</div>`;
      box.hidden = false;
      return;
    }
    box.innerHTML = results
      .map((r, i) => {
        const lower = r.text.toLowerCase();
        const at = Math.max(0, lower.indexOf(terms[0]) - 50);
        const snippet = (at > 0 ? "…" : "") + r.text.slice(at, at + 140) + (r.text.length > at + 140 ? "…" : "");
        return `<a class="result ${i === activeIdx ? "active" : ""}" href="${routeHref(r.page, r.anchor)}">
          <div class="result-title"><span class="result-page">${r.pageTitle}</span>${highlight(r.heading, terms)}</div>
          ${snippet.trim() ? `<div class="result-snippet">${highlight(snippet, terms)}</div>` : ""}
        </a>`;
      })
      .join("");
    box.hidden = false;
  };

  input.addEventListener("input", async () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) return close();
    const terms = q.split(/\s+/).filter(Boolean);
    const index = await getSearchIndex();
    results = index
      .map((e) => {
        const head = e.heading.toLowerCase();
        const hay = `${head} ${e.text.toLowerCase()}`;
        if (!terms.every((t) => hay.includes(t))) return null;
        const score = terms.reduce((acc, t) => acc + (head.includes(t) ? 10 : 0) + (e.text.toLowerCase().split(t).length - 1), 0);
        return { ...e, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
    activeIdx = 0;
    paint(terms);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      close();
      input.blur();
    } else if ((e.key === "ArrowDown" || e.key === "ArrowUp") && results.length) {
      e.preventDefault();
      activeIdx = (activeIdx + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length;
      $$(".result", box).forEach((el, i) => el.classList.toggle("active", i === activeIdx));
      $$(".result", box)[activeIdx]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && results[activeIdx]) {
      location.hash = routeHref(results[activeIdx].page, results[activeIdx].anchor);
      input.value = "";
      close();
      input.blur();
    }
  });

  box.addEventListener("click", (e) => {
    if (e.target.closest(".result")) {
      input.value = "";
      close();
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search")) close();
  });

  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName);
    if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      document.body.classList.add("sidebar-open");
      input.focus();
      input.select();
    }
  });
}

/* ---------- errors ---------- */

function errorBox(title, body) {
  return `<div class="callout callout-error"><h2>${title}</h2>${body}</div>`;
}

function loadErrorHtml(page, err) {
  if (location.protocol === "file:") {
    return errorBox(
      "Open this page through a local server",
      `<p>Browsers block reading local files when <code>index.html</code> is opened directly, so the docs can't load.</p>
       <p>From the project root, run one of these and open the URL it prints:</p>
       <pre><code>npx serve docs</code></pre>
       <pre><code>python3 -m http.server 8000 --directory docs</code></pre>`
    );
  }
  return errorBox(`Couldn't load ${escapeHtml(page)}.md`, `<p>${escapeHtml(err.message)}</p>`);
}

/* ---------- boot ---------- */

buildNav();
setupTheme();
setupMobileMenu();
setupSearch();
render();
