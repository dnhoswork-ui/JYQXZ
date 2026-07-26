// JYQXZ — A Wuxia Tale (MVP). Vanilla JS engine: state, UI, exploration, combat.

const SAVE_KEY = "jyqxz_save_v1";

let state = null;

// ---------- utilities ----------

const $ = (id) => document.getElementById(id);
const rand = (n) => Math.floor(Math.random() * n);

function log(text, cls = "narration") {
  const p = document.createElement("p");
  p.className = cls;
  p.innerHTML = text;
  $("log").appendChild(p);
  $("log").scrollTop = $("log").scrollHeight;
}

function heading(text) {
  log(text, "heading");
}

function setActions(actions) {
  const box = $("actions");
  box.innerHTML = "";
  for (const a of actions) {
    const b = document.createElement("button");
    b.textContent = a.label;
    if (a.cls) b.className = a.cls;
    if (a.disabled) b.disabled = true;
    b.onclick = a.fn;
    box.appendChild(b);
  }
}

// ---------- state ----------

function newState(name, origin) {
  const s = {
    name,
    level: 1,
    exp: 0,
    maxHp: 100, hp: 100,
    maxMp: 50, mp: 50,
    str: 10, agi: 8, wis: 8,
    gold: 50,
    skills: ["taizu"],
    prof: { taizu: 0 },
    equip: { weapon: null, armor: null },
    items: { jinchuang: 2 },
    location: "inn",
    quest: 0,
    flags: {},
    combat: null,
  };
  if (origin === "farmer") { s.str += 4; s.maxHp += 20; s.hp += 20; }
  if (origin === "scholar") { s.wis += 4; s.maxMp += 20; s.mp += 20; }
  if (origin === "hunter") { s.agi += 4; }
  return s;
}

function hasSkill(id) { return state.skills.includes(id); }
function hasPassive(id) { return hasSkill(id); }

// Older saves lack fields added after the MVP; fill them in.
function migrateState(s) {
  s.prof = s.prof || {};
  for (const id of s.skills) if (s.prof[id] === undefined) s.prof[id] = 0;
  s.equip = s.equip || { weapon: null, armor: null };
  s.flags = s.flags || {};
  return s;
}

const CHENG = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
function chengOf(id) { return Math.min(10, Math.floor((state.prof[id] || 0) / 10) + 1); }
function skillMult(s) { return s.mult * (1 + (chengOf(s.id) - 1) * 0.06); }

function weaponAtk() { return state.equip.weapon ? ITEMS[state.equip.weapon].atk : 0; }
function armorDef() { return state.equip.armor ? ITEMS[state.equip.armor].def : 0; }

function questText() {
  if (state.quest === 0) return "Your master was cut down by a masked man. The innkeeper at Yueyang Inn may know something.";
  if (state.quest === 1) return "The killer is 'Ghost-Faced Blade', last seen climbing Mount Hua. He is far beyond you — train, learn martial arts, then face him at the summit.";
  return "Ghost-Faced Blade is defeated. Your master is avenged. The rivers and lakes lie open before you.";
}

function updateStats() {
  $("stat-name").textContent = state.name;
  $("stat-location").textContent = state.combat ? "⚔ In combat" : LOCATIONS[state.location].name;
  $("stat-hp-text").textContent = `${state.hp}/${state.maxHp}`;
  $("stat-mp-text").textContent = `${state.mp}/${state.maxMp}`;
  const need = expNeeded();
  $("stat-exp-text").textContent = `${state.exp}/${need}`;
  $("bar-hp").style.width = `${(100 * state.hp) / state.maxHp}%`;
  $("bar-mp").style.width = `${(100 * state.mp) / state.maxMp}%`;
  $("bar-exp").style.width = `${Math.min(100, (100 * state.exp) / need)}%`;
  $("stat-level").textContent = state.level;
  $("stat-str").textContent = state.str;
  $("stat-agi").textContent = state.agi;
  $("stat-wis").textContent = state.wis;
  $("stat-gold").textContent = state.gold;

  const sk = $("stat-skills");
  sk.innerHTML = "";
  for (const id of state.skills) {
    const s = SKILLS[id];
    const li = document.createElement("li");
    li.innerHTML = s.passive
      ? `${s.name}`
      : `${s.name} <span class="skill-detail">(${CHENG[chengOf(id) - 1]}成 · ×${skillMult(s).toFixed(2)} dmg, ${s.mpCost} energy)</span>`;
    sk.appendChild(li);
  }

  const it = $("stat-items");
  it.innerHTML = "";
  const entries = Object.entries(state.items).filter(([, n]) => n > 0);
  if (entries.length === 0) it.innerHTML = `<li class="item-count">— empty —</li>`;
  for (const [id, n] of entries) {
    const li = document.createElement("li");
    const equipped = state.equip.weapon === id || state.equip.armor === id ? " ✦equipped" : "";
    li.innerHTML = `${ITEMS[id].name} <span class="item-count">×${n}${equipped}</span>`;
    it.appendChild(li);
  }

  $("stat-quest").textContent = questText();
}

