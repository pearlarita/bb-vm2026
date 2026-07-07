// ── FLAGS — ISO 3166-1 alpha-2 codes for flag-icons CSS ──────────────────────
// Used with <span class="fi fi-xx"> from flag-icons library
const FLAGS = {
  Mexico:"mx","Sør-Afrika":"za","Sør-Korea":"kr",Tsjekkia:"cz",
  Canada:"ca","Bosnia-Hercegovina":"ba",Qatar:"qa",Sveits:"ch",
  Brasil:"br",Marokko:"ma",Haiti:"ht",Skottland:"gb-sct",
  Australia:"au",Tyrkia:"tr",USA:"us",Paraguay:"py",
  Tyskland:"de","Curaçao":"cw",Nederland:"nl",Japan:"jp",
  Elfenbenskysten:"ci",Ecuador:"ec",Sverige:"se",Tunisia:"tn",
  Spania:"es","Kapp Verde":"cv",Belgia:"be",Egypt:"eg",
  "Saudi Arabia":"sa",Uruguay:"uy",Iran:"ir","New Zealand":"nz",
  Frankrike:"fr",Senegal:"sn",Irak:"iq",Norge:"no",
  Argentina:"ar",Algerie:"dz",Østerrike:"at",Jordan:"jo",
  Portugal:"pt","DR Kongo":"cd",England:"gb-eng",Kroatia:"hr",
  Ghana:"gh",Panama:"pa",Usbekistan:"uz",Colombia:"co",
};

// Returns an inline flag HTML element
function flagHtml(team) {
  const code = FLAGS[team];
  if (!code) return "";
  return `<span class="fi fi-${code}"></span>`;
}

// ── 12 GRUPPER ────────────────────────────────────────────────────────────────
const GROUPS = {
  A:["Mexico","Sør-Afrika","Sør-Korea","Tsjekkia"],
  B:["Canada","Bosnia-Hercegovina","Qatar","Sveits"],
  C:["Brasil","Marokko","Haiti","Skottland"],
  D:["Australia","Tyrkia","USA","Paraguay"],
  E:["Tyskland","Curaçao","Elfenbenskysten","Ecuador"],
  F:["Nederland","Japan","Sverige","Tunisia"],
  G:["Iran","New Zealand","Belgia","Egypt"],
  H:["Spania","Kapp Verde","Saudi Arabia","Uruguay"],
  I:["Frankrike","Senegal","Irak","Norge"],
  J:["Argentina","Algerie","Østerrike","Jordan"],
  K:["Portugal","DR Kongo","Usbekistan","Colombia"],
  L:["Ghana","Panama","England","Kroatia"],
};

// ── GROUP RANKING HELPERS ─────────────────────────────────────────────────────
// Returns the team ranked Nth (1-indexed) in a group according to bracket.groups
// Returns "" if not set yet.
function groupRank(bracket, group, rank) {
  return (bracket.groups && bracket.groups[group] && bracket.groups[group][rank - 1]) || "";
}

