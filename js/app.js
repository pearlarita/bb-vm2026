// ── DEADLINE ─────────────────────────────────────────────────────────────────
// Tipping stenger 11. juni 2026 kl. 21:00 norsk tid (UTC+2)
const DEADLINE = new Date("2026-06-11T19:00:00Z"); // 21:00 Oslo = 19:00 UTC

function isTippingOpen() {
  return new Date() < DEADLINE;
}

function deadlineText() {
  return "Tipping er stengt — fristen var 11. juni kl. 21:00.";
}

// ── STATE ─────────────────────────────────────────────────────────────────────
let state = {
  name: "",
  bracket: emptyBracket(),
  results: emptyBracket(),
  entries: {},
  activeRound: "all",
  schedRound: "group",
  adminMode: false,
  adminRound: "all",
  resultsUpdatedAt: null,
  fasitRound: "all",
};

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  setupTabs();
  setupNameGate();
  setupAdminGate();
  renderRoundPills("round-pills", r => { state.activeRound = r; renderBracket(); });
  renderRoundPills("admin-round-pills", r => { state.adminRound = r; renderAdminBracket(); }, ADMIN_ROUND_OPTS);
  renderRoundPills("fasit-round-pills", r => { state.fasitRound = r; renderFasit(); }, ADMIN_ROUND_OPTS);
  renderSchedPills();
  renderSchedule("all");

  // Sidebar sticky top
  const header = document.querySelector(".site-header");
  const sidebar = document.getElementById("groups-sidebar");
  if (header && sidebar) {
    const update = () => {
      const h = header.getBoundingClientRect().height;
      sidebar.style.top = (h + 12) + "px";
      sidebar.style.maxHeight = "calc(100vh - " + (h + 24) + "px)";
    };
    update();
    window.addEventListener("resize", update);
  }

  try {
    const [entriesRes, resultsRes] = await Promise.all([api.getEntries(), api.getResults()]);
    if (entriesRes.ok) state.entries = entriesRes.entries || {};
    if (resultsRes.ok && resultsRes.results) state.results = resultsRes.results;
  } catch (e) {
    showToast("⚠️ Kunne ikke koble til backend — sjekk API_URL i js/api.js");
  }
  // Render ranking and fasit immediately
  renderRanking();
  renderFasit();
});

// ── TABS ──────────────────────────────────────────────────────────────────────
function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.add("hidden"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.remove("hidden");
      // Sidebar only visible in tip tab when logged in
      updateSidebarVisibility();
      if (btn.dataset.tab === "ranking") {
        api.getEntries().then(res => {
          if (res.ok) state.entries = res.entries || {};
          renderRanking();
        }).catch(() => renderRanking());
      }
      if (btn.dataset.tab === "fasit") {
        renderFasit(); // renderFasit fetches fresh data internally
      }
    });
  });
}

function updateSidebarVisibility() {
  const sidebar = document.getElementById("groups-sidebar");
  if (!sidebar) return;
  const tipActive = document.getElementById("tab-tip") && !document.getElementById("tab-tip").classList.contains("hidden");
  const loggedIn = !!state.name;
  sidebar.style.display = (tipActive && loggedIn) ? "" : "none";
}

// ── NAME GATE ─────────────────────────────────────────────────────────────────
function setupNameGate() {
  const input = document.getElementById("name-input");
  const btn   = document.getElementById("btn-start");
  const switchBtn = document.getElementById("btn-switch-user");

  btn.addEventListener("click", submitName);
  input.addEventListener("keydown", e => { if (e.key === "Enter") submitName(); });
  switchBtn.addEventListener("click", () => {
    state.name = "";
    state.bracket = emptyBracket();
    document.getElementById("name-gate").classList.remove("hidden");
    document.getElementById("bracket-area").classList.add("hidden");
    document.getElementById("user-pill").classList.add("hidden");
    input.value = "";
    updateSidebarVisibility();
  });

  document.getElementById("btn-save").addEventListener("click", saveBracket);
}

