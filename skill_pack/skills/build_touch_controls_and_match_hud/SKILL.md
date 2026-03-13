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