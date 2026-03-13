# Arcade Soccer Webapp Skill Pack (Full)

---
## design_arcade_soccer_game_brief

---
name: design_arcade_soccer_game_brief
description: Turn a casual big-head soccer reference into an original, codex-ready webapp game brief with clear MVP scope, system priorities, guardrails, and production constraints.
---

# Design Arcade Soccer Game Brief

Use this skill to create or refine the core design brief for an original lightweight arcade soccer webapp.

The result should be concise enough for implementation, but specific enough that Codex can build from it without guessing the product shape.

---

## When to use

Use this skill when:
- the user wants a game inspired by casual 1v1 big-head soccer
- the team needs an original direction instead of cloning an existing title
- Codex needs a clear product brief before coding
- MVP scope must be tightened for web delivery

---

## Goals

Produce a design brief that clearly defines:
- core fantasy
- target platform
- target player
- match loop
- controls
- feature priorities
- MVP vs stretch scope
- originality guardrails
- success criteria

---

## Inputs

Expected inputs:
- genre reference or screenshots
- platform = webapp
- target orientation = landscape first
- audience type
- monetization preference if any
- desired content scale
- tone and art direction notes

---

## Workflow

1. Extract the **high-level genre formula** from the reference:
   - short 1v1 matches
   - exaggerated characters
   - quick controls
   - flashy scoring
2. Remove brand-specific or copyrighted identity markers.
3. Reframe the project as an original webapp.
4. Define:
   - match duration
   - control scheme
   - scene flow
   - MVP content count
   - progression loop
5. Write explicit non-goals to prevent scope creep.

---

## Output format

Return a brief with these sections:
1. Product summary
2. Design pillars
3. Target audience
4. MVP scope
5. Match rules
6. Core systems
7. Art / UI direction
8. Technical direction
9. Originality guardrails
10. Acceptance criteria

---

## Originality guardrails

Always enforce:
- no real-athlete likeness
- no direct recreation of existing title screens or logos
- no official team, league, or nation branding unless replaced with fictional symbols
- no copy-pasted UI layout

Keep the **genre feel**, but make the identity clearly original.

---

## Success criteria

A good brief:
- is short enough to implement from
- chooses a clear MVP
- explains what makes the game fun
- defines what to cut
- protects against accidental cloning
- is usable by Codex as implementation guidance

---
## implement_arcade_soccer_core_match

---
name: implement_arcade_soccer_core_match
description: Build the core 1v1 side-view arcade soccer match in Phaser with movement, jumping, kicking, ball physics, goals, timer, resets, and a clean state machine.
---

# Implement Arcade Soccer Core Match

Use this skill to implement the playable graybox and production core of the match.

This is the most important gameplay skill in the pack. Everything else depends on this loop feeling responsive.

---

## When to use

Use this skill when building:
- match scene
- player entity
- ball entity
- goal sensors
- timer and score
- kickoff and reset flow

---

## Required implementation priorities

1. fast response to input
2. readable ball arc
3. stable goal detection
4. no soft-locks after scoring
5. simple, dependable state flow

---

## Recommended stack

- Phaser 3
- Arcade Physics
- TypeScript

Prefer simple, tuneable arcade physics over realism.

---

## Inputs

- matchDurationMs
- overtimeDurationMs
- moveSpeed
- jumpVelocity
- kickCooldownMs
- ballBounce
- ballMaxSpeed
- kickoffDelayMs
- goalFreezeMs

---

## Workflow

1. Create `MatchScene`.
2. Spawn:
   - player
   - CPU or second player
   - ball
   - left and right goal sensors
3. Implement player locomotion:
   - left/right move
   - jump
   - face direction
4. Implement kick:
   - short active window
   - front-facing impulse
   - air kick allowed
5. Implement ball rules:
   - circle body
   - bounce
   - capped max speed
   - wall damping
6. Add match state machine:
   - intro
   - kickoff
   - live
   - goalFreeze
   - reset
   - overtime
   - finished
