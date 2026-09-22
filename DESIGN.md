# Vela landing page

## Direction

A light, Japanese-first page showing everyday Mac operations before explaining
configuration. Nani's concrete feature descriptions and approachable product
demonstrations informed the structure, not its colors or branding.

Palette: paper `#fafaff`, ink `#252438`, secondary text `#686879`, Vela purple
`#7561cf`, pale lilac `#efedf9`, soft mint `#c9ecde`. System sans-serif and
Hiragino keep Japanese UI familiar; monospaced text is reserved for actual code.
The existing Vela icon is retained.

```text
Brand                      Features / Setup / Download
          Specific product headline + description
                       Download DMG
          Clipboard / Window layout / App launcher
                 Interactive Mac illustration
          Large illustration | Feature description
          Feature description | Large illustration
                 (one feature per row)
         AI-guided setup + editable configuration
                     FAQ / Download
```

Centered introductory copy leads to one large interactive desktop. The rest of
the page uses left-aligned descriptions. Illustrations have individual palettes;
text stays outside them. There is no decorative card around every paragraph.
The design review replaced the former dark, abstract positioning and code-heavy
hero with concrete actions and a direct download. No customer claims or metrics
were invented.

The experience breaks out of the text column to a maximum 1280px, with larger
palettes and readable control text. The existing light palette and system/Hiragino
type stay unchanged. Tabs and the desktop form one viewport-height composition.
The key guide and completion status float inside the desktop at the bottom,
with reserved space so the palette does not overlap them. There is no external
caption/action row and no restart button.
Feature illustrations each get their own wide row, with adjacent left-aligned
copy and alternating placement. Below 760px these become single-column rows.
The emphasis is on the existing interactions, not new decorative components.

## Demo contract

- `src/demo.ts` runs only in the visitor's browser. No OS actions, network calls,
  clipboard reads/writes, permissions or real application launches.
- Clipboard search, selected result, paste, empty results, reset, app search,
  notes/Safari/calendar results, and window arrangement are interactive.
- A large, clickable key guide inside the desktop shows the current step. Palettes
  start closed: Option+Shift+7 opens clipboard, +8 toggles window layout, +9 opens
  apps. Enter confirms a selection. All actions also work with click/tap.
  Use physical Digit7/8/9 codes for shifted JIS/US layouts. Exact modifiers,
  composition/repeat guards, and a visible-desktop/focus boundary keep the handler
  scoped to the demo. Native Vela settings are not changed.
  Completed actions are immediately reusable with the same shortcut or keycap
  button. Clipboard/app actions reopen search without clearing their result;
  window layout toggles between overlapping and side-by-side positions.
  These chords are not listed in Chrome/Safari standard shortcut tables;
  custom OS shortcuts and extensions can still take priority.
  References: [Chrome shortcuts](https://support.google.com/chrome/answer/157179?hl=en)
  and [Safari shortcuts](https://support.apple.com/en-kg/guide/safari/cpsh003/mac).
- The optional 14-second tour walks through the three modes once. User actions
  interrupt it; hidden documents stop it. There is no infinite autoplay.
- All demo content is fictitious. The page labels the demo as an illustration
  and says shortcut assignments are examples.
- Container-relative dimensions and container queries preserve the illustrations.
  Mobile search fields are 16px and result rows at least 44px high.
- Tabs support arrows/Home/End; search supports arrows/Enter/Escape. Inactive
  controls are inert. Reduced-motion preferences disable CSS transitions and
  animations; explicit playback still changes the demonstrated state.

## Verification

Run `npm run check`, `git diff --check`, and `npx wrangler deploy --dry-run`.
Use `npm run dev -- --port 8791` for a local preview. In a real browser verify:

1. Option+Shift+7/button → clipboard search → Enter/paste → immediately reopen
   and paste a different entry; unmatched query disables confirmation. Escape
   closes without discarding the last result; IME Enter must not paste.
2. Option+Shift+8 repeatedly toggles equal-width non-overlapping windows and the
   original overlapping positions, without any reset action.
3. Option+Shift+9 + search + Enter opens the selected app illustration; reopen
   and switch from Safari to calendar without a reset.
4. The tour reaches the launcher result and stops; manual actions cancel it.
5. Mobile widths 320/390, tablet 768 and desktop have no horizontal overflow.
   Tabs + desktop fit within one viewport. Search/results remain above the
   overlay, including in short viewports (the result list can scroll).
6. FAQ expansion, keyboard tabs, direct DMG redirect and setup routes work.

The frontend is HTML/CSS/vanilla JavaScript. No generated bitmap or video is
required to render text or demonstrate the operations. Bump the script query
version in `src/landing.ts` when changing the browser script to avoid stale-cache
HTML/JS mismatches.
