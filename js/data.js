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
    boss: true,
    intro: "Atop the summit stands a figure in a ghost mask, saber gleaming with cold light. \"So the old man's whelp has come to die too.\"",
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
};
