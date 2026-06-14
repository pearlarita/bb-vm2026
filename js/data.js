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
  // Gruppe A
  {date:"11. jun",time:"21:00",home:"Mexico",away:"Sør-Afrika",ch:"TV 2",venue:"Mexico City",g:"A"},
  {date:"12. jun",time:"04:00",home:"Sør-Korea",away:"Tsjekkia",ch:"NRK",venue:"Guadalajara",g:"A"},
  {date:"18. jun",time:"18:00",home:"Tsjekkia",away:"Sør-Afrika",ch:"NRK",venue:"Atlanta",g:"A"},
  {date:"19. jun",time:"03:00",home:"Mexico",away:"Sør-Korea",ch:"TV 2",venue:"Guadalajara",g:"A"},
  {date:"25. jun",time:"03:00",home:"Mexico",away:"Tsjekkia",ch:"TV 2",venue:"Mexico City",g:"A"},
  {date:"25. jun",time:"03:00",home:"Sør-Afrika",away:"Sør-Korea",ch:"TV 2",venue:"Monterrey",g:"A"},
  // Gruppe B
  {date:"12. jun",time:"21:00",home:"Canada",away:"Bosnia-Hercegovina",ch:"NRK",venue:"Toronto",g:"B"},
  {date:"13. jun",time:"21:00",home:"Qatar",away:"Sveits",ch:"NRK",venue:"San Francisco",g:"B"},
  {date:"18. jun",time:"21:00",home:"Sveits",away:"Bosnia-Hercegovina",ch:"TV 2",venue:"Los Angeles",g:"B"},
  {date:"19. jun",time:"00:00",home:"Canada",away:"Qatar",ch:"TV 2",venue:"Vancouver",g:"B"},
  {date:"24. jun",time:"21:00",home:"Sveits",away:"Canada",ch:"NRK",venue:"Vancouver",g:"B"},
  {date:"24. jun",time:"21:00",home:"Bosnia-Hercegovina",away:"Qatar",ch:"NRK",venue:"Seattle",g:"B"},
  // Gruppe C
  {date:"14. jun",time:"00:00",home:"Brasil",away:"Spania",ch:"TV 2",venue:"New York",g:"C"},
  {date:"14. jun",time:"03:00",home:"Japan",away:"Kapp Verde",ch:"TV 2",venue:"Dallas",g:"C"},
  {date:"15. jun",time:"18:00",home:"Spania",away:"Kapp Verde",ch:"TV 2",venue:"Atlanta",g:"C"},
  {date:"20. jun",time:"00:00",home:"Kapp Verde",away:"Brasil",ch:"NRK",venue:"Boston",g:"C"},
  {date:"20. jun",time:"03:00",home:"Japan",away:"Spania",ch:"NRK",venue:"Philadelphia",g:"C"},
  {date:"25. jun",time:"00:00",home:"Brasil",away:"Japan",ch:"NRK",venue:"Miami",g:"C"},
  {date:"25. jun",time:"00:00",home:"Kapp Verde",away:"Spania",ch:"NRK",venue:"Atlanta",g:"C"},
  // Gruppe D
  {date:"13. jun",time:"03:00",home:"USA",away:"Paraguay",ch:"TV 2",venue:"Los Angeles",g:"D"},
  {date:"14. jun",time:"06:00",home:"Australia",away:"Tyrkia",ch:"TV 2",venue:"Vancouver",g:"D"},
  {date:"19. jun",time:"21:00",home:"USA",away:"Australia",ch:"NRK",venue:"Seattle",g:"D"},
  {date:"20. jun",time:"06:00",home:"Tyrkia",away:"Paraguay",ch:"NRK",venue:"San Francisco",g:"D"},
  {date:"26. jun",time:"04:00",home:"Tyrkia",away:"USA",ch:"NRK",venue:"Los Angeles",g:"D"},
  {date:"26. jun",time:"04:00",home:"Paraguay",away:"Australia",ch:"NRK",venue:"San Francisco",g:"D"},
  // Gruppe E
  {date:"14. jun",time:"19:00",home:"Tyskland",away:"Curaçao",ch:"NRK",venue:"Houston",g:"E"},
  {date:"15. jun",time:"01:00",home:"Ecuador",away:"Saudi Arabia",ch:"TV 2",venue:"Philadelphia",g:"E"},
  {date:"20. jun",time:"19:00",home:"Tyskland",away:"Ecuador",ch:"TV 2",venue:"Toronto",g:"E"},
  {date:"21. jun",time:"02:00",home:"Saudi Arabia",away:"Curaçao",ch:"TV 2",venue:"Kansas City",g:"E"},
  {date:"25. jun",time:"22:00",home:"Ecuador",away:"Curaçao",ch:"TV 2",venue:"New York",g:"E"},
  {date:"25. jun",time:"22:00",home:"Saudi Arabia",away:"Tyskland",ch:"NRK",venue:"Dallas",g:"E"},
  // Gruppe F
  {date:"14. jun",time:"03:00",home:"Haiti",away:"England",ch:"TV 2",venue:"Boston",g:"F"},
  {date:"14. jun",time:"22:00",home:"Nederland",away:"Tunisia",ch:"NRK",venue:"Miami",g:"H"},
  {date:"15. jun",time:"04:00",home:"Panama",away:"Kamerun",ch:"TV 2",venue:"Monterrey",g:"F"},
  {date:"20. jun",time:"22:00",home:"England",away:"Kamerun",ch:"TV 2",venue:"Toronto",g:"F"},
  {date:"21. jun",time:"06:00",home:"Haiti",away:"Panama",ch:"NRK",venue:"Monterrey",g:"F"},
  {date:"26. jun",time:"01:00",home:"Kamerun",away:"Haiti",ch:"TV 2",venue:"Kansas City",g:"F"},
  {date:"26. jun",time:"01:00",home:"England",away:"Panama",ch:"TV 2",venue:"Dallas",g:"F"},
  // Gruppe G
  {date:"15. jun",time:"21:00",home:"Belgia",away:"Egypt",ch:"NRK",venue:"Seattle",g:"G"},
  {date:"16. jun",time:"03:00",home:"Iran",away:"New Zealand",ch:"NRK",venue:"Los Angeles",g:"G"},
  {date:"21. jun",time:"18:00",home:"Belgia",away:"Iran",ch:"TV 2",venue:"Los Angeles",g:"G"},
  {date:"22. jun",time:"03:00",home:"New Zealand",away:"Egypt",ch:"TV 2",venue:"Vancouver",g:"G"},
  {date:"27. jun",time:"05:00",home:"Egypt",away:"Iran",ch:"TV 2",venue:"Seattle",g:"G"},
  {date:"27. jun",time:"05:00",home:"New Zealand",away:"Belgia",ch:"TV 2",venue:"Vancouver",g:"G"},
  // Gruppe H
  {date:"16. jun",time:"00:00",home:"Nederland",away:"Tunisia",ch:"NRK",venue:"Miami",g:"H"},
  {date:"16. jun",time:"21:00",home:"Kroatia",away:"Chile",ch:"TV 2",venue:"New York",g:"H"},
  {date:"21. jun",time:"21:00",home:"Nederland",away:"Kroatia",ch:"TV 2",venue:"Los Angeles",g:"H"},
  {date:"22. jun",time:"00:00",home:"Chile",away:"Tunisia",ch:"TV 2",venue:"Miami",g:"H"},
  {date:"27. jun",time:"02:00",home:"Chile",away:"Nederland",ch:"NRK",venue:"Houston",g:"H"},
  {date:"27. jun",time:"02:00",home:"Tunisia",away:"Kroatia",ch:"NRK",venue:"Guadalajara",g:"H"},
  // Gruppe I
  {date:"16. jun",time:"21:00",home:"Frankrike",away:"Senegal",ch:"TV 2",venue:"New York",g:"I"},
  {date:"17. jun",time:"00:00",home:"Irak",away:"Norge",ch:"TV 2",venue:"Boston",g:"I",norway:true},
  {date:"22. jun",time:"19:00",home:"Frankrike",away:"Irak",ch:"NRK",venue:"Philadelphia",g:"I"},
  {date:"23. jun",time:"02:00",home:"Norge",away:"Senegal",ch:"NRK",venue:"New York",g:"I",norway:true},
  {date:"26. jun",time:"21:00",home:"Norge",away:"Frankrike",ch:"NRK",venue:"Boston",g:"I",norway:true},
  {date:"26. jun",time:"21:00",home:"Senegal",away:"Irak",ch:"NRK",venue:"Toronto",g:"I"},
  // Gruppe J
  {date:"17. jun",time:"03:00",home:"Argentina",away:"Algerie",ch:"NRK",venue:"Kansas City",g:"J"},
  {date:"17. jun",time:"06:00",home:"Østerrike",away:"Jordan",ch:"NRK",venue:"San Francisco",g:"J"},
  {date:"22. jun",time:"19:00",home:"Argentina",away:"Østerrike",ch:"TV 2",venue:"Dallas",g:"J"},
  {date:"23. jun",time:"05:00",home:"Jordan",away:"Algerie",ch:"TV 2",venue:"San Francisco",g:"J"},
  {date:"28. jun",time:"04:00",home:"Algerie",away:"Østerrike",ch:"NRK",venue:"Kansas City",g:"J"},
  {date:"28. jun",time:"04:00",home:"Jordan",away:"Argentina",ch:"NRK",venue:"Dallas",g:"J"},
  // Gruppe K
  {date:"17. jun",time:"19:00",home:"Portugal",away:"DR Kongo",ch:"NRK",venue:"Houston",g:"K"},
  {date:"17. jun",time:"22:00",home:"Colombia",away:"Usbekistan",ch:"TV 2",venue:"Dallas",g:"K"},
  {date:"23. jun",time:"19:00",home:"Portugal",away:"Usbekistan",ch:"TV 2",venue:"Houston",g:"K"},
  {date:"23. jun",time:"22:00",home:"Colombia",away:"DR Kongo",ch:"NRK",venue:"Boston",g:"K"},
  {date:"28. jun",time:"01:30",home:"Colombia",away:"Portugal",ch:"NRK",venue:"Miami",g:"K"},
  {date:"28. jun",time:"01:30",home:"DR Kongo",away:"Usbekistan",ch:"NRK",venue:"Atlanta",g:"K"},
  // Gruppe L
  {date:"18. jun",time:"01:00",home:"Marokko",away:"Serbia",ch:"TV 2",venue:"Toronto",g:"L"},
  {date:"18. jun",time:"04:00",home:"Uruguay",away:"Elfenbenskysten",ch:"TV 2",venue:"Mexico City",g:"L"},
  {date:"24. jun",time:"01:00",home:"Serbia",away:"Elfenbenskysten",ch:"NRK",venue:"Toronto",g:"L"},
  {date:"24. jun",time:"04:00",home:"Uruguay",away:"Marokko",ch:"TV 2",venue:"Guadalajara",g:"L"},
  {date:"28. jun",time:"04:00",home:"Elfenbenskysten",away:"Marokko",ch:"NRK",venue:"Atlanta",g:"L"},
  {date:"28. jun",time:"04:00",home:"Serbia",away:"Uruguay",ch:"NRK",venue:"Dallas",g:"L"},
];

