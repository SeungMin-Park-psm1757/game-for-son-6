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