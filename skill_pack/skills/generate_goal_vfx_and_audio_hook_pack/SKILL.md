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