+++
title = "Configuration"
description = "Configuring Shizuka"
template = "shizuka_doc"
section = "shizuka-docs"
weight = 50
+++

Shizuka loads JSONC configuration from `shizuka.jsonc` by default.

Configs should include the version of shizuka they are using. Shizuka automatically rejects configs whose version is incompatible with the running binary according to semver.

JSON configs may include `$schema` for editor support:

```json
{
  "$schema": "https://raw.githubusercontent.com/olimci/shizuka/refs/heads/main/_assets/config.schema.json",
  "version": "0.1.0",
  "site": {
    "title": "My site",
    "description": "A small static site.",
    "url": "https://example.com/"
  }
}
```

A URL is required, to generate canonical URLs, and must start with `http://` or `https://`.

## Build Configuration

`minifier` is optional. When present, rendered HTML and copied CSS, JavaScript,
and HTML assets are minified where supported.

| Key | Meaning |
| --- | --- |
| `minifier.whitelist` | Optional allow list of target-path patterns. Empty means all supported artefact types. |
| `minifier.blacklist` | Optional deny list of target-path patterns. Deny rules win over allow rules. |

Patterns use `/` separators, support `**`, and are matched against generated
target paths. A pattern without `/` matches basenames, a leading `/` anchors at
the output root, and a trailing `/` matches a directory and its descendants.

## Content Defaults

You can set default values for content frontmatter, in `content.defaults`:

| Key | Meaning |
| --- | --- |
| `section` | Fallback section name when page frontmatter omits `section`. |
| `global` | Site-wide page frontmatter defaults. The default template is `page`. |
| `sections` | Section-specific page frontmatter defaults, keyed by resolved section name. |

The defaults object supports frontmatter fields that are reasonable to apply across pages:

`title`, `description`, `tags`, `created`, `updated`, `template`, `featured`, `draft`, `weight`, `rss`, `sitemap`, `robots`

It does not include route or identity fields such as `section`, and it does not include map fields such as `params` or `headers`.

Section-specific defaults replace the global defaults object when the resolved section has a matching `sections` entry. Page frontmatter is decoded into the selected defaults, so page values always win, including explicit zero values such as `false`, `0`, empty strings, and empty lists.

## Markdown Configuration

Markdown is configured with Shizuka feature flags:


| Key | Meaning |
| --- | --- |
| `tables` | Enable pipe tables. |
| `strikethrough` | Enable strikethrough spans. |
| `task_list` | Enable task-list items. |
| `definition_list` | Enable definition lists. |
| `footnotes` | Enable footnotes. |
| `linkify` | Turn plain URLs into links. |
| `typographer` | Enable smart punctuation. |
| `wikilinks` | Enable `[[target]]` wikilinks. |
| `components` | Enable pre-render markdown templates from `templates/md/`. |
| `highlighting` | Optional syntax-highlighting config. |

`highlighting`, when present, supports `style`, `line_numbers`, and `classes`. Highlighted code uses [Chroma](https://github.com/alecthomas/chroma) inline styles by default. Set `classes` to `true` to emit Chroma classes and provide CSS from your static assets. Check out the [Chroma Style Gallery](https://xyproto.github.io/splash/docs/) to see available styles.

### Parser Configuration

| Key | Meaning |
| --- | --- |
| `parser.auto_heading_id` | Generate heading IDs. |
| `parser.attribute` | Enable Markdown attributes. |

Generated or explicit heading IDs are exposed to templates through
`.Page.ToC`.

### Renderer Configuration

| Key | Meaning |
| --- | --- |
| `renderer.hardbreaks` | Render soft line breaks as hard breaks. |
| `renderer.xhtml` | Emit XHTML-compatible HTML. |

## Extra Outputs

Shizuka has several extra output artefacts available, including:

| Artefact | Default path |
| --- | --- |
| `headers` | `_headers` |
| `redirects` | `_redirects` |
| `rss` | `rss.xml` |
| `sitemap` | `sitemap.xml` |
| `robots` | `robots.txt` |
| `not_found` | `404.html` |
| `meta` | `_shizuka/index.html` |

### Options

| Artefact | Config |
| --- | --- |
| `rss` | `sections`, `limit`, `include_drafts` |
| `sitemap` | `include_drafts` |
| `robots` | `include_sitemap`, `include_drafts`, `sitemaps`, `groups` |
| `headers` | `values` by route path |
| `redirects` | `entries` with `from`, `to`, and `status` |
| `not_found` | `template` |
| `meta` | `json` |

The `meta` artefact emits HTML debug output at `path`. Set `json` to `true` to
also emit the same site/config payload as formatted JSON at `_shizuka.json`.

## Example Config

```json
{
  "$schema": "https://raw.githubusercontent.com/olimci/shizuka/refs/heads/main/_assets/config.schema.json",
  "version": "0.1.0",
  "site": {
    "title": "My site",
    "description": "A small static site.",
    "url": "https://example.com/",
    "params": {}
  },
  "paths": {
    "output": "dist",
    "content": "content",
    "static": "static",
    "templates": "templates"
  },
  "build": {
    "minifier": {
      "whitelist": ["**/*.html", "**/*.css", "**/*.js"],
      "blacklist": ["vendor/**"]
    }
  },
  "content": {
    "defaults": {
      "section": "pages",
      "global": {
        "template": "page"
      },
      "sections": {
        "posts": {
          "template": "post",
          "sitemap": {
            "include": true,
            "changefreq": "never",
            "priority": 0.6
          },
          "rss": {
            "include": true
          }
        }
      }
    },
    "markdown": {
      "tables": true,
      "strikethrough": true,
      "task_list": true,
      "definition_list": true,
      "footnotes": true,
      "linkify": true,
      "typographer": true,
      "wikilinks": false,
      "components": false,
      "highlighting": null,
      "parser": {
        "auto_heading_id": false,
        "attribute": false
      },
      "renderer": {
        "hardbreaks": false,
        "xhtml": false
      }
    },
    "git": {
      "backfill": true
    }
  },
  "artefacts": {
    "headers": {
      "path": "_headers",
      "values": {
        "/": {
          "X-Frame-Options": "DENY"
        }
      }
    },
    "redirects": {
      "path": "_redirects",
      "entries": [
        {
          "from": "/old",
          "to": "/new",
          "status": 301
        }
      ]
    },
    "rss": {
      "path": "rss.xml",
      "sections": ["posts"],
      "limit": 50,
      "include_drafts": false
    },
    "sitemap": {
      "path": "sitemap.xml",
      "include_drafts": false
    },
    "robots": {
      "path": "robots.txt",
      "include_sitemap": true,
      "include_drafts": false,
      "sitemaps": [],
      "groups": [
        {
          "user_agents": ["*"],
          "allow": ["/"],
          "disallow": ["/private/"]
        }
      ]
    },
    "not_found": {
      "path": "404.html",
      "template": ""
    },
    "meta": {
      "path": "_shizuka/index.html",
      "json": false
    }
  }
}
```
