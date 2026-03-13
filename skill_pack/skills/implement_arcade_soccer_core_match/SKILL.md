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