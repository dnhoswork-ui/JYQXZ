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

## Features

| Feature | Details |
|---|---|
| Character creation | Choose a name and one of 3 origins (farmer / scholar / hunter) with different stat bonuses |
| Core stats | 气血 HP, 内力 inner energy, 臂力 strength, 身法 agility, 悟性 insight, level & EXP, silver |
| World | 5 locations — Yueyang Inn, Xiangyang City, Shaolin Temple, Mount Hua, Peach Blossom Island (by boat) — with random road encounters |
| Turn-based combat | Skill attacks, defend (recovers inner energy), items, flee, criticals; bosses telegraph charged strikes you must defend against; losing is non-fatal (rescued back to the inn) |
| Martial arts | Taizu Long Fist 太祖长拳 · Huashan Sword Art 华山剑法 · Dragon-Subduing Palms 降龙十八掌 · Divine Flicking Finger 弹指神通 (armor-piercing) · Nine Yang Inner Art 九阳神功 passive |
| Skill proficiency 练度 | Every use trains a skill from 一成 to 十成 mastery, scaling its damage up to +54% |
| Equipment | Weapon & armor slots — buy an iron sword and padded jacket in Xiangyang; earn the Hedgehog Armor 软猬甲, Greenedge Sword 青锋剑, and Ghost-Head Saber 鬼头刀 through play |
| Jin Yong flavor | Feed beggar's chicken to Hong Qigong 洪七公 to learn the Palms; defend Shaolin's Scripture Pavilion for the Nine Yang Manual; a Huashan hermit teaches "intent over stances"; solve the Peach Blossom Maze (an Insight puzzle) and duel the isle's flute-playing lord |
| Quests | A 3-beat main quest (investigate → grow stronger → summit duel), side encounters that each teach a skill, and a post-game 华山论剑 Sword Summit ladder against the legends of the age for the title 天下第一 |
| Progression | Leveling with stat growth, shops, healing items, training grinds in Xiangyang and on the Isle |
| Persistence | Save / load via `localStorage`, with automatic migration of older saves |

## Suggested roadmap (next)

1. **Internal-art switching & meridian upgrades** — multiple cultivation paths
   with tradeoffs, acupoint unlocks spending proficiency.
2. **Faction reputation** — a 正/邪 morality axis like the classic
   *Heroes of Jin Yong*, with choices that open or close questlines.
3. **Companions** — recruitable NPCs who join your battles.
4. **Data-driven content** — move story/dialogue into JSON so writers can add
   quests without touching engine code.
5. **Polish** — sound, ink-brush art, animated combat, mobile layout, cloud saves.

## Project layout

```
index.html   — page shell (stats panel, log, action buttons)
style.css    — ink-wash dark theme
js/data.js   — static data: skills, items, enemies, locations
js/game.js   — engine: state, UI, exploration, combat, save/load
```