function expNeeded() { return state.level * 100; }

function gainExp(n) {
  state.exp += n;
  log(`You gain <b>${n}</b> experience.`, "system");
  while (state.exp >= expNeeded()) {
    state.exp -= expNeeded();
    state.level += 1;
    state.maxHp += 15;
    state.maxMp += 10;
    state.str += 3;
    state.agi += 2;
    state.wis += 1;
    state.hp = state.maxHp;
    state.mp = state.maxMp;
    log(`🌟 Your cultivation deepens — you reach <b>Level ${state.level}</b>! All wounds heal; strength and agility grow.`, "system");
  }
  updateStats();
}

function gainGold(n) {
  if (n <= 0) return;
  state.gold += n;
  log(`You pick up <b>${n}</b> silver.`, "system");
}

function addItem(id, n = 1) {
  state.items[id] = (state.items[id] || 0) + n;
}

function learnSkill(id) {
  if (hasSkill(id)) return;
  state.skills.push(id);
  state.prof[id] = 0;
  const s = SKILLS[id];
  log(`📜 You have learned <b>${s.name}</b>! ${s.desc}`, "system");
  if (id === "jiuyang") {
    state.maxMp += 30;
    state.mp = state.maxMp;
  }
  updateStats();
}

// ---------- save / load ----------

function saveGame() {
  if (!state || state.combat) {
    log("You cannot save mid-battle.", "dim");
    return;
  }
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  log("💾 Game saved.", "system");
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    log("No saved game found.", "dim");
    return;
  }
  state = migrateState(JSON.parse(raw));
  state.combat = null;
  $("log").innerHTML = "";
  log("📂 Game loaded.", "system");
  showLocation();
}

function resetGame() {
  if (!confirm("Restart from the very beginning? Unsaved progress is lost.")) return;
  state = null;
  $("log").innerHTML = "";
  startIntro();
}

// ---------- combat ----------

function playerAtkBase() { return state.str + state.level * 2 + weaponAtk(); }

function startCombat(enemyId, opts = {}) {
  const tpl = ENEMIES[enemyId];
  state.combat = {
    enemy: { ...tpl },
    maxHp: tpl.hp,
    opts,
    defending: false,
    turnCount: 0,
    charging: false,
  };
  heading(`⚔ ${tpl.name}`);
  log(tpl.intro, "dialog");
  updateStats();
  combatMenu();
}

function combatMenu() {
  const c = state.combat;
  const actions = [];
  for (const id of state.skills) {
    const s = SKILLS[id];
    if (s.passive) continue;
    actions.push({
      label: s.mpCost > 0 ? `${s.name} (${s.mpCost})` : s.name,
      disabled: state.mp < s.mpCost,
      fn: () => playerAttack(s),
    });
  }
  actions.push({ label: "🛡 Defend (recover energy)", fn: playerDefend });
  const usable = Object.entries(state.items).filter(([id, n]) => n > 0 && (ITEMS[id].heal || ITEMS[id].fullHeal));
  for (const [id, n] of usable) {
    actions.push({ label: `Use ${ITEMS[id].name} ×${n}`, fn: () => combatUseItem(id) });
  }
  if (c.opts.canFlee !== false) {
    actions.push({ label: "🏃 Flee", cls: "danger", fn: playerFlee });
  }
  setActions(actions);
}