// ── GRUPPESPILL ───────────────────────────────────────────────────────────────
const GROUP_MATCHES = [
  // 11. juni
  {date:"11. jun",time:"21:00",home:"Mexico",away:"Sør-Afrika",ch:"TV 2",venue:"Estadio Azteca, Mexico City",g:"A"},
  // 12. juni
  {date:"12. jun",time:"04:00",home:"Sør-Korea",away:"Tsjekkia",ch:"NRK",venue:"Estadio Akron, Guadalajara",g:"A"},
  {date:"12. jun",time:"21:00",home:"Canada",away:"Bosnia-Hercegovina",ch:"NRK",venue:"BMO Field, Toronto",g:"B"},
  // 13. juni
  {date:"13. jun",time:"03:00",home:"USA",away:"Paraguay",ch:"TV 2",venue:"SoFi Stadium, Los Angeles",g:"D"},
  {date:"13. jun",time:"21:00",home:"Qatar",away:"Sveits",ch:"NRK",venue:"Levi's Stadium, San Francisco",g:"B"},
  // 14. juni
  {date:"14. jun",time:"00:00",home:"Brasil",away:"Marokko",ch:"TV 2",venue:"New York/New Jersey Stadium",g:"C"},
  {date:"14. jun",time:"03:00",home:"Haiti",away:"Skottland",ch:"TV 2",venue:"Boston Stadium, Boston",g:"C"},
  {date:"14. jun",time:"06:00",home:"Australia",away:"Tyrkia",ch:"TV 2",venue:"BC Place, Vancouver",g:"D"},
  {date:"14. jun",time:"19:00",home:"Tyskland",away:"Curaçao",ch:"NRK",venue:"NRG Stadium, Houston",g:"E"},
  {date:"14. jun",time:"22:00",home:"Nederland",away:"Japan",ch:"TV 2",venue:"AT&T Stadium, Dallas",g:"F"},
  // 15. juni
  {date:"15. jun",time:"01:00",home:"Elfenbenskysten",away:"Ecuador",ch:"TV 2",venue:"Lincoln Financial Field, Philadelphia",g:"E"},
  {date:"15. jun",time:"04:00",home:"Sverige",away:"Tunisia",ch:"TV 2",venue:"Estadio BBVA, Monterrey",g:"F"},
  {date:"15. jun",time:"18:00",home:"Spania",away:"Kapp Verde",ch:"TV 2",venue:"Mercedes-Benz Stadium, Atlanta",g:"H"},
  {date:"15. jun",time:"21:00",home:"Belgia",away:"Egypt",ch:"NRK",venue:"Lumen Field, Seattle",g:"G"},
  // 16. juni
  {date:"16. jun",time:"00:00",home:"Saudi Arabia",away:"Uruguay",ch:"NRK",venue:"Hard Rock Stadium, Miami",g:"H"},
  {date:"16. jun",time:"03:00",home:"Iran",away:"New Zealand",ch:"NRK",venue:"SoFi Stadium, Los Angeles",g:"G"},
  {date:"16. jun",time:"21:00",home:"Frankrike",away:"Senegal",ch:"TV 2",venue:"New York/New Jersey Stadium",g:"I"},
  // 17. juni
  {date:"17. jun",time:"00:00",home:"Irak",away:"Norge",ch:"TV 2",venue:"Boston Stadium, Boston",g:"I",norway:true},
  {date:"17. jun",time:"03:00",home:"Argentina",away:"Algerie",ch:"NRK",venue:"Arrowhead Stadium, Kansas City",g:"J"},
  {date:"17. jun",time:"06:00",home:"Østerrike",away:"Jordan",ch:"NRK",venue:"Levi's Stadium, San Francisco",g:"J"},
  {date:"17. jun",time:"19:00",home:"Portugal",away:"DR Kongo",ch:"NRK",venue:"NRG Stadium, Houston",g:"K"},
  {date:"17. jun",time:"22:00",home:"England",away:"Kroatia",ch:"TV 2",venue:"AT&T Stadium, Dallas",g:"L"},
  // 18. juni
  {date:"18. jun",time:"01:00",home:"Ghana",away:"Panama",ch:"TV 2",venue:"BMO Field, Toronto",g:"L"},
  {date:"18. jun",time:"04:00",home:"Usbekistan",away:"Colombia",ch:"TV 2",venue:"Estadio Azteca, Mexico City",g:"K"},
  {date:"18. jun",time:"18:00",home:"Tsjekkia",away:"Sør-Afrika",ch:"NRK",venue:"Mercedes-Benz Stadium, Atlanta",g:"A"},
  {date:"18. jun",time:"21:00",home:"Sveits",away:"Bosnia-Hercegovina",ch:"TV 2",venue:"SoFi Stadium, Los Angeles",g:"B"},
  // 19. juni
  {date:"19. jun",time:"00:00",home:"Canada",away:"Qatar",ch:"TV 2",venue:"BC Place, Vancouver",g:"B"},
  {date:"19. jun",time:"03:00",home:"Mexico",away:"Sør-Korea",ch:"TV 2",venue:"Estadio Akron, Guadalajara",g:"A"},
  {date:"19. jun",time:"21:00",home:"USA",away:"Australia",ch:"NRK",venue:"Lumen Field, Seattle",g:"D"},
  // 20. juni
  {date:"20. jun",time:"00:00",home:"Skottland",away:"Marokko",ch:"NRK",venue:"Boston Stadium, Boston",g:"C"},
  {date:"20. jun",time:"02:30",home:"Brasil",away:"Haiti",ch:"NRK",venue:"Lincoln Financial Field, Philadelphia",g:"C"},
  {date:"20. jun",time:"05:00",home:"Tyrkia",away:"Paraguay",ch:"NRK",venue:"Levi's Stadium, San Francisco",g:"D"},
  {date:"20. jun",time:"19:00",home:"Nederland",away:"Sverige",ch:"NRK",venue:"NRG Stadium, Houston",g:"F"},
  {date:"20. jun",time:"22:00",home:"Tyskland",away:"Elfenbenskysten",ch:"TV 2",venue:"BMO Field, Toronto",g:"E"},
  // 21. juni
  {date:"21. jun",time:"02:00",home:"Ecuador",away:"Curaçao",ch:"TV 2",venue:"Arrowhead Stadium, Kansas City",g:"E"},
  {date:"21. jun",time:"06:00",home:"Tunisia",away:"Japan",ch:"NRK",venue:"Estadio BBVA, Monterrey",g:"F"},
  {date:"21. jun",time:"18:00",home:"Spania",away:"Saudi Arabia",ch:"NRK",venue:"Mercedes-Benz Stadium, Atlanta",g:"H"},
  {date:"21. jun",time:"21:00",home:"Belgia",away:"Iran",ch:"TV 2",venue:"SoFi Stadium, Los Angeles",g:"G"},
  // 22. juni
  {date:"22. jun",time:"00:00",home:"Uruguay",away:"Kapp Verde",ch:"TV 2",venue:"Hard Rock Stadium, Miami",g:"H"},
  {date:"22. jun",time:"03:00",home:"New Zealand",away:"Egypt",ch:"TV 2",venue:"BC Place, Vancouver",g:"G"},
  {date:"22. jun",time:"19:00",home:"Argentina",away:"Østerrike",ch:"TV 2",venue:"AT&T Stadium, Dallas",g:"J"},
  {date:"22. jun",time:"23:00",home:"Frankrike",away:"Irak",ch:"NRK",venue:"Lincoln Financial Field, Philadelphia",g:"I"},
  // 23. juni
  {date:"23. jun",time:"02:00",home:"Norge",away:"Senegal",ch:"NRK",venue:"New York/New Jersey Stadium",g:"I",norway:true},
  {date:"23. jun",time:"05:00",home:"Jordan",away:"Algerie",ch:"TV 2",venue:"Levi's Stadium, San Francisco",g:"J"},
  {date:"23. jun",time:"19:00",home:"Portugal",away:"Usbekistan",ch:"TV 2",venue:"NRG Stadium, Houston",g:"K"},
  {date:"23. jun",time:"22:00",home:"England",away:"Ghana",ch:"NRK",venue:"Boston Stadium, Boston",g:"L"},
  // 24. juni
  {date:"24. jun",time:"01:00",home:"Panama",away:"Kroatia",ch:"NRK",venue:"BMO Field, Toronto",g:"L"},
  {date:"24. jun",time:"04:00",home:"Colombia",away:"DR Kongo",ch:"TV 2",venue:"Estadio Akron, Guadalajara",g:"K"},
  {date:"24. jun",time:"21:00",home:"Sveits",away:"Canada",ch:"NRK",venue:"BC Place, Vancouver",g:"B"},
  {date:"24. jun",time:"21:00",home:"Bosnia-Hercegovina",away:"Qatar",ch:"NRK",venue:"Lumen Field, Seattle",g:"B"},
  // 25. juni
  {date:"25. jun",time:"00:00",home:"Skottland",away:"Brasil",ch:"NRK",venue:"Hard Rock Stadium, Miami",g:"C"},
  {date:"25. jun",time:"00:00",home:"Marokko",away:"Haiti",ch:"NRK",venue:"Mercedes-Benz Stadium, Atlanta",g:"C"},
  {date:"25. jun",time:"03:00",home:"Sør-Afrika",away:"Sør-Korea",ch:"TV 2",venue:"Estadio BBVA, Monterrey",g:"A"},
  {date:"25. jun",time:"03:00",home:"Tsjekkia",away:"Mexico",ch:"NRK",venue:"Estadio Azteca, Mexico City",g:"A"},
  {date:"25. jun",time:"22:00",home:"Ecuador",away:"Tyskland",ch:"TV 2",venue:"New York/New Jersey Stadium",g:"E"},
  {date:"25. jun",time:"22:00",home:"Curaçao",away:"Elfenbenskysten",ch:"TV 2",venue:"Lincoln Financial Field, Philadelphia",g:"E"},
  // 26. juni
  {date:"26. jun",time:"01:00",home:"Tunisia",away:"Nederland",ch:"TV 2",venue:"Arrowhead Stadium, Kansas City",g:"F"},
  {date:"26. jun",time:"01:00",home:"Japan",away:"Sverige",ch:"TV 2",venue:"AT&T Stadium, Dallas",g:"F"},
  {date:"26. jun",time:"04:00",home:"Tyrkia",away:"USA",ch:"NRK",venue:"SoFi Stadium, Los Angeles",g:"D"},
  {date:"26. jun",time:"04:00",home:"Paraguay",away:"Australia",ch:"NRK",venue:"Levi's Stadium, San Francisco",g:"D"},
  {date:"26. jun",time:"21:00",home:"Senegal",away:"Irak",ch:"NRK",venue:"BMO Field, Toronto",g:"I"},
  {date:"26. jun",time:"21:00",home:"Norge",away:"Frankrike",ch:"NRK",venue:"Boston Stadium, Boston",g:"I",norway:true},
  // 27. juni
  {date:"27. jun",time:"02:00",home:"Uruguay",away:"Spania",ch:"NRK",venue:"Estadio Akron, Guadalajara",g:"H"},
  {date:"27. jun",time:"02:00",home:"Kapp Verde",away:"Saudi Arabia",ch:"NRK",venue:"NRG Stadium, Houston",g:"H"},
  {date:"27. jun",time:"05:00",home:"New Zealand",away:"Belgia",ch:"NRK",venue:"BC Place, Vancouver",g:"G"},
  {date:"27. jun",time:"05:00",home:"Egypt",away:"Iran",ch:"NRK",venue:"Lumen Field, Seattle",g:"G"},
  {date:"27. jun",time:"23:00",home:"Panama",away:"England",ch:"NRK",venue:"New York/New Jersey Stadium",g:"L"},
  {date:"27. jun",time:"23:00",home:"Kroatia",away:"Ghana",ch:"NRK",venue:"Lincoln Financial Field, Philadelphia",g:"L"},
  // 28. juni
  {date:"28. jun",time:"01:30",home:"DR Kongo",away:"Usbekistan",ch:"NRK",venue:"Mercedes-Benz Stadium, Atlanta",g:"K"},
  {date:"28. jun",time:"01:30",home:"Colombia",away:"Portugal",ch:"NRK",venue:"Hard Rock Stadium, Miami",g:"K"},
  {date:"28. jun",time:"04:00",home:"Jordan",away:"Argentina",ch:"NRK",venue:"AT&T Stadium, Dallas",g:"J"},
  {date:"28. jun",time:"04:00",home:"Algerie",away:"Østerrike",ch:"NRK",venue:"Arrowhead Stadium, Kansas City",g:"J"},
];

