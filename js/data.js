// Static game data: skills, items, enemies, locations.

const SKILLS = {
  taizu: {
    id: "taizu",
    name: "Taizu Long Fist 太祖长拳",
    mpCost: 0,
    mult: 1.0,
    desc: "The common fist art every wanderer knows. Costs no inner energy.",
  },
  huashan: {
    id: "huashan",
    name: "Huashan Sword Art 华山剑法",
    mpCost: 6,
    mult: 1.6,
    desc: "Swift, upright swordplay of the Huashan School.",
  },
  xianglong: {
    id: "xianglong",
    name: "Dragon-Subduing Palms 降龙十八掌",
    mpCost: 14,
    mult: 2.4,
    desc: "The Beggars' Sect's supreme palm art. 亢龙有悔!",
  },
  jiuyang: {
    id: "jiuyang",
    name: "Nine Yang Inner Art 九阳神功 (passive)",
    passive: true,
    desc: "Deep inner cultivation: +30 max inner energy, +20% damage, regenerates energy each turn.",
  },
  tanzhi: {
    id: "tanzhi",
    name: "Divine Flicking Finger 弹指神通",
    mpCost: 10,
    mult: 2.0,
    pierce: true,
    desc: "A single flicked finger that slips past any guard — ignores the enemy's defense.",
  },
};

const ITEMS = {
  jinchuang: {
    id: "jinchuang",
    name: "Healing Salve 金创药",
    price: 20,
    desc: "Restores 40 HP.",
    heal: 40,
  },
  dahuandan: {
    id: "dahuandan",
    name: "Great Restoration Pill 大还丹",
    price: 120,
    desc: "Fully restores HP and inner energy.",
    fullHeal: true,
  },
  chicken: {
    id: "chicken",
    name: "Beggar's Chicken 叫花鸡",
    price: 30,
    desc: "Fragrant chicken baked in lotus leaves and clay. Restores 30 HP... or tempts a certain gluttonous elder.",
    heal: 30,
  },
  ironsword: {
    id: "ironsword",
    name: "Iron Sword 铁剑",
    price: 80,
    kind: "weapon",
    atk: 5,
    desc: "A plain but honest blade. +5 attack.",
  },
  buji: {
    id: "buji",
    name: "Padded Jacket 布甲",
    price: 60,
    kind: "armor",
    def: 3,
    desc: "Quilted cloth armor. −3 damage taken.",
  },
  greenedge: {
    id: "greenedge",
    name: "Greenedge Sword 青锋剑",
    kind: "weapon",
    atk: 12,
    desc: "A sword of green-tinged steel, gift of the East Heretic. +12 attack.",
  },
  ruanwei: {
    id: "ruanwei",
    name: "Hedgehog Armor 软猬甲",
    kind: "armor",
    def: 8,
    desc: "The famed soft armor of Peach Blossom Isle. −8 damage taken.",
  },
  guitou: {
    id: "guitou",
    name: "Ghost-Head Saber 鬼头刀",
    kind: "weapon",
    atk: 15,
    desc: "The heavy saber Ghost-Faced Blade left on the summit. +15 attack.",
  },
};