function playerAttack(skill) {
  const c = state.combat;
  state.mp -= skill.mpCost;
  const def = skill.pierce ? 0 : c.enemy.def;
  let dmg = Math.round(playerAtkBase() * skillMult(skill)) + rand(6) - def;
  if (hasPassive("jiuyang")) dmg = Math.round(dmg * 1.2);
  dmg = Math.max(1, dmg);
  let crit = "";
  if (rand(100) < 5 + state.agi) {
    dmg = Math.round(dmg * 1.5);
    crit = " <b>Critical strike!</b>";
  }
  c.enemy.hp -= dmg;
  log(`You strike with ${skill.name} — <b>${dmg}</b> damage.${crit}`, "combat");
  gainProficiency(skill.id);
  afterPlayerTurn();
}

function gainProficiency(id) {
  const before = chengOf(id);
  state.prof[id] = Math.min(100, (state.prof[id] || 0) + 2 + rand(3));
  const after = chengOf(id);
  if (after > before) {
    log(`⚡ Your <b>${SKILLS[id].name}</b> advances to <b>${CHENG[after - 1]}成</b> mastery!`, "system");
  }
}

function playerDefend() {
  const c = state.combat;
  c.defending = true;
  const recover = 8 + Math.floor(state.wis / 2);
  state.mp = Math.min(state.maxMp, state.mp + recover);
  log(`You guard and steady your breathing, recovering <b>${recover}</b> inner energy.`, "combat");
  afterPlayerTurn();
}

function combatUseItem(id) {
  useItem(id);
  afterPlayerTurn();
}

function playerFlee() {
  const c = state.combat;
  let chance = 0.4 + (state.agi - c.enemy.agi) * 0.05;
  chance = Math.max(0.1, Math.min(0.9, chance));
  if (Math.random() < chance) {
    log("You employ lightness skill and vanish into the wilds. Escaped!", "combat");
    state.combat = null;
    updateStats();
    showLocation();
  } else {
    log("You try to flee, but your opponent cuts off your escape!", "combat");
    enemyTurn();
  }
}

function afterPlayerTurn() {
  const c = state.combat;
  if (c.enemy.hp <= 0) {
    winCombat();
    return;
  }
  enemyTurn();
}

function enemyTurn() {
  const c = state.combat;
  c.turnCount += 1;
  if (c.enemy.special && !c.charging && c.turnCount % 3 === 0) {
    c.charging = true;
    c.defending = false;
    log(`⚠ ${c.enemy.name} gathers qi — a terrible strike is coming! <b>(Defend!)</b>`, "combat");
    updateStats();
    combatMenu();
    return;
  }
  let dmg = c.enemy.atk + rand(5) - Math.floor(state.agi / 4) - armorDef();
  dmg = Math.max(1, dmg);
  if (c.charging) {
    c.charging = false;
    dmg *= 2;
    log(`${c.enemy.name} unleashes the charged strike!`, "combat");
  }
  if (c.defending) {
    dmg = Math.ceil(dmg / 2);
    c.defending = false;
    log(`${c.enemy.name} attacks — you block, taking only <b>${dmg}</b> damage.`, "combat");
  } else {
    log(`${c.enemy.name} attacks — you take <b>${dmg}</b> damage.`, "combat");
  }
  state.hp -= dmg;
  if (hasPassive("jiuyang")) {
    state.mp = Math.min(state.maxMp, state.mp + 5);
  }
  updateStats();
  if (state.hp <= 0) {
    loseCombat();
    return;
  }
  log(`<span class="dim">${c.enemy.name}: ${Math.max(0, c.enemy.hp)}/${c.maxHp} HP — You: ${state.hp}/${state.maxHp} HP</span>`);
  combatMenu();
}

function winCombat() {
  const c = state.combat;
  log(`☠ <b>${c.enemy.name}</b> is defeated!`, "system");
  state.combat = null;
  gainGold(c.enemy.gold);
  gainExp(c.enemy.exp);
  updateStats();
  const onWin = c.opts.onWin;
  if (onWin) onWin();
  else showLocation();
}

