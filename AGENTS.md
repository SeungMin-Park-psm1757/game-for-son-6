# AGENTS.md

This repository is for building an original **lightweight 1v1 arcade soccer webapp** inspired by the general feel of casual big-head soccer games, but **not cloning any specific title, brand, real athlete, logo, jersey, or UI composition**.

## Product intent
Build a fast, readable, mobile-web-friendly soccer game with:
- oversized character heads
- tiny stylized bodies
- simple controls
- short matches
- satisfying power shots
- loud, chunky UI
- clear goals and progression

## Core priorities
1. Game feel
2. Readability on small mobile screens
3. Stable performance on mobile web
4. Original art direction
5. Small, expandable codebase

## Recommended stack
- Vite
- TypeScript
- Phaser 3
- localStorage for save data
- optional Howler.js for audio convenience

## Architecture rules
- Keep gameplay data-driven where possible.
- Separate rendering, input, AI, and balance constants.
- Prefer simple deterministic-enough arcade physics over realism.
- Use scene-based flow:
  Boot -> Preload -> Title -> Character Select -> Match -> Result
- Keep match rules configurable in JSON or TypeScript config objects.
- Avoid coupling menu logic to match logic.

## Art direction rules
- Use original fictional characters only.
- No real-player likenesses.
- No club crests, league logos, or national flags unless explicitly replaced by fictional symbols.
- Keep silhouettes readable at phone size.
- Prefer thick outlines, bold colors, and exaggerated animation over detail-heavy rendering.

## Mobile web rules
- Target landscape-first play.
- Support touch buttons for mobile and keyboard for desktop.
- Keep touch hit areas large.
- Avoid tiny text.
- Design HUD for thumb reach and safe areas.

## Performance rules
- Optimize texture count and draw calls.
- Favor atlases and shared sprite sheets.
- Reuse effects logic and animation timelines.
- Cap particles and screen shake intensity.
- Test on mid-tier mobile assumptions, not only desktop.

## MVP rules
Must-have:
- vs CPU quick match
- 4 original characters
- 2 stadium variants
- title / tutorial / character select / match / result scenes
- movement, jump, kick, special
- save unlocks locally

Can wait:
- local 2P
- tournament ladder
- cosmetic shop
- multiple balls
- live ops

## Working style
When implementing:
- first make systems playable with placeholders
- then add feel tuning
- then add UI polish
- then add content breadth

When uncertain:
- choose the smaller, more stable implementation
- prefer reusable configs
- keep the MVP shippable

## Success definition
A successful build:
- boots quickly
- feels responsive within the first 10 seconds
- makes scoring exciting
- is easy to read on a phone
- has clear state transitions
- is original enough to stand on its own