7. Add HUD score + timer updates.
8. Reset cleanly after each goal.

---

## Guardrails

- Do not overbuild realistic soccer simulation.
- Do not depend on heavy physics engines unless necessary.
- Keep visual sprite size separate from the collision body if fairness requires it.
- Prevent double-count goals with a goal lock during freeze/reset.

---

## Output

A complete playable core match loop with:
- movement
- jump
- kick
- score
- timer
- goal reset
- win / loss resolution

---

## Acceptance criteria

The implementation is successful when:
- one full match can be played from kickoff to result
- ball never leaves the arena permanently
- goals count once only
- controls feel immediate
- overtime works
- restarts are stable

---
## build_touch_controls_and_match_hud

---
name: build_touch_controls_and_match_hud
description: Create mobile-first touch controls and a readable match HUD for a landscape arcade soccer webapp, including score, timer, special meter, pause, and pressed-state feedback.
---

# Build Touch Controls and Match HUD

Use this skill to create the input and HUD layer that makes the game readable and playable on phones.

---

## When to use

Use this skill when building:
- on-screen movement buttons
- jump and kick buttons
- special button or special meter
- score display
- timer display
- pause button
- mute button

---

## Design goals

- controls must be easy to hit with thumbs
- button states must be obvious
- the HUD must not hide the ball
- score and timer must be readable from a glance
- safe areas must be respected on mobile devices

---

## Inputs

- orientation = landscape
- mobile target resolution range
- number of action buttons
- whether special has a dedicated button
- HUD visual style notes
- safe area assumptions

---

## Workflow

1. Define abstract actions:
   - moveLeft
   - moveRight
   - jump
   - kick
   - special
2. Build `TouchControls` as a reusable UI layer.
3. Add:
   - idle / pressed visuals
   - disabled visuals for unavailable special
   - hit areas larger than visible artwork
4. Build HUD:
   - score left/right
   - timer center top
   - special meter
   - pause and audio buttons
5. Test layout on narrow mobile landscapes.
6. Keep the center-bottom area sufficiently clear for ball readability.

---

## Layout guidance

Recommended:
- movement buttons bottom-left
- jump + kick bottom-right
- special above or near kick
- score and timer top
- pause / audio top corners

---

## Output

- touch control component
- HUD component
- desktop keyboard fallback mapping documentation
- pressed, disabled, and normal states

---

## Guardrails

- Do not use tiny text.
- Do not place essential buttons under browser chrome or notch areas.
- Do not let button art dominate the whole screen.
- Avoid long tutorial text inside the live match HUD.

---

## Acceptance criteria

Success means:
- buttons are comfortable on phone screens
- no stuck state after touch release
- score and timer remain readable
- special availability is visually clear
- gameplay view remains unobstructed

---
## implement_power_shots_and_special_moves

---
name: implement_power_shots_and_special_moves
description: Add readable, balanced, and satisfying special moves and power shots to an arcade soccer webapp, including cooldowns, meters, hit-stop, ball states, and VFX hooks.
---

# Implement Power Shots and Special Moves

Use this skill to build the flashy layer that makes matches memorable.

---

## When to use

Use this skill when implementing:
- character signature specials
- charged power shots
- cooldowns
- special meters
- ball elemental states
- hit-stop and burst feedback
- VFX / SFX hooks for impacts

---

## Special design principles

- easy to understand
- dramatic but brief
- fun on first use
- balanced across short matches
- readable on mobile

---

## Inputs

- special list
- cooldown durations
- meter gain rules
- ball state rules
- VFX identifiers
- SFX identifiers
- match balance targets

---

## Recommended MVP special set

- Fire Shot
- Dash Kick
- Wall Block
- Curve Touch

Each special should be data-driven.

---

## Workflow

1. Define `SpecialConfig`:
   - id
   - cooldownMs
   - meterCost
   - windupMs
   - activeMs
   - uiIcon
   - effectType