function submitName() {
  const n = document.getElementById("name-input").value.trim();
  if (!n) return;
  state.name = n;
  // Check deadline — show bracket read-only
  if (!isTippingOpen()) {
    document.getElementById("name-gate").classList.add("hidden");
    document.getElementById("bracket-area").classList.remove("hidden");
    document.getElementById("bracket-title").textContent = `Din vinneroppstilling, ${n} 🔒`;
    document.getElementById("user-name-display").textContent = n;
    document.getElementById("user-pill").classList.remove("hidden");
    document.getElementById("btn-save").style.display = "none";
    document.getElementById("round-pills").style.display = "flex";
    updateSidebarVisibility();
    // Load saved bracket if exists, then render read-only
    if (state.entries[n]) {
      const saved = JSON.parse(JSON.stringify(state.entries[n]));
      const empty = emptyBracket();
      state.bracket = {
        ...empty, ...saved,
        groups: Object.keys(GROUPS).reduce((acc, g) => {
          acc[g] = (saved.groups && saved.groups[g]) ? saved.groups[g] : [null,null,null,null];
          return acc;
        }, {}),
      };
    }
    // Render read-only
    renderBracketTo("bracket-sections", state.bracket, true, state.activeRound, () => {});
    // Show deadline notice
    const notice = document.createElement("div");
    notice.className = "deadline-msg";
    notice.textContent = deadlineText();
    document.getElementById("bracket-sections").prepend(notice);
    return;
  }
  if (state.entries[n]) {
    const saved = JSON.parse(JSON.stringify(state.entries[n]));
    const empty = emptyBracket();
    // Deep merge: copy all top-level keys from saved
    state.bracket = {
      ...empty,
      ...saved,
      // Deep merge groups: keep saved group rankings, fill missing groups with empty
      groups: Object.keys(GROUPS).reduce((acc, g) => {
        acc[g] = (saved.groups && saved.groups[g]) ? saved.groups[g] : [null,null,null,null];
        return acc;
      }, {}),
    };
  }

  document.getElementById("name-gate").classList.add("hidden");
  document.getElementById("bracket-area").classList.remove("hidden");
  document.getElementById("bracket-title").textContent = `Din vinneroppstilling, ${n} 🎯`;
  document.getElementById("user-name-display").textContent = n;
  document.getElementById("user-pill").classList.remove("hidden");
  updateSidebarVisibility();
  renderGroupsSidebar();
  renderBracket();
}

async function saveBracket() {
  if (!state.name) return;
  if (!isTippingOpen() && !state.adminMode) { showToast("⏰ " + deadlineText()); return; }
  const btn = document.getElementById("btn-save");
  btn.textContent = "Lagrer..."; btn.disabled = true;
  try {
    await api.saveEntry(state.name, state.bracket);
    state.entries[state.name] = JSON.parse(JSON.stringify(state.bracket));
    btn.textContent = "✅ Sendt inn!";
    btn.classList.add("saved");
    setTimeout(() => { btn.textContent = "📮 Send inn"; btn.classList.remove("saved"); btn.disabled = false; }, 2500);
  } catch (e) {
    showToast("❌ Lagring feilet — sjekk API-tilkobling");
    btn.textContent = "📮 Send inn"; btn.disabled = false;
  }
}

// ── ADMIN GATE ────────────────────────────────────────────────────────────────
const ADMIN_PASS = "vm2026";
function setupAdminGate() {
  const tryAdminLogin = () => {
    if (document.getElementById("admin-pass-input").value === ADMIN_PASS) {
      state.adminMode = true;
      document.getElementById("admin-gate").classList.add("hidden");
      document.getElementById("admin-area").classList.remove("hidden");
      renderAdminBracket();
    } else {
      showToast("❌ Feil passord");
    }
  };
  document.getElementById("btn-admin-login").addEventListener("click", tryAdminLogin);
  document.getElementById("admin-pass-input").addEventListener("keydown", e => { if (e.key === "Enter") tryAdminLogin(); });
  document.getElementById("btn-save-results").addEventListener("click", async () => {
    const btn = document.getElementById("btn-save-results");
    btn.textContent = "Lagrer..."; btn.disabled = true;
    try {
      await api.saveResults(state.results);
      showToast("✅ Fasit lagret!");
    } catch (e) { showToast("❌ Lagring feilet"); }
    btn.textContent = "💾 Lagre fasit"; btn.disabled = false;
  });
}

// ── ROUND PILLS ───────────────────────────────────────────────────────────────
const ROUND_OPTS = [
  {id:"all",    label:"Alle runder"},
  {id:"r32",    label:"16-delsfinale"},
  {id:"r16",    label:"8-delsfinale"},
  {id:"qf",     label:"Kvartfinale"},
  {id:"sf",     label:"Semifinale"},
  {id:"bronze", label:"Bronsefinale"},
  {id:"f",      label:"🏆 Finale"},
];

const ADMIN_ROUND_OPTS = [
  {id:"all",    label:"Alle runder"},
  {id:"groups", label:"Grupper"},
  {id:"r32",    label:"16-delsfinale"},
  {id:"r16",    label:"8-delsfinale"},
  {id:"qf",     label:"Kvartfinale"},
  {id:"sf",     label:"Semifinale"},
  {id:"bronze", label:"Bronsefinale"},
  {id:"f",      label:"🏆 Finale"},
];

function renderRoundPills(containerId, onChange, opts) {
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  (opts || ROUND_OPTS).forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "pill" + (opt.id === "all" ? " active" : "");
    btn.textContent = opt.label;
    btn.addEventListener("click", () => {
      el.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      onChange(opt.id);
    });
    el.appendChild(btn);
  });
}

