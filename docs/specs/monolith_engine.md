# PRD: Monolith Core Engine Specification

- **Status**: Draft
- **Priority**: P0
- **Owner**: Rich Hickey 🧙🏾‍♂️

## Overview

The Monolith Core Engine is a JSON-driven, scroll-activated spatial narrative system. It orchestrates 3D scenes (Three.js/Fiber) via a "Choreography" manifest that maps user scroll progress to camera transitions, asset visibility, and scene swaps.

## User Stories

- **As a Viewer**, I want smooth transitions between geological and historical eras, so that I can experience the narrative without technical friction.
- **As a Content Architect**, I want to define scenes and animations via JSON, so that I can update the story without rebuilding the entire frontend.
- **As a Performance Analyst**, I want assets to be lazy-loaded based on the current scene, so that the initial page load remains under 5MB.

## Acceptance Criteria (Rich Hickey Gherkin)

### Scenario: Scene Transition via Scroll

- **Given** the user is at scroll position `0.2`
- **When** the user scrolls to `0.25`
- **Then** the engine must execute the `switch_scene` action to "solar"
- **And** the camera must interpolate its Z-position from `50` to `20` over the segment.

### Scenario: Asset Validation

- **Given** a new GLB is added to `choreography.json`
- **When** the engine parses the manifest
- **Then** it must verify the path exists in the R2-mapped `/assets-r2` directory
- **And** log a P0 error if the asset is missing.

## Technical Implementation

### Data Flow

`User Scroll` -> `Timeline Resolver` -> `Action Dispatcher` -> `Three.js Renderer`
`R2 Bucket` -> `Wrangler Worker /assets-r2 Proxy` -> `Browser Cache`

### Critical Failure Discovery

- **Issue**: Malformed `choreography.json`.
- **Location**: Line 306-307. The `segments` array is improperly terminated, causing a parser crash in the production timeline resolver.

## Security & Validation

- **Auth**: Public read-only access for assets. Write access restricted to Global API Key (current) or R2 API Tokens (recommended).
- **Validation**: Zod schema required for `choreography.json` to prevent runtime crashes during manual updates.

## Pre-Mortem: Why will this fail?

1. **Asset Blocking**: Large models (Landscape/Earth) block the main thread during hydration. *Mitigation*: Progressive loading/Basis transcoders.
2. **Timeline Drift**: High-frequency scroll events may cause camera "stutter" if interpolation isn't debounced. *Mitigation*: GSAP-based smoothening.

## Performance Optimization (Lo-Fi)

To ensure accessibility on mobile devices, the engine implements a "Lo-Fi" mode triggered by `env.phone`:

1. **DPR Capping**: Mobile DPR is locked to `0.75` to reduce pixel-fill rate and VRAM pressure.
2. **Authoritative Assets**: The engine is forced to resolve all textures via the `/assets/textures-o` path, eliminating redundant loads of lower-resolution symlinks.
3. **Selective Exclusion**: Bandwidth-heavy assets like `ending.mp4` (9.2MB) are excluded from the initial mobile load to maintain a <30MB payload target.

---
PRD Drafted. Initiate the Autonomous Pipeline: /proceed docs/specs/monolith_engine.md -> /test -> /refactor -> /test