2. Build `SpecialSystem`.
3. Validate activation rules.
4. Apply gameplay effect:
   - ball impulse
   - temporary barrier
   - short dash
   - ball curve bias
5. Trigger:
   - character animation
   - VFX hook
   - SFX hook
   - hit-stop or screen shake if appropriate
6. Start cooldown and update HUD.

---

## Balance rules

- specials must not decide every match alone
- counterplay should exist
- visual telegraph should be readable
- cooldowns should suit 45-second matches

---

## Output

A reusable special-move framework plus an initial set of tuned specials.

---

## Guardrails

- avoid long, blocking cutscenes
- avoid full-screen effects that hide the ball
- avoid overcomplicated combo systems for MVP
- avoid raw stat inflation instead of distinct behavior

---

## Acceptance criteria

Success means:
- specials feel exciting
- special availability is understandable
- effects work inside the live match loop
- the CPU can use specials too
- no special causes a match-breaking exploit

---
## build_cpu_ai_difficulty_system

---
name: build_cpu_ai_difficulty_system
description: Implement a finite-state CPU opponent with easy, normal, and hard difficulty tiers for a 1v1 arcade soccer game, keeping the AI fun and readable rather than unfair.
---

# Build CPU AI Difficulty System

Use this skill to create a CPU opponent that makes solo play viable for the webapp MVP.

---

## When to use

Use this skill when building:
- CPU movement logic
- defensive positioning
- ball chase logic
- jump timing
- kick timing
- special usage logic
- difficulty tiers

---

## Design goals

- CPU should feel competitive
- CPU should not feel like it cheats
- difficulty should come from timing and positioning, not impossible stats
- CPU behavior should be easy to tune

---

## Inputs

- difficulty tiers
- reaction delay ranges
- aggression settings
- retreat thresholds
- special frequency
- kickoff behavior
- score/time awareness

---

## Workflow

1. Create CPU FSM states:
   - holdHome
   - moveToBall
   - defendGoal
   - jumpContest
   - attackWindow
   - useSpecial
   - clearBall
   - recover
2. Add utility scoring or simple priority evaluation.
3. Add difficulty knobs:
   - reaction delay
   - commit distance
   - aerial confidence
   - special usage chance
4. Inject small randomness and delay.
5. Tune against representative human play.

---

## Difficulty guidelines

### Easy
- slower reactions
- poor aerial timing
- underuses specials
- retreats early

### Normal
- balanced offense/defense
- decent jump timing
- occasional smart special usage

### Hard
- stronger positioning
- better timing
- uses specials at opportune moments
- still respects rules and cooldowns

---

## Output

A CPU system with configurable difficulty presets.

---

## Guardrails

- do not read impossible future game state
- do not give hidden speed boosts unless explicitly visible and balanced
- avoid perfect interception behavior
- do not hardcode around one single character build only

---

## Acceptance criteria

Success means:
- Easy is beatable by most players
- Normal is fun and close
- Hard is challenging without feeling unfair
- CPU never freezes or loops uselessly
- CPU uses specials in a readable way

---
## build_menu_character_select_and_unlock_flow

---
name: build_menu_character_select_and_unlock_flow
description: Create the title, tutorial, character select, result, and simple unlock progression flow for a lightweight arcade soccer webapp with local save support.
---

# Build Menu, Character Select, and Unlock Flow

Use this skill to build the non-match structure that makes the game feel complete.

---

## When to use

Use this skill when implementing:
- title screen
- tutorial overlay
- character select
- difficulty select
- result screen
- rematch flow
- simple coin-based unlocks
- local save integration

---

## Inputs

- roster size
- default unlocked characters
- currency name
- unlock prices
- tutorial content
- CTA hierarchy
- desired scene flow

---

## Workflow

1. Build `TitleScene`:
   - game logo
   - play button
   - tutorial button
   - sound toggle
