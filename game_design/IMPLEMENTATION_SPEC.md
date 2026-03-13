# GoalPop Arena Web
## Implementation Specification

## 1. Recommended Stack

- Vite
- TypeScript
- Phaser 3
- localStorage
- optional Howler.js for audio convenience
- optional ESLint + Prettier + Vitest

Keep dependencies minimal. The gameplay loop should not depend on React unless there is a strong reason to wrap menu UI outside Phaser.

---

## 2. Runtime Structure

### Scene order
1. BootScene
2. PreloadScene
3. TitleScene
4. CharacterSelectScene
5. MatchScene
6. ResultScene
7. Optional SettingsScene / TutorialOverlay

### Global managers
- `GameConfigService`
- `SaveService`
- `AudioService`
- `InputService`
- `SceneRouter`
- `TelemetryService` (optional lightweight analytics wrapper)

---

## 3. Suggested Repository Layout

```text
src/
  main.ts
  game/
    GameApp.ts
    constants/
      balance.ts
      ui.ts
      physics.ts
    config/
      characters.ts
      stadiums.ts
      specials.ts
      gameModes.ts
    entities/
      Player.ts
      Ball.ts
      GoalSensor.ts
    systems/
      MatchStateMachine.ts
      CollisionSystem.ts
      SpecialSystem.ts
      CpuAiSystem.ts
      InputMappingSystem.ts
      SaveSystem.ts
      VfxSystem.ts
      SfxSystem.ts
    scenes/
      BootScene.ts
      PreloadScene.ts
      TitleScene.ts
      CharacterSelectScene.ts
      MatchScene.ts
      ResultScene.ts
    ui/
      HudLayer.ts
      TouchControls.ts
      CharacterCard.ts
      Buttons.ts
      Modal.ts
    types/
      CharacterConfig.ts
      StadiumConfig.ts
      SpecialConfig.ts
      SaveData.ts
      MatchResult.ts
assets/
public/
```

---

## 4. Scene Responsibilities

## BootScene
- set scale mode
- initialize save and audio defaults
- route to preload

## PreloadScene
- load atlas, sprite sheets, audio
- show progress bar
- verify minimal required assets
- route to title

## TitleScene
- logo
- play CTA
- tutorial CTA
- sound toggle
- version text optional

## CharacterSelectScene
- show unlocked roster
- select character
- select CPU difficulty
- optional stadium choice
- start match

## MatchScene
- create stadium
- spawn player and CPU
- spawn ball
- create HUD
- process input and AI
- handle goals and timer
- transition to result

## ResultScene
- show winner
- reward coins
- show rematch and menu buttons
- update save

---

## 5. Input Model

## Mobile
Provide on-screen buttons:
- move left
- move right
- jump
- kick
- special

### Rules
- left and right can be held
- jump is discrete
- kick can be discrete with a tiny buffer
- special only active when meter is full or cooldown clear
- buttons need large touch hit zones and visual pressed states

## Desktop
- A / D = move
- W = jump
- Space = kick
- Shift = special
- Escape = pause

Create one `InputMappingSystem` that exposes abstract actions so scenes and entities do not read raw keyboard/touch directly.

---

## 6. Core Gameplay Model

## Player entity
Suggested runtime state:
- position
- velocity
- facing
- grounded
- jumpBufferTime
- coyoteTime
- kickCooldown
- specialCooldown
- specialMeter
- state enum (idle, run, jump, kick, stun, celebrate)

### Physics simplification
Use a simple arcade body:
- rectangle or capsule-like feel approximation
- separate visible sprite and hitbox if needed
- head visuals may exceed the physical body bounds, but collision should remain fair

## Ball entity
State:
- position
- velocity
- lastTouchPlayerId
- elementalState
- speedCap
- airborneTime
- goalLock

Use a circular body and tune:
- bounce
- drag
- max velocity
- wall collision damping
- player kick impulse

## Goal detection
Use invisible sensors behind the goal line:
- leftGoalSensor
- rightGoalSensor
- disable repeat trigger until kickoff reset

---

## 7. Match Flow State Machine

Suggested states:
- `intro`
- `kickoff`
- `live`
- `goalFreeze`
- `reset`
- `overtime`
- `finished`
- `paused`

### Example logic
- start in `intro`
- after short delay -> `kickoff`
- ball becomes live -> `live`
- goal sensor triggered -> `goalFreeze`
- after celebration -> `reset`
- if timer expires with tie -> `overtime`
- else -> `finished`

Keep the match state machine centralized rather than scattering flags across many classes.

---

## 8. CPU AI Structure

Use finite state logic with utility scoring.

### States
- holdHome
- moveToBall
- defendGoal
- jumpContest
- attackWindow
- useSpecial
- clearBall
- recover

