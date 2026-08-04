# Deniz Bas Landing Page

Static personal homepage for `denizbas.com`.

## Editing Content

Edit the copy and links in `content.md`. The page reads that file at runtime,
so most content changes do not require editing HTML or CSS.

For side-by-side editing, open the page with `?edit=1`:

```text
http://localhost:4175/?edit=1
```

Changes made there are saved in browser local storage and can be copied as
Markdown. Replace `content.md` with the copied Markdown when the copy is final.

The supported Markdown is intentionally small:

- `# Title`
- `[Nav link](url) / [Another](url)`
- paragraphs
- `## Section`
- `- **Label:** description`
- `Footer: ...`

## Local Preview

```sh
python3 -m http.server 4175
```

Then open `http://localhost:4175`.