// ── GROUPS SIDEBAR ────────────────────────────────────────────────────────────
// Renders drag-to-rank group standings in the sticky sidebar.
// Only visible in Tipp tab after login.
function renderGroupsSidebar() {
  const container = document.getElementById("groups-list");
  if (!container) return;
  container.innerHTML = "";

  Object.entries(GROUPS).forEach(([letter, teams]) => {
    const ranked = (state.bracket.groups && state.bracket.groups[letter]) || [null,null,null,null];

    const groupDiv = document.createElement("div");
    groupDiv.className = "sb-group";

    // Header
    const hdr = document.createElement("div");
    hdr.className = "sb-group-header";
    hdr.innerHTML = `<span class="group-letter">${letter}</span> Gruppe ${letter}`;
    groupDiv.appendChild(hdr);

    // Rank slots (1–4)
    const slotsDiv = document.createElement("div");
    slotsDiv.className = "sb-rank-slots";

    for (let rank = 1; rank <= 4; rank++) {
      const slot = document.createElement("div");
      slot.className = "sb-rank-slot";
      slot.dataset.group = letter;
      slot.dataset.rank = rank;

      const rankLabel = document.createElement("span");
      rankLabel.className = "sb-rank-num";
      rankLabel.textContent = rank;
      slot.appendChild(rankLabel);

      // Flag display — updates when a team is selected
      const flagEl = document.createElement("span");
      flagEl.className = "sb-flag";
      const currentTeam = ranked[rank-1];
      if (currentTeam) flagEl.innerHTML = flagHtml(currentTeam);
      slot.appendChild(flagEl);

      const select = document.createElement("select");
      select.className = "sb-rank-select" + (currentTeam ? " has-value" : "");
      select.dataset.group = letter;
      select.dataset.rank = rank;

      // Build options: empty + all teams in group
      const emptyOpt = document.createElement("option");
      emptyOpt.value = "";
      emptyOpt.textContent = "— Velg —";
      select.appendChild(emptyOpt);

      teams.forEach(team => {
        const opt = document.createElement("option");
        opt.value = team;
        opt.textContent = team;
        if (ranked[rank-1] === team) opt.selected = true;
        select.appendChild(opt);
      });

      select.addEventListener("change", () => {
        const g = select.dataset.group;
        const r = parseInt(select.dataset.rank) - 1;
        const newVal = select.value || null;

        // Prevent duplicate in same group
        const current = [...(state.bracket.groups[g] || [null,null,null,null])];
        // Clear any other slot that has this value
        if (newVal) {
          current.forEach((v, i) => { if (v === newVal && i !== r) current[i] = null; });
        }
        current[r] = newVal;
        state.bracket.groups[g] = current;

        // Clear downstream r32 picks that are now invalid
        clearGroupDownstream(g);
        renderGroupsSidebar();
        renderBracket();
      });

      slot.appendChild(select);
      slotsDiv.appendChild(slot);
    }

    groupDiv.appendChild(slotsDiv);
    container.appendChild(groupDiv);
  });
}

// Clear r32 (and further) picks that depend on a changed group
function clearGroupDownstream(groupLetter) {
  R32.forEach((m, i) => {
    const involvedGroups = [];
    if (m.gA) involvedGroups.push(m.gA.g);
    if (m.gB) involvedGroups.push(m.gB.g);
    else if (m.best3Groups) involvedGroups.push(...m.best3Groups); // only the specific best3 groups
    if (involvedGroups.includes(groupLetter)) {
      const pool = getR32Pool(i, state.bracket);
      if (state.bracket.r32[i] && !pool.includes(state.bracket.r32[i])) {
        state.bracket.r32[i] = "";
        clearDownstream(state.bracket, "r32", i);
      }
    }
  });
}

// ── BRACKET RENDERING ─────────────────────────────────────────────────────────
function renderBracket() {
  renderBracketTo("bracket-sections", state.bracket, false, state.activeRound,
    (key, idx, val) => {
      if (key === "groups") {
        state.bracket.groups[idx] = val; // idx = group letter, val = ranked array
        clearGroupDownstream(idx);
        renderGroupsSidebar(); // keep sidebar in sync
      } else if (key === "bronze" || key === "f") {
        state.bracket[key] = val;
      } else {
        state.bracket[key][idx] = val;
        clearDownstream(state.bracket, key, idx);
      }
      renderBracket();
    }
  );
}

function renderAdminBracket() {
  renderBracketTo("admin-sections", state.results, false, state.adminRound,
    (key, idx, val) => {
      if (key === "groups") {
        if (!state.results.groups) state.results.groups = {};
        state.results.groups[idx] = val;
      } else if (key === "bronze" || key === "f") {
        state.results[key] = val;
      } else {
        state.results[key][idx] = val;
        clearDownstream(state.results, key, idx);
      }
      renderAdminBracket();
    },
    true  // showGroups
  );
}