function loseCombat() {
  const c = state.combat;
  state.combat = null;
  if (c.opts.sparring) {
    state.hp = 1;
    log("You collapse to one knee — the spar is over.", "combat");
    updateStats();
    if (c.opts.onLose) c.opts.onLose();
    else showLocation();
    return;
  }
  heading("💀 Darkness takes you...");
  log("You wake on a hard bed at Yueyang Inn. A passing physician found you by the roadside and dragged you back — though some silver went missing on the way.", "narration");
  const lost = Math.floor(state.gold * 0.2);
  state.gold -= lost;
  if (lost > 0) log(`Lost <b>${lost}</b> silver.`, "dim");
  state.hp = Math.floor(state.maxHp / 2);
  state.mp = Math.floor(state.maxMp / 2);
  state.location = "inn";
  updateStats();
  showLocation();
}

// ---------- items / shop ----------

function useItem(id) {
  const item = ITEMS[id];
  if (!state.items[id]) return;
  state.items[id] -= 1;
  if (item.fullHeal) {
    state.hp = state.maxHp;
    state.mp = state.maxMp;
    log(`You swallow the ${item.name}. Warmth floods your meridians — fully restored!`, "system");
  } else if (item.heal) {
    state.hp = Math.min(state.maxHp, state.hp + item.heal);
    log(`You use ${item.name}, recovering <b>${item.heal}</b> HP.`, "system");
  }
  updateStats();
}

function openShop(stock, back) {
  heading("🏮 Shop");
  log(`You have <b>${state.gold}</b> silver.`, "dim");
  const actions = stock.map((id) => {
    const item = ITEMS[id];
    return {
      label: `Buy ${item.name} — ${item.price} silver`,
      disabled: state.gold < item.price,
      fn: () => {
        state.gold -= item.price;
        addItem(id);
        log(`Bought ${item.name}. (${item.desc})`, "system");
        updateStats();
        openShop(stock, back);
      },
    };
  });
  actions.push({ label: "⬅ Leave shop", fn: back });
  setActions(actions);
}

// ---------- equipment ----------

function ownedGear() {
  return Object.entries(state.items)
    .filter(([id, n]) => n > 0 && ITEMS[id].kind)
    .map(([id]) => id);
}

function equipMenu() {
  heading("🗡 Equipment");
  const w = state.equip.weapon ? ITEMS[state.equip.weapon].name : "— bare hands —";
  const ar = state.equip.armor ? ITEMS[state.equip.armor].name : "— common clothes —";
  log(`Weapon: <b>${w}</b> (+${weaponAtk()} attack) · Armor: <b>${ar}</b> (−${armorDef()} damage taken)`, "dim");
  const actions = [];
  for (const id of ownedGear()) {
    const item = ITEMS[id];
    const slot = item.kind;
    if (state.equip[slot] === id) continue;
    actions.push({
      label: `Equip ${item.name}`,
      fn: () => {
        state.equip[slot] = id;
        log(`You equip the <b>${item.name}</b>. ${item.desc}`, "system");
        updateStats();
        equipMenu();
      },
    });
  }
  if (state.equip.weapon) {
    actions.push({
      label: "Unequip weapon (fight bare-handed)",
      fn: () => { state.equip.weapon = null; updateStats(); equipMenu(); },
    });
  }
  actions.push({ label: "⬅ Done", fn: showLocation });
  setActions(actions);
}

// ---------- travel ----------

function travelMenu() {
  heading("🗺 Travel");
  const loc = LOCATIONS[state.location];
  const actions = loc.routes.map((dest) => ({
    label: `Go to ${LOCATIONS[dest].name}`,
    fn: () => travelTo(dest),
  }));
  actions.push({ label: "⬅ Stay here", fn: showLocation });
  setActions(actions);
}

function travelTo(dest) {
  const bySea = dest === "taohua" || state.location === "taohua";
  log(`You set out for ${LOCATIONS[dest].name}...`, "narration");
  state.location = dest;
  if (bySea) {
    log("The fisherman sculls you across calm water. No trouble finds you at sea.", "dim");
    showLocation();
    return;
  }
  if (Math.random() < 0.45) {
    const enemyId = Math.random() < 0.5 ? "wolf" : "bandit";
    log("Trouble on the road!", "combat");
    startCombat(enemyId, { onWin: () => { log("You continue on your way.", "dim"); showLocation(); } });
  } else {
    showLocation();
  }
}

// ---------- locations ----------

function showLocation() {
  const loc = LOCATIONS[state.location];
  heading(`📍 ${loc.name}`);
  log(loc.ambient, "narration");
  updateStats();
  setActions(locationActions());
}

