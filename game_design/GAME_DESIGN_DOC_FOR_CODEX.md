# GoalPop Arena Web
## Game Design Document for Codex

## 1. Product Summary

**Working title:** GoalPop Arena Web  
**Genre:** Casual 1v1 arcade soccer  
**Platform:** Mobile web first, desktop web supported  
**Session length:** 1 to 3 minutes  
**Primary fantasy:** Score ridiculous goals with exaggerated big-head characters, punchy movement, and flashy special shots.

This project should capture the broad appeal of lightweight arcade soccer:
- immediate controls
- simple rules
- memorable characters
- short repeatable matches
- dramatic goals and special moves

The game must remain **original**. It may borrow the high-level genre formula, but it must not copy:
- real athlete likenesses
- copyrighted character art
- specific UI compositions
- existing game names, logos, or branding

---

## 2. Design Goals

### Goal A — Instant readability
The player should understand the game in less than 10 seconds:
- move left/right
- jump
- kick
- score goals before time runs out

### Goal B — Strong game feel
The game should feel satisfying through:
- clean input response
- strong ball bounce
- chunky impact feedback
- readable special moves
- fast rematches

### Goal C — Mobile-web practicality
The game should be easy to ship as a webapp:
- lightweight runtime
- low asset complexity
- simple local save
- touch-first UI
- short loading time

### Goal D — Original identity
The game should feel inspired by the big-head soccer subgenre, but stand apart through:
- original roster
- fictional teams / badges
- original UI language
- distinct special-move themes

---

## 3. Target Audience

### Primary
- ages 8 to 25
- casual mobile players
- players who enjoy fast sports minigames
- players who like funny, exaggerated characters

### Secondary
- desktop browser players seeking quick breaks
- streamers or students sharing a simple game link
- players who prefer short sessions and low commitment

---

## 4. Core Experience Pillars

1. **Big head, small body, big reactions**
2. **One-button-understandable action**
3. **Goals must feel explosive**
4. **The UI must be readable from arm’s length on a phone**
5. **Every match should produce at least one “that was ridiculous” moment**

---

## 5. Platform and Input

### Orientation
- landscape-first on mobile
- desktop allowed with keyboard
- portrait mode should show a rotate prompt

### Mobile touch controls
- left
- right
- jump
- kick
- special (only when charged, or merged into kick if design chooses fewer buttons)

### Desktop keyboard default
- A / D = move
- W = jump
- Space = kick
- Shift = special

Optional local desktop mode can add:
- Arrow Left / Arrow Right / Arrow Up / Enter for player 2

---

## 6. High-Level Game Loop

1. Open webapp
2. Title screen
3. Quick tutorial prompt or first-time overlay
4. Character select
5. Match start intro
6. 45-second match
7. Result screen
8. Reward coins / progress
9. Rematch or return to menu

This loop should be tight enough that a player can complete:
- one full session in under 3 minutes
- several rematches without friction

---

## 7. MVP Scope

## Must-have
- title screen
- tutorial / controls overlay
- character select
- match scene
- result scene
- 4 original characters
- 2 stadiums
- 1 ball type
- 4 special-move archetypes
- CPU opponent
- local save for unlocks and settings
- audio toggle
- simple sound effects and goal celebration

## Nice-to-have
- local 2P on desktop
- daily reward
- character mastery levels
- alternate ball skins
- weather effects
- tournament ladder

## Not in MVP
- online multiplayer
- account system
- cloud save
- real licensing
- character gacha
- heavy cosmetics pipeline

---

## 8. Match Rules

### Match format
- 1v1 side-view soccer
- default match time: 45 seconds
- player with more goals at time end wins

### Tie handling
Choose one:
1. sudden death golden goal
2. 15-second overtime
3. draw allowed for quick match

**Recommended for MVP:** 15-second overtime, then sudden-death first goal if still tied.

### Scoring
- ball crossing full goal line counts as a goal
- after goal:
  - freeze frame 100 to 200 ms
  - goal VFX and SFX
  - score update
  - brief reset to kickoff positions

### Win rewards
- win: more coins + streak bonus
- loss: small consolation coins
- first win with each character: bonus

---

## 9. Core Gameplay Systems

## 9.1 Player movement
- horizontal move left/right
- short hop or medium jump
- quick landing recovery
- no realistic momentum requirements
- movement should feel arcade-sharp

## 9.2 Kick
- short-range frontal kick
- active hitbox for a brief frame window
- stronger impulse if timed near peak contact
- air kick allowed

## 9.3 Special
Each character owns one special ability. Specials should be:
- easy to identify visually
- strong but not match-breaking
- balanced around cooldown or meter

### Example special archetypes
- Fire Shot: powerful flaming ball impulse
- Wall Block: temporary front barrier
- Dash Kick: short burst into the ball
- Magnet Curve: slight pull or bend effect

## 9.4 Ball behavior
- circular physics body
- strong bounce but readable arc
- capped max velocity
- slight dampening after repeated rapid contacts
- special states: flaming, frozen, shielded, heavy

## 9.5 Goal reset
After scoring:
- brief celebration pause
- players return to default x positions
- ball respawns center
- 1 second kickoff countdown

---

## 10. Difficulty and CPU Design

### MVP CPU levels
- Easy
- Normal
- Hard

### CPU behavior should be FSM-based
States:
- idle reposition
- chase ball
- defend goal
- contest airborne ball
- prepare kick
- use special
- emergency clear