2. Build tutorial overlay or scene:
   - move
   - jump
   - kick
   - special
   - win condition
3. Build `CharacterSelectScene`:
   - roster cards
   - lock states
   - difficulty choice
   - start CTA
4. Build `ResultScene`:
   - winner
   - score
   - coin reward
   - rematch
   - back to menu
5. Implement local save for:
   - unlocked characters
   - coins
   - settings

---

## Progression guidance

Keep progression light:
- first 2 characters unlocked
- next characters unlocked by coins
- optional stadium skins later

The goal is replay value, not a monetization-heavy loop.

---

## Output

A complete front-end scene flow around the match.

---

## Guardrails

- do not bury the play button
- avoid too much text on small screens
- keep result flow fast
- avoid requiring an account system
- do not overcomplicate rewards for MVP

---

## Acceptance criteria

Success means:
- the player can start a match quickly
- character choice is clear
- locks and unlock costs are readable
- rewards persist after refresh
- rematch requires minimal friction

---
## generate_original_bighead_soccer_character_pack

---
name: generate_original_bighead_soccer_character_pack
description: Generate original big-head arcade soccer character assets for a webapp, including portraits, match sprites, selection cards, and special icons, while avoiding real-athlete likeness and team branding.
---

# Generate Original Big-Head Soccer Character Pack

Use this skill to create the character art set for the game.

---

## When to use

Use this skill when generating:
- playable roster characters
- selection portraits
- in-match sprites
- special icons
- celebration poses
- defeat poses

---

## Asset goals

Characters should be:
- original
- funny
- readable
- mobile-friendly
- distinct from each other

---

## Inputs

- roster theme
- character count
- archetypes
- pose list
- output sizes
- palette preference
- outline weight preference
- background removal mode if needed

---

## Required originality rules

Always avoid:
- real-athlete facial resemblance
- real team logos
- real country flags as identity anchors
- existing sports-game character clones

Prefer fictional badges, abstract color blocking, and unique hair/accessory silhouettes.

---

## Workflow

1. Define roster archetypes.
2. Generate character concepts with:
   - oversized head
   - compact body
   - strong expression
   - readable silhouette
3. Produce:
   - portrait card art
   - side-view match pose
   - kick pose
   - jump pose
   - special pose
4. Remove background if needed.
5. Resize and optimize assets for web use.
6. Validate visibility at actual phone scale.

---

## Output

For each character, aim to provide:
- `portrait`
- `select_card`
- `match_idle`
- `match_run`
- `match_jump`
- `match_kick`
- `match_special`
- `special_icon`

---

## Guardrails

- do not over-detail faces
- do not use tiny emblem detail that disappears on phones
- do not let palette differences become muddy
- avoid thin limbs that disappear during motion

---

## Acceptance criteria

Success means:
- each character is instantly distinguishable
- art is readable at small sizes
- the roster feels original
- the match sprite and portrait feel like the same character
- assets are lightweight enough for web delivery

---
## generate_stadium_goal_ball_and_field_pack

---
name: generate_stadium_goal_ball_and_field_pack
description: Generate original stadium, field, goal, and ball assets for a side-view arcade soccer webapp, with strong gameplay readability and lightweight web-friendly production constraints.
---

# Generate Stadium, Goal, Ball, and Field Pack

Use this skill to produce the core match environment assets.

---

## When to use

Use this skill when generating:
- stadium backgrounds
- field layers
- goal assets
- crowd layers
- scoreboard frame backgrounds
- ball art and powered-state variants

---

## Environment goals

- the ball must always stand out
- goals must be visible at a glance
- the field must support gameplay, not distract from it
- layers should be reusable and efficient

---

## Inputs

- stadium themes
- field palette
- goal style notes
- ball style notes
- target resolution
- parallax layer count
- animation needs
- optimization target

---

## Workflow

1. Define 2 MVP stadium themes.
2. Generate layered environment art:
   - far background
   - crowd / seating layer
   - field layer
   - optional lighting overlay