function locationActions() {
  let a = [];
  switch (state.location) {
    case "inn": a = innActions(); break;
    case "xiangyang": a = xiangyangActions(); break;
    case "shaolin": a = shaolinActions(); break;
    case "huashan": a = huashanActions(); break;
    case "taohua": a = taohuaActions(); break;
  }
  if (ownedGear().length > 0) {
    a.splice(a.length - 1, 0, { label: "Equipment 🗡", fn: equipMenu });
  }
  return a;
}

function innActions() {
  const a = [];
  a.push({
    label: "Talk to the innkeeper",
    fn: () => {
      if (state.quest === 0) {
        log('Innkeeper: "A masked man with a saber? Aye... he drank here three nights past. Folk call him <b>Ghost-Faced Blade</b> — a killer for hire. I heard him mutter about a duel at the <b>summit of Mount Hua</b>."', "dialog");
        log('Innkeeper: "But listen, young one — that man cut down four constables like reeds. Train yourself first. The Shaolin monks and the heroes of Xiangyang may help those with an upright heart."', "dialog");
        state.quest = 1;
        log("✒ Journal updated.", "system");
        updateStats();
      } else if (state.quest === 1) {
        log('Innkeeper: "Still after Ghost-Faced Blade? They say he trains at the summit of Mount Hua. Don\'t climb until you\'ve mastered real kung fu — and mind the old beggar in the corner. He\'s more than he seems."', "dialog");
      } else {
        log('Innkeeper: "The hero who felled Ghost-Faced Blade drinks free tonight! Well... the first cup, anyway."', "dialog");
      }
      setActions(locationActions());
    },
  });
  if (state.quest >= 1 && !state.flags.gaveChicken) {
    a.push({
      label: "Approach the old beggar in the corner",
      fn: () => {
        state.flags.metHong = true;
        log('An old beggar with a gourd of wine and nine knots on his bamboo staff sniffs the air. "Ahh, the kitchen\'s beggar\'s chicken... In all my years as <b>Hong Qigong</b>, none has baked it better."', "dialog");
        if ((state.items.chicken || 0) > 0) {
          setActions([
            {
              label: "Offer him your Beggar's Chicken 叫花鸡",
              cls: "primary",
              fn: () => {
                state.items.chicken -= 1;
                state.flags.gaveChicken = true;
                log('The old man devours it to the bone, eyes shining. "Good lad! A debt of chicken is a debt of honor. Watch closely — I\'ll show you the first stances of the <b>Dragon-Subduing Palms</b>!"', "dialog");
                log("Through the night, the elder guides your palms — the dragon rises, regrets, and soars.", "narration");
                learnSkill("xianglong");
                setActions(locationActions());
              },
            },
            { label: "⬅ Step away", fn: () => setActions(locationActions()) },
          ]);
          return;
        }
        log('He eyes you sideways: "No chicken, no chat. The kitchen here sells them, you know." <span class="dim">(Buy a Beggar\'s Chicken from the shop, then speak to him again.)</span>', "dialog");
        setActions(locationActions());
      },
    });
  }
  a.push({ label: "Buy goods 🏮", fn: () => openShop(["jinchuang", "chicken", "dahuandan"], showLocation) });
  a.push({
    label: "Rest for the night (10 silver)",
    fn: () => {
      if (state.gold >= 10) {
        state.gold -= 10;
        log("You sleep soundly. HP and inner energy fully restored.", "system");
      } else {
        log('The innkeeper waves a hand: "Pay me when you\'re rich, young hero." You rest for free.', "dialog");
      }
      state.hp = state.maxHp;
      state.mp = state.maxMp;
      updateStats();
      setActions(locationActions());
    },
  });
  a.push({ label: "Travel 🗺", fn: travelMenu });
  return a;
}

