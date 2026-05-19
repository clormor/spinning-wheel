# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # dev server at localhost:5173
npm run build    # production build to dist/
npm run preview  # preview production build locally
npm run deploy   # build then push to gh-pages branch (requires committed changes on master first)
```

There is no linter configured for this project.

## Architecture

Single-component React 18 app (Vite) deployed to GitHub Pages at `https://clormor.github.io/spinning-wheel`.

### Wheel layout

The wheel is not an SVG or canvas element. It is two stacked `div` containers (`box1`, `box2`), each holding four segments. Each segment is a `50%x50%` absolute-positioned `div` clipped into a pie-slice shape via CSS `clip-path: polygon(...)`. `box2` is rotated `-135deg` so its four segments interleave with `box1`'s four, producing eight evenly spaced segments total.

### Spin mechanics

`performSpin` sets a CSS `transform: rotate(Ndeg)` on `#wheel` (the transition is defined in CSS as `all ease 5s`). After 5 s it calls `findSegment`, which:

1. Gets the bounding rect of `#spinner` (the centre button) to determine the x midpoint.
2. Collects all `.segment` elements whose right edge is more than 200 px past that midpoint.
3. Sorts them by `top` descending and picks the median element as the winner.

Selection state is managed entirely via CSS classes (`selected` / `unselected`) applied directly to DOM nodes, not via React state.

After a further 10 s (`spinTimeMs * 3 - spinTimeMs`) the highlight is cleared. The `.animate` class on `#mainbox` drives a CSS arrow-bounce animation during the reveal window.

### Adding or changing segments

Segments are hardcoded JSX in `SpinningWheel.jsx`. To add a segment you must also add corresponding CSS for the new clip-path shape, colour, and label rotation, and update `findSegment` if the geometry assumptions change (the `> xOrigin + 200` threshold and median-index logic assume an odd total count of visible segments at any rotation).

## Gotchas

- **`npm audit fix --force` corrupts the lockfile.** It strips the dependency tree — symptoms are `npm install` reporting "up to date" with far fewer packages than expected and binaries missing from `node_modules`. Fix: `git restore package-lock.json`. Always run plain `npm audit fix` first; never use `--force`.
- **JSX files must use `.jsx` extension.** Vite 8 uses rolldown, which requires JSX syntax to be in `.jsx` files. Plain `.js` files containing JSX will fail to build.