function clearDownstream(bracket, changedKey, changedIdx) {
  if (changedKey === "r32") {
    R16.forEach((m, i) => {
      if (m.from.includes(changedIdx)) {
        const pool = [bracket.r32[m.from[0]], bracket.r32[m.from[1]]].filter(Boolean);
        if (bracket.r16[i] && !pool.includes(bracket.r16[i])) { bracket.r16[i] = ""; clearDownstream(bracket,"r16",i); }
      }
    });
  }
  if (changedKey === "r16") {
    QF.forEach((m, i) => {
      if (m.from.includes(changedIdx)) {
        const pool = [bracket.r16[m.from[0]], bracket.r16[m.from[1]]].filter(Boolean);
        if (bracket.qf[i] && !pool.includes(bracket.qf[i])) { bracket.qf[i] = ""; clearDownstream(bracket,"qf",i); }
      }
    });
  }
  if (changedKey === "qf") {
    SF.forEach((m, i) => {
      if (m.from.includes(changedIdx)) {
        const pool = [bracket.qf[m.from[0]], bracket.qf[m.from[1]]].filter(Boolean);
        if (bracket.sf[i] && !pool.includes(bracket.sf[i])) { bracket.sf[i] = ""; clearDownstream(bracket,"sf",i); }
      }
    });
  }
  if (changedKey === "sf") {
    // Final pool = SF winners
    const fPool = [...bracket.sf].filter(Boolean);
    if (bracket.f && !fPool.includes(bracket.f)) bracket.f = "";
    // Bronze pool = SF losers — recalculate and clear if invalid
    const bronzePool = [];
    SF.forEach((m, i) => {
      const sfWinner = bracket.sf[i];
      const c0 = bracket.qf[m.from[0]];
      const c1 = bracket.qf[m.from[1]];
      if (sfWinner && c0 && c0 !== sfWinner) bronzePool.push(c0);
      if (sfWinner && c1 && c1 !== sfWinner) bronzePool.push(c1);
      if (!sfWinner) { if (c0) bronzePool.push(c0); if (c1) bronzePool.push(c1); }
    });
    if (bracket.bronze && !bronzePool.includes(bracket.bronze)) bracket.bronze = "";
  }
}

function renderBracketTo(containerId, bracket, readOnly, activeRound, onChange, showGroups=false) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const show = k => activeRound === "all" || activeRound === k;

  if (showGroups && show("groups")) {
    container.appendChild(makeGroupRankingSection(bracket, readOnly, onChange));
  }

  // Admin/fasit: no pool restriction — allow all teams
  const allTeams = Object.keys(FLAGS);
  const poolFn = showGroups
    ? () => allTeams
    : null;

  if (show("r32")) {
    container.appendChild(makeRoundSection("16-delsfinaler", "28. jun – 4. jul", 3,
      R32, bracket.r32, readOnly, false,
      (i,v) => onChange("r32",i,v),
      showGroups ? poolFn : i => getR32Pool(i, bracket)
    ));
  }
  if (show("r16")) {
    container.appendChild(makeRoundSection("8-delsfinaler", "4. jul – 7. jul", 5,
      R16, bracket.r16, readOnly, false,
      (i,v) => onChange("r16",i,v),
      showGroups ? poolFn : i => { const m=R16[i]; return [bracket.r32[m.from[0]],bracket.r32[m.from[1]]].filter(Boolean); }
    ));
  }
  if (show("qf")) {
    container.appendChild(makeRoundSection("Kvartfinaler", "9. jul – 12. jul", 10,
      QF, bracket.qf, readOnly, false,
      (i,v) => onChange("qf",i,v),
      showGroups ? poolFn : i => { const m=QF[i]; return [bracket.r16[m.from[0]],bracket.r16[m.from[1]]].filter(Boolean); }
    ));
  }
  if (show("sf")) {
    container.appendChild(makeRoundSection("Semifinaler", "14. – 15. jul", 15,
      SF, bracket.sf, readOnly, false,
      (i,v) => onChange("sf",i,v),
      showGroups ? poolFn : i => { const m=SF[i]; return [bracket.qf[m.from[0]],bracket.qf[m.from[1]]].filter(Boolean); }
    ));
  }
  if (show("bronze")) {
    let bronzePool;
    if (showGroups) {
      bronzePool = allTeams;
    } else {
      bronzePool = [];
      SF.forEach((m, i) => {
        const sfWinner = bracket.sf[i];
        const c0 = bracket.qf[m.from[0]];
        const c1 = bracket.qf[m.from[1]];
        if (sfWinner) {
          if (c0 && c0 !== sfWinner) bronzePool.push(c0);
          if (c1 && c1 !== sfWinner) bronzePool.push(c1);
        } else {
          if (c0) bronzePool.push(c0);
          if (c1) bronzePool.push(c1);
        }
      });
      bronzePool = [...new Set(bronzePool)];
    }
    container.appendChild(makeSingleMatchSection("Bronsefinale","18. jul",20,false,
      BRONZE_MATCH, bracket.bronze, readOnly,
      v => onChange("bronze",0,v),
      bronzePool
    ));
  }
  if (show("f")) {
    container.appendChild(makeFinalSection(bracket, readOnly, onChange, showGroups ? allTeams : null));
  }
}