function xiangyangActions() {
  const a = [];
  a.push({
    label: "Listen to the storyteller",
    fn: () => {
      log('The storyteller slaps his gavel: "...and Guo Jing, Guardian of Xiangyang, held the wall with the Dragon-Subduing Palms! They say his old master Hong Qigong still wanders the land, trading kung fu for good food..."', "dialog");
      log('"...and on Mount Hua, where the greats once dueled for the title of strongest, a ghost-masked saber now haunts the summit. No pilgrim dares the peak."', "dialog");
      setActions(locationActions());
    },
  });
  a.push({
    label: "Join the militia drills (train: +20 exp, −12 HP)",
    disabled: state.hp <= 12,
    fn: () => {
      state.hp = Math.max(1, state.hp - 12);
      log("You drill with the militia until your arms burn. The drillmaster nods: \"Not bad, wanderer.\"", "narration");
      gainExp(20);
      setActions(locationActions());
    },
  });
  a.push({ label: "Visit the market 🏮", fn: () => openShop(["jinchuang", "dahuandan", "ironsword", "buji"], showLocation) });
  a.push({
    label: "Hire a boat to Peach Blossom Island (30 silver) ⛵",
    disabled: state.gold < 30,
    fn: () => {
      state.gold -= 30;
      log('The old fisherman squints at the horizon: "The Isle? Folk say its lord turns visitors around with paths that walk in circles. Your silver, your funeral."', "dialog");
      updateStats();
      travelTo("taohua");
    },
  });
  a.push({ label: "Travel 🗺", fn: travelMenu });
  return a;
}

function taohuaActions() {
  const a = [];
  if (!state.flags.mazeSolved) {
    a.push({
      label: "🌸 Enter the Peach Blossom Maze",
      fn: () => {
        if (state.wis >= 12) {
          state.flags.mazeSolved = true;
          log("Every path curls back on itself — until you notice the petals: they drift with a breeze that should not reach the orchard floor. You follow the wind against the paths, and the maze opens like a folding screen.", "narration");
          log("Beyond the last hedge, the flute-song stops.", "dim");
        } else {
          state.hp = Math.max(1, state.hp - 15);
          state.wis += 1;
          log("The paths fold you back to the shore again and again. Bruised by hidden mechanisms, you sketch what you walked in the sand — the pattern is starting to make sense. <b>+1 Insight</b> (reach 12 to solve the maze).", "narration");
          gainExp(10);
        }
        updateStats();
        setActions(locationActions());
      },
    });
  } else if (!state.flags.isleDuel) {
    a.push({
      label: "🎶 Answer the flute's summons — duel the Lord of the Isle",
      cls: "primary",
      fn: () => {
        startCombat("huangdao", {
          canFlee: false,
          sparring: true,
          onWin: () => {
            state.flags.isleDuel = true;
            log('The lord lowers his flute, something like approval in his cold eyes. "Solved my maze, stood against my hand. The jianghu is less dull than I feared."', "dialog");
            log('"Take this soft armor — my daughter has no patience for gifts. And watch my finger: once is all I will show you."', "dialog");
            addItem("ruanwei");
            log("Received the Hedgehog Armor 软猬甲.", "system");
            learnSkill("tanzhi");
            showLocation();
          },
          onLose: () => {
            log('The lord turns away, flute resuming mid-phrase. "Come back when your kung fu is worth interrupting a song."', "dialog");
            showLocation();
          },
        });
      },
    });
  } else {
    a.push({
      label: "Practice the Flicking Finger among the blossoms (+15 exp, −8 energy)",
      disabled: state.mp < 8,
      fn: () => {
        state.mp -= 8;
        log("You flick petals from the air one by one, each snap of the finger sharper than the last.", "narration");
        gainExp(15);
        setActions(locationActions());
      },
    });
  }
  a.push({ label: "Travel 🗺", fn: travelMenu });
  return a;
}