const ENEMIES = {
  wolf: {
    id: "wolf",
    name: "Grey Wolf 野狼",
    hp: 32, atk: 9, def: 1, agi: 6,
    exp: 25, gold: 0,
    intro: "A grey wolf lunges from the roadside brush, fangs bared!",
  },
  bandit: {
    id: "bandit",
    name: "Highway Bandit 剪径山贼",
    hp: 45, atk: 10, def: 2, agi: 4,
    exp: 35, gold: 25,
    intro: '"This road was opened by me, this tree was planted by me! Leave your silver!"',
  },
  banditChief: {
    id: "banditChief",
    name: "Bandit Chief 山寨头目",
    hp: 70, atk: 14, def: 3, agi: 5,
    exp: 70, gold: 60,
    intro: "A scarred brute hefts a saber. \"A fledgling hero? I'll cut those wings.\"",
  },
  monk: {
    id: "monk",
    name: "Shaolin Monk Xuancheng 玄澄禅师",
    hp: 65, atk: 11, def: 4, agi: 7,
    exp: 60, gold: 0,
    sparring: true,
    intro: '"Amitabha. Show me your resolve, young donor — I shall not hold back."',
  },
  rogue: {
    id: "rogue",
    name: "Renegade Disciple 叛门弟子",
    hp: 90, atk: 15, def: 4, agi: 8,
    exp: 110, gold: 80,
    intro: '"The scripture pavilion\'s manuals will make me invincible! Out of my way!"',
  },
  boss: {
    id: "boss",
    name: "Ghost-Faced Blade 鬼面刀",
    hp: 220, atk: 22, def: 6, agi: 10,
    exp: 500, gold: 300,
    boss: true, special: true,
    intro: "Atop the summit stands a figure in a ghost mask, saber gleaming with cold light. \"So the old man's whelp has come to die too.\"",
  },
  huangdao: {
    id: "huangdao",
    name: "Lord of Peach Blossom Isle 桃花岛主",
    hp: 140, atk: 19, def: 5, agi: 12,
    exp: 200, gold: 0,
    sparring: true,
    intro: "Jade flute in hand, the green-robed lord regards you coldly. \"You solved my maze. Now show me your kung fu is worth the trespass.\"",
  },
  xidu: {
    id: "xidu",
    name: "Venom of the West 西毒",
    hp: 240, atk: 24, def: 6, agi: 11,
    exp: 300, gold: 0,
    sparring: true, special: true,
    intro: 'A white-haired man descends the cliff head-first like a gecko. "A new generation dares the summit? Taste the Toad Stance!"',
  },
  dongxie: {
    id: "dongxie",
    name: "East Heretic 东邪",
    hp: 280, atk: 26, def: 7, agi: 13,
    exp: 400, gold: 0,
    sparring: true, special: true,
    intro: 'Flute-song drifts on the cloud-sea. "Rules are for the mediocre," the green-robed master says. "Let us see if you are worth breaking one for."',
  },
  beigai: {
    id: "beigai",
    name: "Hong Qigong, North Beggar 北丐洪七公",
    hp: 320, atk: 27, def: 7, agi: 12,
    exp: 500, gold: 0,
    sparring: true, special: true,
    intro: '"Ho! The chicken lad!" The old beggar tosses his gourd aside and grins. "Show me what my palms have become in your hands. Hold nothing back!"',
  },
};

// Travel routes and ambient text. Location behavior lives in game.js.
const LOCATIONS = {
  inn: {
    id: "inn",
    name: "Yueyang Inn 岳阳客栈",
    ambient: "Lamplight flickers over worn tables. The smell of rice wine and roast chicken drifts from the kitchen.",
    routes: ["xiangyang", "shaolin", "huashan"],
  },
  xiangyang: {
    id: "xiangyang",
    name: "Xiangyang City 襄阳城",
    ambient: "Banners snap over the city walls. Militiamen drill in the square; the market bustles despite wartime.",
    routes: ["inn", "shaolin", "huashan"],
  },
  shaolin: {
    id: "shaolin",
    name: "Shaolin Temple 少林寺",
    ambient: "Chanting echoes among ancient pines. Monks sweep the stone steps of the thousand-year temple.",
    routes: ["inn", "xiangyang", "huashan"],
  },
  huashan: {
    id: "huashan",
    name: "Mount Hua 华山",
    ambient: "Knife-edge cliffs vanish into cloud. A plank path clings to the rock face, leading toward the summit.",
    routes: ["inn", "xiangyang", "shaolin"],
  },
  taohua: {
    id: "taohua",
    name: "Peach Blossom Island 桃花岛",
    ambient: "Petals drift over paths that fork and fork again. Somewhere beyond the orchard, a jade flute is playing.",
    routes: ["xiangyang"],
  },
};