// ── SLUTTSPILL ────────────────────────────────────────────────────────────────
// R32: each match now uses gA/gB to define which ranked position from which group
// gA = {group, rank} for left team, gB = {group, rank} for right team
// rank 1 = group winner, rank 2 = runner-up
// "best3" entries are open to any 3rd-place (rank 3 from various groups)
// best3Groups: which groups' 3rd-place teams are eligible for this slot (per NRK bracket)
const R32 = [
  {id:0,  date:"28. jun",time:"21:00",label:"2.pl A – 2.pl B",         venue:"Los Angeles",  ch:"TV 2", gA:{g:"A",r:2}, gB:{g:"B",r:2}},
  {id:1,  date:"29. jun",time:"19:00",label:"Vinner C – 2.pl F",       venue:"Houston",      ch:"TV 2", gA:{g:"C",r:1}, gB:{g:"F",r:2}},
  {id:2,  date:"29. jun",time:"22:30",label:"Vinner E – best 3.plass", venue:"Boston",       ch:"TV 2", gA:{g:"E",r:1}, gB:null, best3Groups:["A","B","C","D","F"]},
  {id:3,  date:"30. jun",time:"03:00",label:"Vinner F – 2.pl C",       venue:"Monterrey",    ch:"TV 2", gA:{g:"F",r:1}, gB:{g:"C",r:2}},
  {id:4,  date:"30. jun",time:"19:00",label:"2.pl E – 2.pl I",         venue:"Dallas",       ch:"TV 2", gA:{g:"E",r:2}, gB:{g:"I",r:2}},
  {id:5,  date:"30. jun",time:"23:00",label:"Vinner I – best 3.plass", venue:"New York",     ch:"TV 2", gA:{g:"I",r:1}, gB:null, best3Groups:["C","D","F","G","H"]},
  {id:6,  date:"1. jul", time:"03:00",label:"Vinner A – best 3.plass", venue:"Mexico City",  ch:"TV 2", gA:{g:"A",r:1}, gB:null, best3Groups:["C","E","F","H","I"]},
  {id:7,  date:"1. jul", time:"18:00",label:"Vinner L – best 3.plass", venue:"Atlanta",      ch:"TV 2", gA:{g:"L",r:1}, gB:null, best3Groups:["E","H","I","J","K"]},
  {id:8,  date:"1. jul", time:"22:00",label:"Vinner G – best 3.plass", venue:"Seattle",      ch:"TV 2", gA:{g:"G",r:1}, gB:null, best3Groups:["A","E","H","I","J"]},
  {id:9,  date:"2. jul", time:"02:00",label:"Vinner D – best 3.plass", venue:"San Francisco",ch:"TV 2", gA:{g:"D",r:1}, gB:null, best3Groups:["B","E","F","I","J"]},
  {id:10, date:"2. jul", time:"21:00",label:"Vinner H – 2.pl J",       venue:"Los Angeles",  ch:"TV 2", gA:{g:"H",r:1}, gB:{g:"J",r:2}},
  {id:11, date:"3. jul", time:"01:00",label:"2.pl K – 2.pl L",         venue:"Toronto",      ch:"TV 2", gA:{g:"K",r:2}, gB:{g:"L",r:2}},
  {id:12, date:"3. jul", time:"05:00",label:"Vinner B – best 3.plass", venue:"Vancouver",    ch:"TV 2", gA:{g:"B",r:1}, gB:null, best3Groups:["E","F","G","I","J"]},
  {id:13, date:"3. jul", time:"20:00",label:"2.pl D – 2.pl G",         venue:"San Francisco",ch:"TV 2", gA:{g:"D",r:2}, gB:{g:"G",r:2}},
  {id:14, date:"4. jul", time:"00:00",label:"Vinner J – 2.pl H",       venue:"Miami",        ch:"TV 2", gA:{g:"J",r:1}, gB:{g:"H",r:2}},
  {id:15, date:"4. jul", time:"03:30",label:"Vinner K – best 3.plass", venue:"Kansas City",  ch:"TV 2", gA:{g:"K",r:1}, gB:null, best3Groups:["D","E","I","J","L"]},
];

const R16 = [
  {id:0, date:"4. jul", time:"19:00",label:"V16-1 – V16-3",   venue:"Houston",      ch:"NRK",from:[0,2]},
  {id:1, date:"4. jul", time:"23:00",label:"V16-2 – V16-5",   venue:"Philadelphia", ch:"NRK",from:[1,4]},
  {id:2, date:"5. jul", time:"22:00",label:"V16-4 – V16-6",   venue:"New York",     ch:"NRK",from:[3,5]},
  {id:3, date:"6. jul", time:"02:00",label:"V16-7 – V16-8",   venue:"Mexico City",  ch:"NRK",from:[6,7]},
  {id:4, date:"6. jul", time:"21:00",label:"V16-11 – V16-12", venue:"Dallas",       ch:"NRK",from:[10,11]},
  {id:5, date:"7. jul", time:"02:00",label:"V16-9 – V16-10",  venue:"Seattle",      ch:"NRK",from:[8,9]},
  {id:6, date:"7. jul", time:"18:00",label:"V16-14 – V16-16", venue:"Atlanta",      ch:"NRK",from:[13,15]},
  {id:7, date:"7. jul", time:"22:00",label:"V16-13 – V16-15", venue:"Vancouver",    ch:"NRK",from:[12,14]},
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