function shaolinActions() {
  const a = [];
  if (!state.flags.sparWon) {
    a.push({
      label: "Request a sparring match with Monk Xuancheng",
      fn: () => {
        log("The warrior monk sets down his broom and bows.", "narration");
        startCombat("monk", {
          canFlee: false,
          sparring: true,
          onWin: () => {
            state.flags.sparWon = true;
            log('Xuancheng laughs and clasps his palms: "Splendid! Your foundation is solid. Stay a while — the temple could use a righteous hand."', "dialog");
            showLocation();
          },
          onLose: () => {
            log('Xuancheng helps you up. "Strength grows from defeat. Rest, train in Xiangyang, and try again, young donor."', "dialog");
            showLocation();
          },
        });
      },
    });
  } else if (!state.flags.rogueDefeated) {
    a.push({
      label: "⚠ A commotion — a renegade flees the Scripture Pavilion!",
      cls: "danger",
      fn: () => {
        log("Shouts erupt — a renegade disciple bursts from the Scripture Pavilion clutching a stolen manual, striking down two monks. He is heading for the gate you stand before!", "narration");
        startCombat("rogue", {
          canFlee: false,
          onWin: () => {
            state.flags.rogueDefeated = true;
            log('The abbot arrives, retrieving the stolen scroll. "Young donor, you have done Shaolin a great service. This manual he stole — the <b>Nine Yang Manual</b> — cannot leave the temple. But sit with me seven days, and I will transmit its first chapter to you."', "dialog");
            log("Seven days of meditation pass like water. Warm currents circle your dantian.", "narration");
            learnSkill("jiuyang");
            showLocation();
          },
        });
      },
    });
  }
  a.push({
    label: "Sit in meditation (restore inner energy, +20 HP)",
    fn: () => {
      state.mp = state.maxMp;
      state.hp = Math.min(state.maxHp, state.hp + 20);
      log("You breathe with the chanting of the hall. Your inner energy settles and brims.", "narration");
      updateStats();
      setActions(locationActions());
    },
  });
  a.push({ label: "Travel 🗺", fn: travelMenu });
  return a;
}

function huashanActions() {
  const a = [];
  if (!state.flags.chiefDefeated) {
    a.push({
      label: "⚠ Bandits are robbing pilgrims on the mountain path",
      cls: "danger",
      fn: () => {
        log("On the plank path, a bandit chief shakes down a family of pilgrims. He turns his saber toward you.", "narration");
        startCombat("banditChief", {
          onWin: () => {
            state.flags.chiefDefeated = true;
            log("The pilgrims kowtow in thanks and press dried rations into your hands. Above, on a pine ledge, an old man in a green robe watched it all.", "narration");
            addItem("jinchuang", 2);
            log("Received 2× Healing Salve.", "system");
            showLocation();
          },
        });
      },
    });
  } else if (!hasSkill("huashan")) {
    a.push({
      label: "Climb to the pine ledge — the old man beckons",
      cls: "primary",
      fn: () => {
        log('The old hermit strokes his beard: "I am <b>Feng, a hermit of Huashan</b>. Your heart is upright, your wrist quick — but your sword-sense is mud. Sword lives in the mind, not the blade. Watch once. Forget the stances; keep the intent."', "dialog");
        log("He traces one flowing line with a pine branch. In that single stroke you glimpse a hundred variations.", "narration");
        learnSkill("huashan");
        setActions(locationActions());
      },
    });
  }
  if (state.quest === 2 && !state.flags.tianxia) {
    const next = LADDER.find((l) => !state.flags[l.flag]);
    a.push({
      label: `🏆 Sword Summit 华山论剑 — challenge ${ENEMIES[next.id].name}`,
      cls: "primary",
      fn: () => {
        heading("🏆 华山论剑 — The Sword Summit");
        log("Word of your victory has spread. The legends of the age have climbed Mount Hua to test the new generation — in honorable duels, to first fall.", "narration");
        startCombat(next.id, {
          canFlee: false,
          sparring: true,
          onWin: () => {
            state.flags[next.flag] = true;
            next.reward();
            showLocation();
          },
          onLose: () => {
            log(`${ENEMIES[next.id].name} helps you up with surprising gentleness. "Close. Train, eat, sleep — then climb again."`, "dialog");
            showLocation();
          },
        });
      },
    });
  }
  if (state.quest === 1) {
    a.push({
      label: "⛰ Climb to the summit — face Ghost-Faced Blade",
      cls: "danger",
      fn: () => {
        if (state.level < 4 && !state.flags.summitWarned) {
          state.flags.summitWarned = true;
          log('A woodcutter grabs your sleeve: "Don\'t, young one! That masked devil split a boulder with one cut! You are not ready." <span class="dim">(He seems to be right — reaching Level 4+ and learning stronger arts first is wise. Choose the summit again to ignore him.)</span>', "dialog");
          setActions(locationActions());
          return;
        }
        heading("⛰ The Summit of Mount Hua");
        log("Cloud-sea churns below the lone peak where legends once dueled. Your master's face passes before your eyes. You step onto the summit stone.", "narration");
        startCombat("boss", {
          canFlee: false,
          onWin: endingVictory,
        });
      },
    });
  }
  a.push({ label: "Travel 🗺", fn: travelMenu });
  return a;
}

