+++
title = "Authoring Content"
description = "Authoring content with frontmatter"
template = "shizuka_doc"
section = "shizuka-docs"
weight = 30
+++

Shizuka stores structured page metadata in markdown (or optionally HTML) frontmatter. A frontmatter block must be the very first thing in the file, with no leading whitespace. Shizuka will consume the following formats:

| Format | Syntax |
| --- | --- |
| YAML | Fence with `---`. |
| TOML | Fence with `+++`. |
| JSON/JSONC | Put a JSON object at the very start of the file, with no fence. Comments are allowed. |

If present, the fence line must be the very first line of the file, with no
leading whitespace and no content before it.

An example JSON frontmatter block:

```json
{
  // Comments are allowed in object frontmatter.
  "title": "Hello",
  "description": "A short post.",
  "template": "post",
  "section": "posts",
  "slug": "hello",
  "weight": 10,
  "tags": ["intro", "shizuka"],
  "featured": true,
  "draft": false,
  "rss": { "include": true },
  "sitemap": { "include": true, "changefreq": "monthly", "priority": 0.7 },
  "robots": { "disallow": false }
}

Markdown content here.
```

## Structured Pages

Non-Markup content files are parsed like the frontmatter, as a single object and must include:

| Key | Meaning |
| --- | --- |
| `template` | The template name to render. |
| `body` | A string containing HTML to inject as `.Page.Body`. |
| `body_markdown` | Optional boolean. When true, `body` is rendered as Markdown before it is injected as `.Page.Body`. |

For example:

```toml
title = "About"
template = "page"
weight = 20

[sitemap]
include = true

body = """
This is an **about** page.
"""
```

## Fields

### Identifiers

| Key | Type |
| --- | --- |
| `title` | string |
| `description` | string |
| `section` | string, becomes `.Page.Section` |
| `slug` | optional identifier. Explicit slugs must contain only letters, numbers, `_`, and `-`; missing slugs are generated for the build. |
| `tags` | list of strings |
| `weight` | integer ordering hint; lower values sort earlier |
| `created`, `updated` | timestamps |
| `featured` | boolean |
| `draft` | boolean |
| `params` | arbitrary map merged into `.Page.Params` |
| `template` | string, required for rendering unless a default supplies it |

### Extra fields

| Key | Type |
| --- | --- |
| `headers` | map of per-page headers for the headers build step |
| `rss` | `include`, `title`, `description`, `guid` |
| `sitemap` | `include`, `changefreq`, `priority` |
| `robots` | `disallow` |
