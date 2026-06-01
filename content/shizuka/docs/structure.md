+++
title = "Creating Sites"
description = "Structure a Shizuka source directory."
template = "shizuka_doc"
section = "shizuka-docs"
weight = 20
+++

A Shizuka site is a directory with a config file and some content:

<div class="diagram">
    <img src="/assets/shizuka/diagram.svg" alt="Diagram showing a Shizuka source site folder and the generated dist folder output.">
    <p class="diagram-caption">Source site folder and generated <code>dist/</code> output.</p>
</div>

## File Structure

| Path | Purpose |
| --- | --- |
| `content/` | Source pages. Markdown pages are converted to HTML and then rendered through a template. |
| `data/` | Optional structured data manifests registered as query tables. |
| `templates/` | Go template files. HTML layouts live under `templates/html/`; markdown components live under `templates/md/`. |
| `static/` | Copied to the output as-is: CSS, images, JavaScript, fonts, and other static files. |
| `dist/` | The default build output folder. |

## Output Structure

Shizuka outputs pretty URLs by writing `index.html` files into directories. Files named `index.*` are treated treated as belonging to their parent directory, whereas other files will create their own directory + `index.html` file, depending on their name.

For example:

| Source | Output |
| --- | --- |
| `content/index.md` | `dist/index.html` |
| `content/about.md` | `dist/about/index.html` |
| `content/posts/hello.md` | `dist/posts/hello/index.html` |
| `content/posts/index.md` | `dist/posts/index.html` |

## Content File Types

| Extension | Behavior |
| --- | --- |
| `*.md` | Markdown body, optional frontmatter. |
| `*.html` | Raw HTML body, optional frontmatter. |
| `*.toml`, `*.yaml`, `*.yml`, `*.json`, `*.jsonc` | Structured page objects. They must contain `template` and `body`; set `body_markdown = true` to render `body` as Markdown. |

All other filetypes under `content/` are ignored. Put CSS, images, JavaScript, fonts, and other static files under `static/`.

## Data Files

If a `data/` directory exists, Shizuka loads `*.toml`, `*.yaml`, `*.yml`,
`*.json`, and `*.jsonc` files as data manifests. Each manifest can define one
or more query tables:

```jsonc
{
  "tables": {
    "products": {
      "name": "shop_products",
      "rows": [
        { "id": "a", "title": "Alpha" },
        { "id": "b", "title": "Beta" }
      ]
    }
  }
}
```

`name` is the public table identifier used in template queries. `rows` may be
an array of objects or a keyed object whose keys are added as a `key` column.