// ── ROUND SECTION BUILDER ─────────────────────────────────────────────────────
function makeRoundSection(title, dateRange, pts, matches, values, readOnly, isGold, onChangeFn, getPoolFn) {
  const section = document.createElement("div");
  section.className = "round-section";

  const header = document.createElement("div");
  header.className = "round-header" + (isGold ? " gold" : "");
  header.innerHTML = `
    <div>
      <div class="round-title${isGold?" gold":""}">${title}</div>
      <div class="round-date">${dateRange}</div>
    </div>
    <span class="pts-label${isGold?" gold":""}">${pts ? `+${pts} pts/kamp` : "Ikke poeng"}</span>
  `;
  section.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "match-grid";
  matches.forEach((m, i) => {
    const pool = getPoolFn ? getPoolFn(i) : Object.keys(FLAGS);
    grid.appendChild(makeMatchCard(
      `${title} ${matches.length > 1 ? i+1 : ""}`,
      m, (values&&values[i])||"", readOnly, isGold, pts,
      v => onChangeFn(i,v), pool
    ));
  });
  section.appendChild(grid);
  return section;
}

function makeSingleMatchSection(title, dateStr, pts, isGold, matchInfo, value, readOnly, onChange, pool) {
  const section = document.createElement("div");
  section.className = "round-section";
  const header = document.createElement("div");
  header.className = "round-header";
  header.innerHTML = `
    <div><div class="round-title">${title}</div><div class="round-date">${dateStr}</div></div>
    <span class="pts-label">${pts ? `+${pts} pts` : "Ikke poeng"}</span>
  `;
  section.appendChild(header);
  const grid = document.createElement("div");
  grid.className = "match-grid";
  grid.style.maxWidth = "200px";
  grid.appendChild(makeMatchCard(title, matchInfo, value, readOnly, false, pts, onChange, pool));
  section.appendChild(grid);
  return section;
}

function makeFinalSection(bracket, readOnly, onChange, poolOverride) {
  const section = document.createElement("div");
  section.className = "round-section";
  const header = document.createElement("div");
  header.className = "round-header gold";
  header.innerHTML = `
    <div>
      <div class="round-title gold">🏆 Finale</div>
      <div class="round-date">19. jul · New York · 📺 NRK</div>
    </div>
    <span class="pts-label gold">+20 pts</span>
  `;
  section.appendChild(header);
  const grid = document.createElement("div");
  grid.className = "match-grid";
  grid.style.maxWidth = "200px";
  grid.appendChild(makeMatchCard("Finale", FINAL_MATCH, bracket.f, readOnly, true, 20,
    v => onChange("f",0,v), [...bracket.sf].filter(Boolean)
  ));
  section.appendChild(grid);
  return section;
}

// ── MATCH CARD BUILDER ────────────────────────────────────────────────────────
function makeMatchCard(roundLabel, matchInfo, value, readOnly, isGold, pts, onChange, pool) {
  const card = document.createElement("div");
  card.className = "match-card" + (isGold?" gold":"") + (value?" has-value":"");
  const chClass = matchInfo.ch==="NRK"?"nrk":matchInfo.ch==="TV 2"?"tv2":"";

  // Build teams display: group matches use home/away, knockout uses label
  const teamsHtml = matchInfo.home
    ? `${flagHtml(matchInfo.home)} ${matchInfo.home} <span style="color:var(--green3)">vs</span> ${flagHtml(matchInfo.away)} ${matchInfo.away}`
    : matchInfo.label || "";

  card.innerHTML = `
    <div class="card-top">
      <div>
        <div class="card-round${isGold?" gold":""}">${roundLabel}</div>
        <div class="card-date">${matchInfo.date} · ${matchInfo.time}</div>
      </div>
      <div class="card-badges">
        ${chClass?`<span class="badge-ch ${chClass}">${matchInfo.ch}</span>`:""}
        ${pts?`<span class="badge-pts${isGold?" gold":""}">+${pts}p</span>`:""}
      </div>
    </div>
    <div class="card-teams">${teamsHtml}</div>
    <div class="card-venue">${matchInfo.venue}</div>
  `;
  const pw = document.createElement("div");
  pw.appendChild(readOnly ? makeReadonlyValue(value) : makeTeamSelect(value, pool, onChange));
  card.appendChild(pw);
  return card;
}

// ── TEAM SELECT ───────────────────────────────────────────────────────────────
function makeTeamSelect(value, pool, onChange) {
  const wrapper = document.createElement("div");
  wrapper.className = "team-select-wrapper";
  const noOpts = pool && pool.length === 0;
  const list   = (pool && pool.length > 0) ? pool : Object.keys(FLAGS);

  const btn = document.createElement("button");
  btn.className = "team-select-btn" + (value?" has-value":"") + (noOpts?" disabled":"");
  btn.innerHTML = `
    <span class="label">${value ? `${flagHtml(value)} ${value}` : noOpts ? "Velg forrige runde først" : "Velg vinner"}</span>
    ${!noOpts?`<span class="arrow">▼</span>`:""}
  `;

  const dropdown = document.createElement("div");
  dropdown.className = "team-dropdown";

  const noneItem = document.createElement("div");
  noneItem.className = "dropdown-item none-item";
  noneItem.textContent = "— Ingen —";
  noneItem.addEventListener("click", e => { e.stopPropagation(); onChange(""); dropdown.classList.remove("open"); });
  dropdown.appendChild(noneItem);

  list.forEach(team => {
    const item = document.createElement("div");
    item.className = "dropdown-item" + (team===value?" selected":"");
    item.innerHTML = `${flagHtml(team)} ${team}`;
    item.addEventListener("click", e => { e.stopPropagation(); onChange(team); dropdown.classList.remove("open"); });
    dropdown.appendChild(item);
  });

  if (!noOpts) {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      document.querySelectorAll(".team-dropdown.open").forEach(d => { if(d!==dropdown) d.classList.remove("open"); });
      dropdown.classList.toggle("open");
    });
  }
  wrapper.appendChild(btn);
  wrapper.appendChild(dropdown);
  return wrapper;
}