### CPU design goals
- Easy should miss obvious opportunities
- Normal should feel competitive but beatable
- Hard should position intelligently, not cheat blatantly

### Anti-frustration rules
- no unfair speed boosts hidden from the player
- respect cooldowns
- occasional reaction delay
- avoid perfect interception every time

---

## 11. Character Design Direction

Characters should be:
- fictional
- stylized
- readable
- exaggerated

### Visual ratio
- oversized head
- compact torso
- compact limbs
- big shoes / gloves optional
- strong silhouette

### MVP roster direction
1. **Blaze** — striker theme, fire shot
2. **Bolt** — speed theme, dash kick
3. **Atlas** — defender theme, wall block
4. **Ripple** — trickster theme, curve control

All characters must be original and avoid resembling real athletes.

---

## 12. World / Environment Direction

### Stadium style
- toy-like, colorful, slightly exaggerated
- crowd implied with loops rather than detailed individuals
- field lines thick and readable
- goals chunky and clear
- background should not distract from the ball

### Stadium variants for MVP
- Sunset Arena
- Neon Night Arena

Optional later:
- rooftop
- beach
- festival
- snow dome

---

## 13. UI / UX Direction

### Core style
- thick outlines
- bold blocky typography
- saturated accent colors
- large buttons
- soft gradients allowed
- playful sports-TV energy without realism

### Mandatory screens
- title
- tutorial
- character select
- match HUD
- pause
- results

### HUD elements
- score left/right
- timer center
- special meter near player side or near action buttons
- pause button
- mute button

### UX rules
- maximum one primary CTA per screen
- minimal small text
- touch targets >= comfortable thumb size
- key actions always near bottom corners on mobile

---

## 14. Progression and Economy

Keep progression light.

### Currency
- coins earned by matches
- used to unlock characters and stadium skins

### Unlock logic
- first two characters free
- next two unlock through coin milestones
- stadium skins unlock through total goals or wins

### Do not overcomplicate
No hard economy loops for MVP. Keep it simple and reward-driven.

---

## 15. Audio Direction

### Core sound set
- menu tap
- jump
- kick
- heavy ball hit
- wall bounce
- goal
- special charge
- special activation
- crowd swell
- win / lose jingle

### Audio rules
- short, punchy, low-latency
- avoid audio clutter
- allow mute toggle at all times

---

## 16. Art Constraints

### Keep assets lightweight
- reuse stadium layers
- use sprite sheets
- keep frame counts efficient
- do not rely on giant textures

### Character animation constraints
For MVP, each character only needs:
- idle
- run
- jump
- kick
- special
- goal celebration
- defeat pose

Use minimal frames with strong key poses.

---

## 17. Technical Recommendation

## Engine
**Recommended:** Phaser 3 with TypeScript

### Why
- good fit for 2D arcade gameplay
- easy scene management
- easy input handling
- simple deployment for web
- enough performance for this scope

### Physics
Use Arcade Physics unless a must-have mechanic clearly needs something more complex.

### Save
Use localStorage for:
- unlocked characters
- coins
- settings
- best stats

---

## 18. Suggested Repository Structure

```text
src/
  core/
  config/
  scenes/
  systems/
  entities/
  ui/
  audio/
  assets/
public/
```

Detailed structure is defined in IMPLEMENTATION_SPEC.md.

---

## 19. Performance Targets

### Target devices
- recent mid-tier Android devices
- recent iPhones
- standard laptop browsers

### Goals
- 60 FPS target on most supported devices
- 30 FPS acceptable fallback on weak devices
- first playable load should feel quick
- avoid excessive particle systems
- cap simultaneous effects

### Asset budget direction
- compress images
- use atlases
- keep initial load lean
- lazy-load optional stadium skins if needed

---

## 20. Visual Identity Rules

This game should be **inspired by the genre**, not be mistaken for an existing title.

### Do
- use original character silhouettes
- use fictional symbols and color palettes
- invent new special effects and buttons
- build original title branding

### Do not
- copy real athlete faces
- copy team badges
- copy exact screen layouts
- replicate another game’s logo or text treatment one-to-one

---

## 21. Success Metrics for MVP

A successful MVP should satisfy:
- players can start a match in under 20 seconds
- controls feel understandable immediately
- goals feel exciting
- CPU is fun on normal mode
- art is readable on phone screens
- players want “one more match”

---

## 22. Production Milestones

### Milestone 1 — Graybox
- basic physics
- placeholder characters
- goal detection
- timer
- score
- restart flow

### Milestone 2 — Playable MVP
- touch controls
- CPU AI
- special moves
- title + character select + results
- original art pass 1
- sound pass 1

### Milestone 3 — Polish
- juice pass
- camera shake / hit stop
- particles
- extra stadium
- unlock progression
- tutorial polish
- performance optimization

---

## 23. Non-Goals

- realistic soccer simulation
- advanced tactics
- licensed football content
- online esports depth
- large narrative systems

---

## 24. Codex Execution Guidance

When using Codex:
1. implement graybox gameplay first
2. tune feel before expanding content
3. keep data in config files
4. validate mobile controls early
5. treat original art direction as a hard requirement
6. avoid chasing feature creep before the first complete loop is playable

---

## 25. Final Product Statement

Build an original, lightweight, funny, replayable 1v1 arcade soccer webapp where oversized stylized characters jump, kick, and unleash memorable special shots in short matches that feel great on mobile and desktop browsers.