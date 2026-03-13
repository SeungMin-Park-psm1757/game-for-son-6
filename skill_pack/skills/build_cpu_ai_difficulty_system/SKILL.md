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