document.addEventListener("click", () => {
  document.querySelectorAll(".team-dropdown.open").forEach(d => d.classList.remove("open"));
});

function makeReadonlyValue(value) {
  const div = document.createElement("div");
  div.className = "readonly-value" + (value?" has-value":"");
  div.innerHTML = value ? `<span>${flagHtml(value)}</span>${value}` : "–";
  return div;
}

// ── SCHEDULE ──────────────────────────────────────────────────────────────────
// Build "alle kamper" list with date/time sorting
function allMatches() {
  // Add a round label to each match for display
  const label = (arr, rnd) => arr.map(m => ({...m, roundLabel: rnd}));
  return [
    ...label(GROUP_MATCHES, null),
    ...label(R32,           "16-delsfinale"),
    ...label(R16,           "8-delsfinale"),
    ...label(QF,            "Kvartfinale"),
    ...label(SF,            "Semifinale"),
    ...label([BRONZE_MATCH],"Bronsefinale"),
    ...label([FINAL_MATCH], "Finale"),
  ];
}

const SCHED_SECTIONS = [
  {id:"all",    label:"Alle kamper",   matches:() => allMatches()},
  {id:"group",  label:"Gruppespill",   matches:() => GROUP_MATCHES},
  {id:"r32",    label:"16-delsfinale", matches:() => R32},
  {id:"r16",    label:"8-delsfinale",  matches:() => R16},
  {id:"qf",     label:"Kvartfinale",   matches:() => QF},
  {id:"sf",     label:"Semifinale",    matches:() => SF},
  {id:"bronze", label:"Bronsefinale",  matches:() => [BRONZE_MATCH]},
  {id:"final",  label:"Finale",        matches:() => [FINAL_MATCH]},
];

function renderSchedPills() {
  const el = document.getElementById("sched-pills");
  SCHED_SECTIONS.forEach(s => {
    const btn = document.createElement("button");
    btn.className = "pill" + (s.id==="all"?" active":"");
    btn.textContent = s.label;
    btn.addEventListener("click", () => {
      el.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderSchedule(s.id);
    });
    el.appendChild(btn);
  });
}

function renderSchedule(roundId) {
  const container = document.getElementById("sched-content");
  container.innerHTML = "";
  const section = SCHED_SECTIONS.find(s => s.id === roundId);
  if (!section) return;
  const matches = section.matches();
  const byDate = {};
  matches.forEach(m => { if(!byDate[m.date]) byDate[m.date]=[]; byDate[m.date].push(m); });

  // Sort dates chronologically (parse "11. jun" style dates)
  const monthOrder = {"jan":1,"feb":2,"mar":3,"apr":4,"mai":5,"jun":6,
                      "jul":7,"aug":8,"sep":9,"okt":10,"nov":11,"des":12};
  const parseSortKey = d => {
    const [day, mon] = d.split(". ");
    return (monthOrder[mon]||0) * 100 + parseInt(day);
  };
  const sortedDates = Object.keys(byDate).sort((a,b) => parseSortKey(a) - parseSortKey(b));

  sortedDates.forEach(date => {
    // Sort matches within each date by time
    const ms = byDate[date].sort((a, b) => {
      const [ah, am] = a.time.split(":").map(Number);
      const [bh, bm] = b.time.split(":").map(Number);
      return (ah * 60 + am) - (bh * 60 + bm);
    });
    const group = document.createElement("div");
    group.className = "sched-group";
    group.innerHTML = `<div class="sched-date-header">${date}</div>`;
    ms.forEach(m => {
      const chClass = m.ch==="NRK"?"nrk":m.ch==="TV 2"?"tv2":"";
      const teamsHtml = m.home
        ? `${flagHtml(m.home)} ${m.home} <span class="sched-vs">vs</span> ${flagHtml(m.away)} ${m.away}

           ${m.g?`<span class="badge-group">Gruppe ${m.g}</span>`:""}
           ${m.roundLabel?`<span class="badge-group">${m.roundLabel}</span>`:""}`
        : `<span style="color:var(--text-mid);font-size:13px">${m.label||""}</span>
           ${m.roundLabel?`<span class="badge-group" style="margin-left:4px">${m.roundLabel}</span>`:""}`;
      // Only show winner for knockout matches (not group matches — no per-match result tracked)
      let winnerHtml = "";
      if (!m.home && state.results) {
        const roundMap = {
          "16-delsfinale": {key:"r32", matches:R32},
          "8-delsfinale":  {key:"r16", matches:R16},
          "Kvartfinale":   {key:"qf",  matches:QF},
          "Semifinale":    {key:"sf",  matches:SF},
          "Bronsefinale":  {key:"bronze", matches:[BRONZE_MATCH]},
          "Finale":        {key:"f",  matches:[FINAL_MATCH]},
        };
        const rnd = roundMap[m.roundLabel];
        if (rnd) {
          const allM = rnd.matches;
          const matchIdx = allM.findIndex(x => x.date===m.date && x.time===m.time);
          if (matchIdx >= 0) {
            const winner = rnd.key==="bronze"||rnd.key==="f"
              ? state.results[rnd.key]
              : (state.results[rnd.key]||[])[matchIdx];
            if (winner) winnerHtml = `<div class="sched-winner">${flagHtml(winner)} ${winner}</div>`;
          }
        }
      }
      const row = document.createElement("div");
      row.className = "sched-match" + (m.norway?" norway":"");
      row.innerHTML = `
        <div class="sched-time">${m.time}</div>
        <div class="sched-teams">
          <div class="sched-teams-main">${teamsHtml}</div>
          <div class="sched-venue">${m.venue||""}</div>
        </div>
        ${winnerHtml}
        ${chClass?`<span class="badge-ch ${chClass}">${m.ch}</span>`:""}
      `;
      group.appendChild(row);
    });
    container.appendChild(group);
  });
}

