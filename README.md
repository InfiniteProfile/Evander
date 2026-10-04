# EVANDER

**One identity. Infinite states.** A static, framework-free infinite profile directory. No backend, no build step.

## How it works

- **Profile IDs** are positive whole numbers kept as decimal strings (up to 1000 digits), so nothing is ever rounded.
- **Deterministic generation:** `ID -> seeded hash -> PRNG -> profile object`. The same ID always gives the same name, username, avatar, sections and connections, on any device. `Math.random()` is never used.
- **Sections are optional.** Each profile gets only the sections its generator picks. Empty sections are never rendered.
- **Infinite scroll with virtualization:** normal browser scrolling. Only the visible rows plus a small buffer exist in the DOM; far rows are removed. After ~14,000 rows the list rebases seamlessly so pixel heights stay safe.
- **Profile modal:** opens over the directory, scrolls, closes with the button, backdrop or Escape, and restores your scroll position.
- **Search:** type a name, `@username`, role, city or interest. Type a number and press Enter to open that ID. Text search scans IDs in time-sliced batches; use "Keep searching" to go further.
- **Shareable URLs:** `?profile=18472`. The History API handles Back and Forward.
- **Favorites and recent:** saved in `localStorage` (500 and 60 entries max). If storage is blocked or corrupt, the site keeps working in memory.
- **Documents** download as real generated `.txt` files. **Photos** are generated illustrations.

## Files

`index.html`, `style.css`, `script.js` are the whole site. `manifest.json` and `sw.js` are optional PWA files for install and offline reopening.

## GitHub Pages

Push the folder to a repository, then enable Pages. All paths are relative, so `https://username.github.io/evander/` works.

## Customizing

- Names, roles, cities and text pools are at the top of `script.js`.
- Add a section: add an entry to `SECTIONS` (probability and builder) and a matching function in `RENDER`.
- Real images: set `p.image` to a URL in `generate()`. If it fails to load, the generated avatar is used automatically.
- Changing the seed prefix (`evander:1:`) in `rng()` produces an entirely different universe of profiles.