// ── SLUTTSPILL ────────────────────────────────────────────────────────────────
// R32: each match now uses gA/gB to define which ranked position from which group
// gA = {group, rank} for left team, gB = {group, rank} for right team
// rank 1 = group winner, rank 2 = runner-up
// "best3" entries are open to any 3rd-place (rank 3 from various groups)
// best3Groups: which groups' 3rd-place teams are eligible for this slot (per NRK bracket)
// R32 fra tipsbladet (sluttspilltre) — faktiske kamppar
const R32 = [
  {id:0,  date:"28. jun",time:"21:00",label:"Sør-Afrika – Canada",       venue:"Los Angeles",   ch:"TV 2", gA:{g:"A",r:2}, gB:{g:"B",r:2}},
  {id:1,  date:"29. jun",time:"19:00",label:"Brasil – Japan",             venue:"Houston",       ch:"NRK",  gA:{g:"C",r:1}, gB:{g:"F",r:2}},
  {id:2,  date:"29. jun",time:"22:30",label:"Tyskland – Paraguay",        venue:"Boston",        ch:"TV 2", gA:{g:"E",r:1}, gB:null, best3Groups:["A","B","C","D","F"]},
  {id:3,  date:"30. jun",time:"03:00",label:"Nederland – Marokko",        venue:"Monterrey",     ch:"TV 2", gA:{g:"F",r:1}, gB:{g:"C",r:2}},
  {id:4,  date:"30. jun",time:"19:00",label:"Elfenbenskysten – Norge",    venue:"Dallas",        ch:"NRK",  gA:{g:"E",r:2}, gB:{g:"I",r:2}},
  {id:5,  date:"30. jun",time:"23:00",label:"Frankrike – Sverige",        venue:"New York",      ch:"NRK",  gA:{g:"I",r:1}, gB:null, best3Groups:["C","D","F","G","H"]},
  {id:6,  date:"1. jul", time:"03:00",label:"Mexico – Ecuador",           venue:"Mexico City",   ch:"TV 2", gA:{g:"A",r:1}, gB:null, best3Groups:["C","E","F","H","I"]},
  {id:7,  date:"1. jul", time:"18:00",label:"England – DR Kongo",         venue:"Atlanta",       ch:"NRK",  gA:{g:"L",r:1}, gB:null, best3Groups:["E","H","I","J","K"]},
  {id:8,  date:"1. jul", time:"22:00",label:"Belgia – Senegal",           venue:"Seattle",       ch:"NRK",  gA:{g:"G",r:1}, gB:null, best3Groups:["A","E","H","I","J"]},
  {id:9,  date:"2. jul", time:"02:00",label:"USA – Bosnia-Hercegovina",   venue:"San Francisco", ch:"TV 2", gA:{g:"D",r:1}, gB:null, best3Groups:["B","E","F","I","J"]},
  {id:10, date:"2. jul", time:"21:00",label:"Spania – Østerrike",         venue:"Los Angeles",   ch:"NRK",  gA:{g:"H",r:1}, gB:{g:"J",r:2}},
  {id:11, date:"3. jul", time:"01:00",label:"Portugal – Kroatia",         venue:"Toronto",       ch:"NRK",  gA:{g:"K",r:2}, gB:{g:"L",r:2}},
  {id:12, date:"3. jul", time:"05:00",label:"Sveits – Algerie",           venue:"Vancouver",     ch:"TV 2", gA:{g:"B",r:1}, gB:null, best3Groups:["E","F","G","I","J"]},
  {id:13, date:"3. jul", time:"20:00",label:"Australia – Egypt",          venue:"Dallas",        ch:"TV 2", gA:{g:"D",r:2}, gB:{g:"G",r:2}},
  {id:14, date:"4. jul", time:"00:00",label:"Argentina – Kapp Verde",     venue:"Miami",         ch:"TV 2", gA:{g:"J",r:1}, gB:{g:"H",r:2}},
  {id:15, date:"4. jul", time:"03:30",label:"Colombia – Ghana",           venue:"Kansas City",   ch:"NRK",  gA:{g:"K",r:1}, gB:null, best3Groups:["D","E","I","J","L"]},
];