3. Generate goal assets with strong readability.
4. Generate ball art:
   - default
   - powered / special-state variants if needed
5. Optimize for web:
   - trim transparency
   - atlas friendly
   - avoid giant textures
6. Validate ball visibility against both warm and cool stadiums.

---

## Output

- `stadium_*_bg`
- `stadium_*_crowd`
- `field_*`
- `goal_left`
- `goal_right`
- `ball_default`
- `ball_fire`
- `ball_curve`
- optional lighting overlays

---

## Guardrails

- no real stadium branding
- avoid ad-board clutter
- avoid detailed crowds that shimmer or distract
- do not let field stripes swallow the ball silhouette

---

## Acceptance criteria

Success means:
- gameplay objects remain readable
- stadium variants feel distinct
- goals read clearly
- the ball is visible across environments
- assets stay lightweight enough for mobile web

---
## generate_arcade_soccer_ui_visual_pack

---
name: generate_arcade_soccer_ui_visual_pack
description: Generate the visual UI kit for a lightweight arcade soccer webapp, including logo, buttons, HUD frames, result panels, character cards, and tutorial callouts.
---

# Generate Arcade Soccer UI Visual Pack

Use this skill to create the game’s visual interface language.

---

## When to use

Use this skill when generating:
- title logo
- play button
- tutorial button
- HUD frames
- score panels
- timer panels
- result panels
- lock icons
- character card frames
- tutorial callouts

---

## UI goals

- chunky and readable
- playful sports-broadcast energy
- high contrast
- mobile-friendly
- original and not derivative of an existing title screen layout

---

## Inputs

- game title
- typography direction
- palette
- target screen sizes
- button count
- panel types
- whether dark / light stadiums both exist

---

## Workflow

1. Define visual hierarchy:
   - primary CTA
   - secondary CTA
   - HUD information
2. Generate original logo directions.
3. Generate button kit with:
   - idle
   - hover / pressed
   - disabled
4. Generate HUD frames:
   - score
   - timer
   - special meter
5. Generate result panel and select-card frames.
6. Validate readability on phone-size previews.

---

## Output

- title logo
- button atlas
- HUD atlas
- panel atlas
- character card frames
- tutorial icon frames

---

## Guardrails

- do not overcrowd the title screen
- avoid tiny decorative text
- avoid low-contrast white-on-bright combinations
- avoid copying another sports game logo structure too closely

---

## Acceptance criteria

Success means:
- the title screen is clear
- the HUD reads at a glance
- buttons communicate state
- UI feels cohesive with the character art
- all core screens share one visual language

---
## generate_goal_vfx_and_audio_hook_pack

---
name: generate_goal_vfx_and_audio_hook_pack
description: Design the goal, impact, special, and celebration feedback package for an arcade soccer webapp, including VFX concepts, SFX hook mapping, screen shake timing, and juice rules.
---

# Generate Goal VFX and Audio Hook Pack

Use this skill to define the feedback layer that sells the action.

---

## When to use

Use this skill when creating:
- goal burst effects
- impact sparks
- dust puffs
- ball trails
- special activation flashes
- screen shake timings
- SFX event maps
- crowd reaction timing rules

---

## Feedback goals

- make goals memorable
- make kicks feel weighty
- keep feedback readable on mobile
- avoid clutter and latency

---

## Inputs

- special list
- event list
- visual tone
- audio tone
- performance budget
- match pace

---

## Workflow

1. Enumerate key feedback events:
   - jump
   - kick
   - strong kick
   - wall bounce
   - special charge
   - special activation
   - goal
   - win / loss reveal
2. Define VFX for each event.
3. Define SFX hook ids for each event.
4. Define screen shake / hit-stop only for high-value events.
5. Pool particle systems and short-lived effects.
6. Validate readability under fast motion.

---

## Output

- event-to-VFX map
- event-to-SFX map
- intensity tiers
- timing table for hit-stop and shake
- notes for pooling / performance