### Inputs AI should inspect
- ball x/y
- ball velocity
- own goal position
- distance to ball
- player and opponent cooldown states
- current score
- time remaining

### Difficulty tuning knobs
- reaction delay
- preferred aggression
- special frequency
- kickoff timing
- aerial contest confidence
- defensive retreat threshold

Avoid “perfect knowledge” feel by:
- sampling with delay
- adding small randomness
- intentionally mistiming some easy-mode actions

---

## 9. Specials System

Each character gets one signature special.

Represent specials as data plus a handler:
- id
- icon
- cooldown
- meterCost
- windupMs
- activeMs
- VFX id
- SFX id
- gameplay effect

### Recommended MVP specials
- Fire Shot
- Dash Kick
- Wall Block
- Curve Touch

A `SpecialSystem` should:
- validate availability
- play windup
- apply gameplay effect
- trigger VFX/SFX
- start cooldown / drain meter

---

## 10. Save Data

Use localStorage with versioning.

### Suggested structure
```json
{
  "version": 1,
  "coins": 0,
  "unlockedCharacters": ["blaze", "bolt"],
  "unlockedStadiums": ["sunset_arena"],
  "settings": {
    "soundOn": true,
    "musicOn": true
  },
  "stats": {
    "wins": 0,
    "losses": 0,
    "goalsScored": 0
  }
}
```

### Save rules
- write after result screen
- debounce writes if needed
- handle corrupted save gracefully by restoring defaults

---

## 11. UI Layout Rules

## Title
- central logo
- play button dominant
- tutorial secondary
- sound toggle top-right
- safe margins for notches and browser UI

## Character select
- 2 rows max on mobile landscape
- locked characters visually obvious
- selected card gets large highlight
- CTA button always visible

## Match HUD
- timer center top
- score left/right top
- pause and audio buttons top corners
- touch controls bottom left/right
- keep the center-bottom area clear enough to see the ball

---

## 12. Asset Pipeline

### Characters
For each character:
- portrait
- character select card
- in-match sprite sheet
- icon for special
- celebration frame or mini sheet

### Stadium
- background back layer
- crowd layer
- field layer
- goal asset
- optional lighting overlays

### UI
- buttons atlas
- HUD frame atlas
- number sprites or font config
- tutorial icons

### Optimization rules
- atlas whenever possible
- prefer shared materials / colors
- trim transparent padding
- test readability after downscaling

---

## 13. Performance Budget Guidelines

### General
- avoid huge PNGs
- minimize simultaneous tweens and particles
- pool effects where possible
- cap max active particles for goal explosions

### Suggested budgets
- aim for a lean initial bundle
- use texture atlases
- keep character frame counts efficient
- lazy-load optional content

### Runtime optimization
- do not create/destroy many objects every frame
- prefer enabling/disabling pooled instances
- avoid expensive text reflows every tick if possible

---

## 14. Game Feel Tuning Priorities

Tune in this order:
1. player movement response
2. jump arc and landing feel
3. kick timing and impact impulse
4. ball bounce tuning
5. goal celebration timing
6. special readability
7. camera shake / hit stop
8. CPU difficulty tuning

If the game does not feel good with placeholders, do not expand content yet.

---

## 15. Testing Checklist

## Smoke test
- boot game
- start match
- score goal
- finish match
- earn reward
- rematch
- return to title

## Mobile input test
- all buttons respond
- no stuck input on release
- no overlap with phone safe areas
- special button only when available

## Gameplay fairness test
- no own-goal soft locks
- ball never escapes arena
- goals count once only
- kickoff reset is stable
- overtime works
- CPU not unbeatable on normal

## Save test
- unlock persists
- settings persist
- version upgrade fallback works

---

## 16. Build and Deployment Notes

### Build
- production build through Vite
- static deploy compatible
- ensure all asset paths work under subpaths if needed

### Deployment targets
- Netlify
- Vercel
- Cloudflare Pages
- static hosting CDN

### PWA
Optional for later. Do not block MVP on full PWA polish.

---

## 17. Implementation Sequence

### Phase 1
- setup repo and Phaser boot
- add graybox match scene
- implement player move/jump/kick
- implement ball and goal sensors
- add timer and score

### Phase 2
- add CPU AI
- add touch controls
- add state machine
- add result flow
- add save system

### Phase 3
- add specials
- add character configs
- add character select
- add title and tutorial
- integrate first-pass art

### Phase 4
- add audio / VFX
- optimize
- tune feel
- add progression
- polish transitions

---

## 18. Acceptance Criteria

The implementation is acceptable when:
- a first-time player can launch and understand the game quickly
- one full match can be played start to finish without blocking bugs
- mobile touch controls feel usable
- CPU difficulty is differentiated
- art and HUD remain readable on a phone
- the whole loop feels original and shippable