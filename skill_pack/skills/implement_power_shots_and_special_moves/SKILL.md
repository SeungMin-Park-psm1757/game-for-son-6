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