const R16 = [
  {id:0, date:"4. jul", time:"19:00",label:"Canada – Marokko",         venue:"Houston",       ch:"NRK",from:[0,3]},
  {id:1, date:"4. jul", time:"23:00",label:"Paraguay – Frankrike",     venue:"Philadelphia",  ch:"NRK",from:[2,5]},
  {id:2, date:"5. jul", time:"22:00",label:"Brasil – Norge",           venue:"New York",      ch:"NRK",from:[1,4]},
  {id:3, date:"6. jul", time:"02:00",label:"Mexico – England",         venue:"Mexico City",   ch:"NRK",from:[6,7]},
  {id:4, date:"6. jul", time:"21:00",label:"Portugal – Spania",        venue:"Dallas",        ch:"NRK",from:[11,10]},
  {id:5, date:"7. jul", time:"02:00",label:"USA – Belgia",             venue:"Seattle",       ch:"NRK",from:[9,8]},
  {id:6, date:"7. jul", time:"18:00",label:"Argentina – Egypt",        venue:"Atlanta",       ch:"NRK",from:[14,13]},
  {id:7, date:"7. jul", time:"22:00",label:"Sveits – Colombia",        venue:"Vancouver",     ch:"NRK",from:[12,15]},
];

const QF = [
  {id:0, date:"9. jul", time:"22:00",label:"VÅ1 – VÅ2",venue:"Boston",      ch:"TV 2",from:[0,1]},
  {id:1, date:"10. jul",time:"21:00",label:"VÅ5 – VÅ6",venue:"Los Angeles", ch:"TV 2",from:[4,5]},
  {id:2, date:"11. jul",time:"23:00",label:"VÅ3 – VÅ4",venue:"Miami",       ch:"TV 2",from:[2,3]},
  {id:3, date:"12. jul",time:"03:00",label:"VÅ7 – VÅ8",venue:"Kansas City", ch:"TV 2",from:[6,7]},
];

