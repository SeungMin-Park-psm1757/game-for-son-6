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