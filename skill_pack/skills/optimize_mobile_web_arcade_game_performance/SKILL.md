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