// ── FASIT ─────────────────────────────────────────────────────────────────────
function renderFasit() {
  const container = document.getElementById("fasit-sections");
  if (!container) return;
  container.innerHTML = `<div class="deadline-msg" style="color:var(--text-soft);border-color:var(--border);background:var(--bg-card)">Laster resultater...</div>`;
  // Always fetch fresh from backend
  api.getResults().then(res => {
    if (res.ok && res.results) {
      state.results = res.results;
      state.resultsUpdatedAt = res.updatedAt || null;
    }
    const r = state.results;
    const hasResults = r && (
      (r.groups && Object.values(r.groups).some(g => g && g.some(Boolean))) ||
      (r.r32 && r.r32.some(Boolean)) ||
      (r.r16 && r.r16.some(Boolean)) ||
      (r.qf  && r.qf.some(Boolean)) ||
      (r.sf  && r.sf.some(Boolean)) ||
      r.bronze || r.f
    );
    if (!hasResults) {
      container.innerHTML = `<div class="deadline-msg" style="color:var(--text-soft);border-color:var(--border);background:var(--bg-card)">
        Ingen resultater er lagt inn ennå. Kom tilbake når kampene er spilt! ⏳
      </div>`;
      return;
    }
    // Show last updated timestamp
    const updatedAt = state.resultsUpdatedAt;
    if (updatedAt) {
      const d = new Date(updatedAt);
      const norsk = d.toLocaleString("nb-NO", {
        timeZone: "Europe/Oslo",
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
      const box = document.createElement("div");
      box.className = "results-updated-box";
      box.innerHTML = `🕒 Sist oppdatert: <strong>${norsk}</strong>`;
      container.appendChild(box);
    }
    renderBracketTo("fasit-sections", state.results, true, state.fasitRound, () => {}, true);
  }).catch(() => {
    container.innerHTML = `<div class="deadline-msg">Kunne ikke laste resultater — prøv igjen.</div>`;
  });
}

// ── RANKING ───────────────────────────────────────────────────────────────────
function renderRanking() {
  const sub  = document.getElementById("ranking-sub");
  const list = document.getElementById("ranking-list");
  list.innerHTML = "";

  const scored = Object.entries(state.entries)
    .map(([name, b]) => ({ name, b, score: calcScore(b, state.results) }))
    .sort((a, z) => z.score - a.score);

  sub.textContent = `${scored.length} deltakere · Klikk for å se bracket`;

  if (!scored.length) {
    list.innerHTML = `<p style="color:var(--text-soft);text-align:center;padding:48px">Ingen har tippa ennå!</p>`;
    return;
  }

  const medals = ["🥇","🥈","🥉"];
  scored.forEach(({ name, b, score }, i) => {
    const row = document.createElement("div");
    row.className = "lb-row" + (i===0?" gold":"");
    row.innerHTML = `
      <div class="lb-medal">${medals[i]?medals[i]:`<span class="lb-rank">#${i+1}</span>`}</div>
      <div class="lb-info">
        <div class="lb-name${i===0?" gold":""}">${name}</div>
        <div class="lb-master">Finalist: ${b.f?`${flagHtml(b.f)} ${b.f}`:"Ikke valgt"}</div>
      </div>
      <div class="lb-score${i===0?" gold":""}">${score}<span class="lb-score-unit"> pts</span></div>
      <div class="lb-chevron">▼</div>
    `;

    const bracket = document.createElement("div");
    bracket.className = "lb-bracket";
    let expanded = false;

    row.addEventListener("click", () => {
      expanded = !expanded;
      row.querySelector(".lb-chevron").textContent = expanded ? "▲" : "▼";
      if (expanded) {
        bracket.classList.add("open");
        bracket.innerHTML = "";
        const pillsDiv = document.createElement("div");
        pillsDiv.className = "round-pills";
        let entryRound = "all";
        ROUND_OPTS.forEach(opt => {
          const pb = document.createElement("button");
          pb.className = "pill" + (opt.id==="all"?" active":"");
          pb.textContent = opt.label;
          pb.addEventListener("click", e => {
            e.stopPropagation();
            pillsDiv.querySelectorAll(".pill").forEach(x => x.classList.remove("active"));
            pb.classList.add("active");
            entryRound = opt.id;
            bracketContent.innerHTML = "";
            renderBracketTo(bracketContent.id, b, true, entryRound, ()=>{});
          });
          pillsDiv.appendChild(pb);
        });
        bracket.appendChild(pillsDiv);

        // Show group rankings summary
        if (b.groups) {
          const grpSummary = document.createElement("div");
          grpSummary.className = "lb-groups-summary";
          Object.entries(b.groups).forEach(([g, ranks]) => {
            const gDiv = document.createElement("div");
            gDiv.className = "lb-group-row";
            gDiv.innerHTML = `<span class="lb-group-letter">${g}</span>` +
              ranks.map((t,i) => t
                ? `<span class="lb-group-team">${i+1}. ${flagHtml(t)} ${t}</span>`
                : `<span class="lb-group-team empty">${i+1}. –</span>`
              ).join("");
            grpSummary.appendChild(gDiv);
          });
          bracket.appendChild(grpSummary);
        }

        const bracketContent = document.createElement("div");
        bracketContent.id = `lb-content-${i}`;
        bracket.appendChild(bracketContent);
        renderBracketTo(bracketContent.id, b, true, entryRound, ()=>{});
      } else {
        bracket.classList.remove("open");
      }
    });

    list.appendChild(row);
    list.appendChild(bracket);
  });
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

// ── GROUP RANKING SECTION (inline in bracket, for admin + readOnly views) ─────
function makeGroupRankingSection(bracket, readOnly, onChange) {
  const section = document.createElement("div");
  section.className = "round-section";

  const header = document.createElement("div");
  header.className = "round-header";
  header.innerHTML = `
    <div>
      <div class="round-title">Grupperangeringer</div>
      <div class="round-date">11. jun – 28. jun</div>
    </div>
    <span class="pts-label">+2 pts/riktig plassering</span>
  `;
  section.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "group-ranking-grid";
  section.appendChild(grid);

  Object.entries(GROUPS).forEach(([letter, teams]) => {
    const ranked = (bracket.groups && bracket.groups[letter]) || [null,null,null,null];

    const card = document.createElement("div");
    card.className = "group-rank-card";

    const cardHeader = document.createElement("div");
    cardHeader.className = "group-rank-card-header";
    cardHeader.innerHTML = `<span class="group-letter">${letter}</span> Gruppe ${letter}`;
    card.appendChild(cardHeader);

    for (let rank = 1; rank <= 4; rank++) {
      const row = document.createElement("div");
      row.className = "group-rank-row";

      const num = document.createElement("span");
      num.className = "sb-rank-num";
      num.textContent = rank;
      row.appendChild(num);

      if (readOnly) {
        const team = ranked[rank-1];
        const val = document.createElement("div");
        val.className = "group-rank-readonly" + (team ? " has-value" : "");
        val.innerHTML = team
          ? `${flagHtml(team)} <span>${team}</span>`
          : `<span class="empty">—</span>`;
        row.appendChild(val);
      } else {
        // Flag display
        const flagEl = document.createElement("span");
        flagEl.className = "sb-flag";
        if (ranked[rank-1]) flagEl.innerHTML = flagHtml(ranked[rank-1]);
        row.appendChild(flagEl);

        const select = document.createElement("select");
        select.className = "sb-rank-select" + (ranked[rank-1] ? " has-value" : "");

        const emptyOpt = document.createElement("option");
        emptyOpt.value = "";
        emptyOpt.textContent = "— Velg —";
        select.appendChild(emptyOpt);

        teams.forEach(team => {
          const opt = document.createElement("option");
          opt.value = team;
          opt.textContent = team;
          if (ranked[rank-1] === team) opt.selected = true;
          select.appendChild(opt);
        });

        select.addEventListener("change", () => {
          const newVal = select.value || null;
          const current = [...(bracket.groups[letter] || [null,null,null,null])];
          if (newVal) current.forEach((v, i) => { if (v === newVal && i !== rank-1) current[i] = null; });
          current[rank-1] = newVal;
          onChange("groups", letter, current);
        });

        row.appendChild(select);
      }

      card.appendChild(row);
    }

    grid.appendChild(card);
  });

  return section;
}
