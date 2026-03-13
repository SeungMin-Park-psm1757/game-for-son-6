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