---

## Guardrails

- do not cover the ball with the effect for long
- do not shake the camera on every touch
- do not stack too many audio layers on one event
- do not use huge particles for mobile-first gameplay

---

## Acceptance criteria

Success means:
- goals feel exciting
- strong kicks feel stronger than regular kicks
- special activations are legible
- performance remains stable
- feedback makes the match feel more polished, not noisier

---
## optimize_mobile_web_arcade_game_performance

---
name: optimize_mobile_web_arcade_game_performance
description: Optimize a casual arcade sports webapp for mobile browsers by reducing asset cost, improving input responsiveness, controlling effect counts, and keeping load times practical.
---

# Optimize Mobile Web Arcade Game Performance

Use this skill to keep the game fast enough for real phone play.

---

## When to use

Use this skill when tuning:
- load time
- runtime FPS
- input latency
- memory usage
- asset sizing
- atlas strategy
- particle counts
- scene transitions

---

## Optimization priorities

1. initial boot speed
2. input responsiveness
3. match-scene frame stability
4. effect cost control
5. asset compression

---

## Inputs

- asset list
- atlas plan
- target device class
- particle usage
- audio format choices
- scene count
- desired FPS targets

---

## Workflow

1. Audit asset sizes and counts.
2. Combine compatible UI and character assets into atlases.
3. Trim transparent padding.
4. Reduce oversized backgrounds.
5. Pool frequently spawned effects.
6. Avoid allocating throwaway objects per frame.
7. Test with mobile-style throttling assumptions.
8. Profile match scene separately from menu scenes.

---

## Output

- performance checklist
- asset optimization plan
- runtime optimization notes
- recommended cuts if frame budget is exceeded

---

## Guardrails

- do not optimize before the core loop works
- do not sacrifice readability for tiny gains
- avoid overusing tween-heavy decorative UI
- do not rely on desktop-only profiling

---

## Acceptance criteria

Success means:
- initial load feels reasonable
- mobile controls stay responsive
- match FPS is stable
- effects do not overwhelm weaker devices
- the build remains small enough to share easily as a webapp

---
## qa_balance_and_release_arcade_soccer_webapp

---
name: qa_balance_and_release_arcade_soccer_webapp
description: Run final QA, feel tuning, balance review, and ship-readiness checks for a lightweight arcade soccer webapp, covering match fairness, progression, stability, and first-session clarity.
---

# QA, Balance, and Release Arcade Soccer Webapp

Use this skill near the end of development to turn a working build into a shippable build.

---

## When to use

Use this skill when validating:
- full session flow
- difficulty balance
- special balance
- goal pacing
- touch usability
- save persistence
- scene transitions
- onboarding clarity

---

## Review areas

### Gameplay feel
- move speed
- jump arc
- kick window
- ball bounce
- goal reset pacing

### Balance
- character archetypes
- special cooldown fairness
- CPU tier differentiation
- overtime fairness

### Product quality
- title to match flow
- rematch friction
- tutorial clarity
- unlock readability
- audio settings persistence

---

## Workflow

1. Run smoke tests across the full loop.
2. Run mobile-input-specific tests.
3. Check no blocking bugs remain in match progression.
4. Balance characters against a shared tuning rubric.
5. Compare Easy / Normal / Hard experience.
6. Verify saves after refresh and relaunch.
7. Prepare a release checklist and known-issues list.

---

## Output

- QA checklist
- balance notes
- bug triage summary
- release readiness decision
- top 5 post-launch improvements

---

## Guardrails

- do not add major new systems this late
- do not ship with inconsistent input mapping
- avoid large feature creep after polish begins
- do not ignore first-session confusion just because core gameplay feels good

---

## Acceptance criteria

Success means:
- a player can complete the whole loop cleanly
- no major blockers remain
- difficulty feels intentional
- the game is readable and enjoyable on phones
- the build is solid enough to share publicly