const SF = [
  {id:0, date:"14. jul",time:"21:00",label:"VKF1 – VKF2",venue:"Dallas",  ch:"TV 2",from:[0,1]},
  {id:1, date:"15. jul",time:"21:00",label:"VKF3 – VKF4",venue:"Atlanta", ch:"TV 2",from:[2,3]},
];

const BRONZE_MATCH = {date:"18. jul",time:"23:00",label:"Bronsefinale",venue:"Miami",ch:"NRK"};
const FINAL_MATCH  = {date:"19. jul",time:"21:00",label:"Finale",      venue:"New York / MetLife Stadium",ch:"NRK"};

// ── SCORE ─────────────────────────────────────────────────────────────────────
const SCORE_MAP = {groups:2, r32:3, r16:5, qf:10, sf:15, bronze:20, f:35};

function emptyBracket() {
  const groups = {};
  Object.keys(GROUPS).forEach(g => { groups[g] = [null, null, null, null]; });
  return { groups, r32:Array(16).fill(""), r16:Array(8).fill(""),
           qf:Array(4).fill(""), sf:Array(2).fill(""), bronze:"", f:"" };
}

function calcScore(entry, results) {
  let s = 0;
  // Group rankings: 2 pts per correctly placed team
  if (entry.groups && results.groups) {
    Object.keys(GROUPS).forEach(g => {
      const eRanks = entry.groups[g] || [];
      const rRanks = results.groups[g] || [];
      eRanks.forEach((team, i) => { if (team && team === rRanks[i]) s += SCORE_MAP.groups; });
    });
  }
  ["r32","r16","qf","sf"].forEach(k => {
    (entry[k]||[]).forEach((t,i) => { if (t && t === (results[k]||[])[i]) s += SCORE_MAP[k]; });
  });
  if (entry.bronze && entry.bronze === results.bronze) s += SCORE_MAP.bronze;
  if (entry.f && entry.f === results.f) s += SCORE_MAP.f;
  return s;
}

