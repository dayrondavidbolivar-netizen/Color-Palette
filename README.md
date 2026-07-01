# Colorfly Studio — Color Palette Generator

A static, interactive web app for generating random color palettes, with color locking, copy-to-clipboard, and local palette saving.

## Local demo

No build step or dependencies required. It's plain HTML, CSS, and JS.

1. Clone or download the repository.
2. Open `index.html` directly in your browser, or serve the folder with a static server (recommended, to avoid browser restrictions around `localStorage`/`clipboard` on `file://`):

   ```bash
   npx serve .
   # or
   python3 -m http.server 5500
   ```
3. Visit `http://localhost:5500` (or whatever port your server prints).

## Usage

- **Generate Palette**: creates a new palette at the selected size. Locked colors 🔒 are kept, the rest are regenerated.
- **Palette size (6 / 8 / 9)**: changes how many colors are shown. Growing the palette adds new colors at the end; shrinking it trims the last ones. Existing colors are never changed.
- **Lock a color**: the 🔒/🔓 button on each card pins that color so it survives the next "Generate Palette" click.
- **Copy values**: clicking a card's RGB or HSL value copies it to the clipboard (with a toast confirmation).
- **Save palette**: type a name and click the save button. It persists to `localStorage` under the `palettes` key.
- **Bottom gradient**: the footer shows a gradient built from the palette's current colors.

## Project structure

```
├── index.html   # Semantic app structure
├── style.css    # Visual styles
├── reset.css    # Modern CSS reset (unchanged)
├── app.js       # App logic
└── ntc.js       # Third-party "Name that Color" library (unmodified)
```

## Known follow-ups (out of scope for this fix)

- "Saved palettes" feature: palettes are currently saved to `localStorage`, but there's no UI yet to list or reload them.
- Advanced accessibility checks (e.g. WCAG contrast validation between the palette's own colors).
- Showing the HEX value alongside the color name was tried and reverted: with long name + HEX combinations, the vertical text overflowed the card and pushed the footer out of view. RGB and HSL values are still available via each card's copy buttons.
