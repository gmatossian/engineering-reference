# Diagram starter

Copy [starter.svg](starter.svg) into the Topic directory and adapt its text and
geometry using the [visual specification](../../visual-design.md#authored-topic-diagrams)
and [authoring workflow](../../content-authoring.md#author-diagrams-from-the-shared-default).
The starter is a small request flow, not a required composition. Its intrinsic
dimensions and matching `viewBox` describe this drawing's bounds; recalculate them
after editing rather than treating them as a width or aspect-ratio target.

The font, size, weight, and palette rules are ordinary CSS in the SVG's `style`
element. Labels remain editable `text` elements. Increase padding or node size when
changing labels; SVG text does not wrap automatically, so wrap deliberately with
`tspan` elements and the specification's baseline steps. Preserve title/description,
font definitions, and font-license metadata when copying the starter.

## Embedded fonts

The SVG contains the original Google Fonts **Latin normal variable WOFF2** files
for Plus Jakarta Sans (400–700) and JetBrains Mono (500–700) as data font sources.
They are font resources inside the owned SVG, not remote images or data-image
references in Topic Markdown. The generator still copies the completed SVG
unchanged. No runtime font request, local installation, diagram renderer, or build
step is required. The application's general font loading is unchanged.

These are Latin subsets, not fonts subsetted to the starter's current words. They
cover ordinary English labels and ASCII technical notation so those can be edited
without preparing fonts again. Check any added accented text, mathematical symbols,
or other scripts: an unsupported glyph may use the fallback stack. Use supported
wording or explicitly prepare and verify the additional licensed font coverage
needed; do not assume every Unicode character belongs to the embedded font.

Both fonts are licensed under SIL Open Font License 1.1. Each complete copyright
notice and license is included in the SVG's readable `metadata` so it travels with
copies of the diagram. The repository's proprietary license does not replace those
font licenses. Keep the notices when distributing the embedded font software.

### Pinned sources

The Google Fonts CSS API returned these files on 2026-10-28. The URLs and SHA-256
hashes identify the exact bytes embedded in the starter; no font was modified or
converted locally.

| Font | Source WOFF2 | SHA-256 |
| --- | --- | --- |
| Plus Jakarta Sans Latin | [Google Fonts v12](https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2) | `cd8db90cd950e26bc8761f65d323588bd5cd112d326d6d322bc7c8ea86771215` |
| JetBrains Mono Latin | [Google Fonts v24](https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwgknk-4.woff2) | `2c32b9b3ee358c119e210f6f5195f9bd34894d78a785ff2e95d60e718e400af4` |

The corresponding upstream notices are pinned separately:

- [Plus Jakarta Sans OFL notice](https://github.com/google/fonts/blob/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/plusjakartasans/OFL.txt),
  SHA-256 `995c7199cab65954f545996326755daee7b63cc6b42b06c13da1f9502ab08a99`.
- [JetBrains Mono OFL notice](https://github.com/google/fonts/blob/6e4b84c976cadb3c49a40fd9a1c203e4f7fcf2da/ofl/jetbrainsmono/OFL.txt),
  SHA-256 `b2fe5e8987594e9ffd1d2ca52a2f5d73eb8335243893c5d6254b5ad69269591d`.

### Reproduce or inspect the font blocks

Download a pinned WOFF2 source and verify its SHA-256 before replacing its data
block. Python's standard library can print the exact base64 representation:

```sh
python3 -c 'import base64, pathlib, sys; print(base64.b64encode(pathlib.Path(sys.argv[1]).read_bytes()).decode())' /path/to/font.woff2
```

Put that output after `data:font/woff2;base64,` in the corresponding `@font-face`
rule, preserving its normal style, weight range, and fallback declarations. Update
the pinned source, hash, weight range, and license metadata if the font changes.
The complete license text is enclosed in CDATA without XML escaping; incidental
trailing whitespace is normalized. Ordinary text/layout edits do not require
changing either font block.

To verify the starter's embedded bytes from the repository root:

```sh
python3 - <<'PY'
import base64
import hashlib
from pathlib import Path
import re

svg = Path('docs/design/diagrams/starter.svg').read_text()
for data in re.findall(r'data:font/woff2;base64,([A-Za-z0-9+/=]+)', svg):
    print(hashlib.sha256(base64.b64decode(data, validate=True)).hexdigest())
PY
```

The output is the Plus Jakarta Sans hash followed by the JetBrains Mono hash above.

## Verify the finished image

Inspect a normal `img` embedding, with the same intrinsic sizing and responsive
containment used by the app. Test representative wide and narrow content areas;
viewport sizes are verification conditions, not diagram authoring dimensions.
Check readable displayed labels, text inside its node padding, clear connections,
and enough canvas clearance. Inspect grayscale understanding as well as color.

Block external requests or work offline. Verify the intended fonts rather than
merely reading `font-family`: a browser's rendered-font inspection should report
Plus Jakarta Sans and JetBrains Mono as embedded/custom faces. Compare the image
with its standalone SVG rendering if necessary. Check all weights and glyphs used
by the diagram; an attractive fallback still fails to prove font consistency.

If the layout scales text below a useful reading size, simplify, wrap, rearrange, or
split it. Preserve the selected type scale instead of setting a width target and
shrinking the result to fit.
