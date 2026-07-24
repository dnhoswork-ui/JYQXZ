# 金庸群侠传 · JYQXZ — A Wuxia Tale (MVP)

A browser-based, menu-driven wuxia RPG inspired by the novels of Jin Yong (金庸).
Zero dependencies, zero build step — pure HTML/CSS/JS.

## Play

Open `index.html` in any modern browser. That's it.

Or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## The story

Your master was cut down by a masked killer known only as **Ghost-Faced Blade
(鬼面刀)**. With nothing but silver, a basic fist art, and an upright heart, you
enter the jianghu to train, learn the great martial arts, and face him in a
duel at the summit of Mount Hua (华山).

## MVP scope (what's in this version)

| Feature | Details |
|---|---|
| Character creation | Choose a name and one of 3 origins (farmer / scholar / hunter) with different stat bonuses |
| Core stats | 气血 HP, 内力 inner energy, 臂力 strength, 身法 agility, 悟性 insight, level & EXP, silver |
| World | 4 locations — Yueyang Inn, Xiangyang City, Shaolin Temple, Mount Hua — with random road encounters (wolves, bandits) |
| Turn-based combat | Skill attacks, defend (recovers inner energy), items, flee, critical hits; losing is non-fatal (rescued back to the inn) |
| Martial arts | Taizu Long Fist 太祖长拳 → Huashan Sword Art 华山剑法 → Dragon-Subduing Palms 降龙十八掌, plus the Nine Yang Inner Art 九阳神功 passive |
| Jin Yong flavor | Feed beggar's chicken to Hong Qigong 洪七公 to learn the Palms; defend Shaolin's Scripture Pavilion to receive the Nine Yang Manual's first chapter; a Huashan sword hermit teaches "intent over stances" |
| Quests | A 3-beat main quest (investigate → grow stronger → summit duel) plus side encounters that each teach a skill |
| Progression | Leveling with stat growth, a shop, healing items, training grind option |
| Persistence | Save / load via `localStorage` |

## Suggested roadmap (post-MVP)

1. **More depth per system** — skill levels (练到十成), weapon types, equipment,
   internal-art switching, meridian/acupoint upgrades.
2. **More world** — Peach Blossom Island, Beggars' Sect assembly, Wudang;
   faction reputation (正/邪 morality axis like the classic *Heroes of Jin Yong*).
3. **Companions & famous heroes** — recruitable NPCs, sparring tournaments,
   华山论剑 endgame ladder.
4. **Data-driven content** — move story/dialogue into JSON so writers can add
   quests without touching engine code.
5. **Polish** — sound, ink-brush art, animated combat log, mobile layout,
   cloud saves.

## Project layout

```
index.html   — page shell (stats panel, log, action buttons)
style.css    — ink-wash dark theme
js/data.js   — static data: skills, items, enemies, locations
js/game.js   — engine: state, UI, exploration, combat, save/load
```
