# RCAC Docs — Developer Notes

## WCAG 2.1 Remediation (Branch: `dev`)

Audit tool: [WAVE](https://wave.webaim.org/) against `https://rcac-docs-dev.readthedocs.io/`
Date: 2026-03-31

---

### Phase 1 — Empty Form Labels (SC 1.3.1 / 4.1.2)

**Problem:** Material for MkDocs generates `<label>` elements that contain only SVG icons (no accessible text). WAVE reported **17 empty form label** errors and **1 additional** error on the palette toggle (fixed separately).

**Root cause:** The theme uses `<label for="X">` as CSS-only click targets for checkboxes (hamburger drawer, search toggle, nav expand arrows, palette switcher). None of these labels carried `aria-label` or visible text.

**Files created/modified:**

| File | Change |
|------|--------|
| `overrides/partials/header.html` | Added `aria-label="{{ lang.t('nav') }}"` to `<label for="__drawer">` (hamburger); `aria-label="{{ lang.t('search') }}"` to `<label for="__search">` (search button) |
| `overrides/partials/search.html` | Added `aria-label="Close search"` to `<label class="md-search__overlay">`; `aria-label="{{ lang.t('search') }}"` to `<label class="md-search__icon">` |
| `overrides/partials/nav-item.html` | Added `aria-label="Expand {{ nav_item.title }}"` to the empty expand label used for nav sections with index pages (lines 107–109 of upstream template) |
| `overrides/partials/palette.html` | Added `aria-label="{{ option.toggle.name }}"` to each palette `<label>` |
| `docs/assets/js/a11y.js` *(new)* | Adds `aria-label="Close navigation"` to the `<label class="md-overlay">` generated in `base.html` (not overridable via partials) |
| `mkdocs.yml` | Added `assets/js/a11y.js` to `extra_javascript` |

**Commits:** `a25d84a`, `88bda58`

---

### Phase 2 — Multiple Form Labels (SC 1.3.1 / 4.1.2)

**Problem:** WAVE reported **21 multiple form labels** errors. Material uses multiple `<label for="X">` elements pointing to the same `<input>` — one as the primary toggle control and another as a secondary "back" button (e.g. the `md-nav__title` label inside a sub-nav, the search overlay, the drawer overlay).

**Root cause:** Each nested nav section generates two labels for its toggle checkbox: the expand arrow and the `md-nav__title` inside the child nav. Same pattern for `__drawer` (hamburger + nav title + overlay) and `__search` (header button + overlay + back icon).

**Fix:** Kept ONE `<label for="X">` per input (the primary control). Converted secondary labels from `for=` associations to `onclick` handlers, preserving click-to-close functionality without creating multiple label associations.

**Files created/modified:**

| File | Change |
|------|--------|
| `overrides/partials/nav-item.html` | Changed `<label class="md-nav__title" for="{{ path }}">` → removed `for`, added `onclick="var t=document.getElementById('{{ path }}');if(t)t.checked=false;"` |
| `overrides/partials/nav.html` *(new)* | Same fix for the top-level `<label class="md-nav__title" for="__drawer">` |
| `overrides/partials/search.html` | Removed `for="__search"` from both the overlay label and the search icon label; added `onclick` handlers on each |
| `overrides/partials/toc.html` | Changed `<label class="md-nav__title" for="__toc">` → removed `for`, added `onclick` |
| `docs/assets/js/a11y.js` | Updated to also remove `for` from `<label class="md-overlay">` at runtime and re-attach click behavior via `addEventListener` |
| `overrides/base.html` *(new)* | Full override of Material's `base.html` to change `<label class="md-overlay" for="__drawer">` → removed `for`, added `aria-label` and `onclick` directly in static HTML (eliminating JS dependency for this element) |

**Side-effect fixed:** Removing `for="__search"` from the `md-search__icon` label also removed the CSS hook `.md-search__icon[for=__search]` used by Material to position the magnify/back-arrow icons. Fixed by adding equivalent rules to `extra.css` using `.md-search__form > label.md-search__icon` as the selector.

**Commits:** `8eedcb9`, `2b74cc1`, `b91c2eb`

---

### Phase 3 — Contrast Errors (SC 1.4.3)

**Problem:** WAVE reported **9 contrast errors** on the home page.

**Root cause (three sources):**

1. **Headerlink anchors (5 errors):** Material's `.headerlink` (the `¶` permalink shown on heading hover) has a default color of `rgba(0,0,0,0.32)` ≈ `#adadad`, which is only **2.24:1** against white. One anchor per heading; the home page has 5 headings.

2. **Warning admonition (1–2 errors):** Material's `!!! warning` admonition uses `#ff9100` (amber/orange) for its icon and title decorations. Against the near-white admonition title background (`rgba(255,145,0,0.1)` on white), this is only **2.26:1**.

3. **Accent color in light mode (remaining errors):** `--md-accent-fg-color` was set to `#CBBA94` (Purdue gold) which is only **1.91:1** against white. Material uses this for search result highlights (`.md-search-result mark`) and hover states.

**Contrast ratios before/after:**

| Element | Old color | Old ratio | New color | New ratio |
|---------|-----------|-----------|-----------|-----------|
| `.headerlink` default | `rgba(0,0,0,0.32)` | 2.24:1 | `#595959` | **7.0:1** |
| Warning admonition icon/border | `#ff9100` | 2.26:1 | `#8b4a00` | **6.8:1** |
| `--md-accent-fg-color` (light) | `#CBBA94` | 1.91:1 | `#7a5c2e` | **6.2:1** |
| `--md-accent-fg-color` (dark) | `#8e6f3e` | 3.65:1 | `#ebd99f` | **12.1:1** |

**Files modified:**

| File | Change |
|------|--------|
| `docs/stylesheets/extra.css` | Changed `--md-accent-fg-color` to `#7a5c2e` in light mode and `#ebd99f` in dark mode; added `--md-accent-fg-color--transparent` variants; added `.md-typeset .headerlink { color: #595959 }`; added warning admonition overrides for border, background, `::before`, and `::after` elements |

**Commit:** `4e7a6ca`

---

### Summary of All Files Changed

```
overrides/
  base.html                        # md-overlay: removed for=, added onclick
  partials/
    header.html                    # aria-label on __drawer and __search labels
    nav-item.html                  # aria-label on expand labels; md-nav__title onclick
    nav.html                       # md-nav__title __drawer: onclick instead of for=
    palette.html                   # aria-label on palette toggle labels
    search.html                    # aria-label + onclick on overlay and icon labels
    toc.html                       # md-nav__title __toc: onclick instead of for=
docs/
  assets/js/a11y.js                # Runtime fix for md-overlay label
  stylesheets/extra.css            # Contrast fixes + search icon positioning CSS
mkdocs.yml                         # Registered a11y.js in extra_javascript
```

### WAVE Results (before → after)

| Error type | Before | After |
|------------|--------|-------|
| Empty form label | 18 | 0 |
| Multiple form labels | 21 | 0 |
| Contrast errors | 9 | 0 |
| **Total** | **48** | **0** |
