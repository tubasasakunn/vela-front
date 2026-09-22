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
           Four feature examples in two columns
         AI-guided setup + editable configuration
                     FAQ / Download
```

Centered introductory copy leads to one large interactive desktop. The rest of
the page uses left-aligned descriptions. Illustrations have individual palettes;
text stays outside them. There is no decorative card around every paragraph.
The design review replaced the former dark, abstract positioning and code-heavy
hero with concrete actions and a direct download. No customer claims or metrics
were invented.

## Demo contract

- `src/demo.ts` runs only in the visitor's browser. No OS actions, network calls,
  clipboard reads/writes, permissions or real application launches.
- Clipboard search, selected result, paste, empty results, reset, app search,
  notes/Safari/calendar results, and window arrangement are interactive.
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

1. Clipboard result → paste → replay; unmatched query disables the action.
2. Window layout ends with two non-overlapping equal-width windows.
3. Search + Enter opens the selected app illustration, including Safari/calendar.
4. The tour reaches the launcher result and stops; manual actions cancel it.
5. Mobile widths 320/390, tablet 768 and desktop have no horizontal overflow.
6. FAQ expansion, keyboard tabs, direct DMG redirect and setup routes work.

The frontend is HTML/CSS/vanilla JavaScript. No generated bitmap or video is
required to render text or demonstrate the operations. Bump the script query
version in `src/landing.ts` when changing the browser script to avoid stale-cache
HTML/JS mismatches.