// ── POOL LOGIC ────────────────────────────────────────────────────────────────
function getPool(round, idx, bracket) {
  if (round === "r32") {
    return getR32Pool(idx, bracket);
  }
  if (round === "r16") { const m = R16[idx]; return [bracket.r32[m.from[0]], bracket.r32[m.from[1]]].filter(Boolean); }
  if (round === "qf")  { const m = QF[idx];  return [bracket.r16[m.from[0]], bracket.r16[m.from[1]]].filter(Boolean); }
  if (round === "sf")  { const m = SF[idx];  return [bracket.qf[m.from[0]], bracket.qf[m.from[1]]].filter(Boolean); }
  // Bronze: the losers of the two semi-finals
  // SF[0]: winner from qf[0] vs qf[1] — loser is whichever of those two was NOT picked
  // SF[1]: winner from qf[2] vs qf[3] — loser is whichever of those two was NOT picked
  if (round === "bronze") {
    const losers = [];
    SF.forEach((m, i) => {
      const sfWinner = bracket.sf[i];
      const candidate0 = bracket.qf[m.from[0]];
      const candidate1 = bracket.qf[m.from[1]];
      if (sfWinner && candidate0 && candidate0 !== sfWinner) losers.push(candidate0);
      if (sfWinner && candidate1 && candidate1 !== sfWinner) losers.push(candidate1);
      // If SF winner not set yet, include both QF winners as options
      if (!sfWinner) {
        if (candidate0) losers.push(candidate0);
        if (candidate1) losers.push(candidate1);
      }
    });
    return [...new Set(losers)];
  }
  // Final: winners of SF
  if (round === "f")      return [...bracket.sf].filter(Boolean);
  if (round === "winner") return [bracket.f].filter(Boolean);
  return Object.keys(FLAGS);
}

// Smart pool for R32: left side from gA rank, right side from gB rank or best3Groups 3rd places
function getR32Pool(idx, bracket) {
  const m = R32[idx];
  const result = [];

  // Left side: the specific ranked team from gA
  if (m.gA) {
    const t = groupRank(bracket, m.gA.g, m.gA.r);
    if (t) result.push(t);
    else result.push(...GROUPS[m.gA.g]);
  }

  // Right side: specific rank from gB, or 3rd-place teams sorted by best3Groups order
  if (m.gB) {
    const t = groupRank(bracket, m.gB.g, m.gB.r);
    if (t) result.push(t);
    else result.push(...GROUPS[m.gB.g]);
  } else if (m.best3Groups) {
    // Pick the 3rd-place team from each listed group, in the order listed
    // Only include groups where user has set a 3rd-place ranking
    const thirds = m.best3Groups
      .map(g => groupRank(bracket, g, 3))
      .filter(Boolean);
    if (thirds.length) {
      result.push(...thirds);
    } else {
      // Fallback: all teams from those groups in order
      m.best3Groups.forEach(g => result.push(...GROUPS[g]));
    }
  }

  return [...new Set(result)];
}