// ---------- ending & sword summit ----------

const LADDER = [
  {
    id: "xidu", flag: "ladder1",
    reward: () => {
      log('The white-haired man cackles, delighted and furious at once. "Not bad, not bad! Here — a pill I definitely did not poison." He is probably joking.', "dialog");
      addItem("dahuandan");
      log("Received a Great Restoration Pill.", "system");
    },
  },
  {
    id: "dongxie", flag: "ladder2",
    reward: () => {
      log('The East Heretic plays a slow, approving phrase on his flute. "Rules are for the mediocre — and you have stopped being mediocre. Take this blade; it deserves better than my wall."', "dialog");
      addItem("greenedge");
      log("Received the Greenedge Sword 青锋剑.", "system");
    },
  },
  {
    id: "beigai", flag: "ladder3",
    reward: () => {
      state.flags.tianxia = true;
      heading("🏆 天下第一 — First Under Heaven");
      log('Hong Qigong roars with laughter, rubbing his shoulder. "The palms have found their next keeper! Venom! Heretic! Come drink — the young one buys the chicken!"', "dialog");
      log("On the summit stone where the greats once dueled, the legends of the age bow to you — <b>First Under Heaven</b>. Your master's little school lives on, at the very top of the jianghu.", "narration");
      log("🎉 <b>You have cleared everything this build has to offer.</b> The jianghu keeps turning — wander as you please.", "system");
    },
  },
];

function endingVictory() {
  state.quest = 2;
  heading("🏔 恩仇了却 — The Debt Is Settled");
  log("The ghost mask cracks and falls away. The saber drops from his hand and rings against the summit stone.", "narration");
  log('"Your master... beat me fair on this peak, twenty years ago," he rasps. "I took the coward\'s road for revenge. His student has now beaten me fair in turn... it is... enough."', "dialog");
  log("He turns and descends into the cloud-sea, saber left behind. You stand alone at the summit as the sun breaks over the sea of clouds. Your master is avenged — not with murder, but with mastery.", "narration");
  addItem("guitou");
  log("You take up the Ghost-Head Saber 鬼头刀 he left behind.", "system");
  log("🎉 <b>The story is complete — but the summit is not quiet for long.</b> Word travels fast in the jianghu; the legends of the age are coming to Mount Hua to test you. (A new challenge awaits here.)", "system");
  updateStats();
  setActions([
    { label: "Continue wandering the jianghu", fn: showLocation },
    { label: "🔄 Restart", fn: resetGame },
  ]);
}

// ---------- intro / character creation ----------

function startIntro() {
  heading("金庸群侠传 · A Wuxia Tale");
  log("Rain hammers the ruined courtyard of your master's school. You buried him at dawn — cut down by a masked stranger whose saber you will never forget.", "narration");
  log("With fifty taels of silver and the fist art he taught you, you walk out the broken gate into the rivers and lakes — the <b>jianghu</b>.", "narration");
  log("Who were you, before this day?", "system");
  setActions([
    { label: "Farmer's child 农家子 (+Strength, +HP)", fn: () => pickName("farmer") },
    { label: "Scholar's child 书香门第 (+Insight, +Energy)", fn: () => pickName("scholar") },
    { label: "Hunter's child 猎户子 (+Agility)", fn: () => pickName("hunter") },
  ]);
}

function pickName(origin) {
  const name = (prompt("What is your name, young hero?", "少侠") || "少侠").trim() || "少侠";
  state = newState(name, origin);
  log(`You are <b>${name}</b>. The road bends toward Yueyang Inn, where the killer was last seen.`, "narration");
  updateStats();
  showLocation();
}

// ---------- boot ----------

$("btn-save").onclick = saveGame;
$("btn-load").onclick = loadGame;
$("btn-reset").onclick = resetGame;

if (localStorage.getItem(SAVE_KEY)) {
  heading("金庸群侠传 · A Wuxia Tale");
  log("A saved journey exists.", "system");
  setActions([
    { label: "📂 Continue journey", cls: "primary", fn: loadGame },
    { label: "🆕 New journey", fn: () => { $("log").innerHTML = ""; startIntro(); } },
  ]);
} else {
  startIntro();
}
