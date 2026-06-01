+++
title = "Making Templates"
description = "How Shizuka renders pages with Go html/template."
template = "shizuka_doc"
section = "shizuka-docs"
weight = 40
+++

Shizuka templates are Go `html/template` files. Each content page selects a
template by name from the frontmatter key `template = "..."`, unless a config default
supplies the template.

## Folder Structure

By default, `paths.templates` points at the template directory:

```text
templates/
  html/
    page.tmpl
  md/
    demo.tmpl
```

HTML page layouts are loaded from `templates/html/**/*.tmpl`. Markdown
component templates are loaded from `templates/md/**/*.tmpl` when markdown
components are enabled.

## Names

You can define multiple named templates in each file. You can then reference these names in other templates, or in content frontmatter.

Defined template names must be unique across all template files in their folder.

## Page Rendering

Each page is rendered with this root object:

| Key | Meaning |
| --- | --- |
| `.Page` | The current page. |
| `.Site` | Global site data. |

### Page Fields

| Field | Meaning |
| --- | --- |
| `.Page.Title`, `.Page.Description`, `.Page.Tags`, `.Page.Featured`, `.Page.Draft` | Basic page fields. |
| `.Page.Path` | Root-relative route path, for example `/` or `/posts/hello/`. |
| `.Page.Slug` | Page identifier. Explicit slugs come from frontmatter; missing or duplicate slugs receive generated hex values. |
| `.Page.Weight` | Integer ordering hint. |
| `.Page.Canon` | Absolute canonical URL. |
| `.Page.Section` | Resolved section name. |
| `.Page.Params` | Arbitrary map. |
| `.Page.Created`, `.Page.Updated`, `.Page.PubDate` | `time.Time` values. |
| `.Page.File.Available`, `.Page.File.Created`, `.Page.File.Updated`, `.Page.File.Size` | Source file data. |
| `.Page.Body` | `template.HTML`. |
| `.Page.Sections` | `[]template.HTML`, split on Markdown thematic breaks. Use a blank line before a separator after paragraph text. |
| `.Page.ToC` | Markdown headings as `{ Level, ID, Text }` entries. |

#### Optional Git Metadata

| Field | Meaning |
| --- | --- |
| `.Page.Git.Tracked` | Whether the page source is tracked by Git. |
| `.Page.Git.Created`, `.Page.Git.Updated` | First and latest Git commit timestamps for the page source. |
| `.Page.Git.CommitHash`, `.Page.Git.ShortHash`, `.Page.Git.AuthorName` | Latest Git commit data for the page source. |


#### Tables of Contents

You can access headers via `.Page.ToC`. `Level` is the heading level, `Text` is the plain heading text, and `ID` is the rendered heading ID.

Enable `content.markdown.parser.auto_heading_id` to generate IDs for headings
without explicit IDs. Enable `content.markdown.parser.attribute` when pages use
explicit heading IDs such as `## Install {#install}`.

### Site Fields

| Field | Meaning |
| --- | --- |
| `.Site.Title`, `.Site.Description`, `.Site.URL` | Configured site identity. |
| `.Site.Params` | Configured params map. |
| `.Site.Dev`, `.Site.BuildTime` | Build mode and timestamp. |

#### Optional Git Metadata

| Field | Meaning |
| --- | --- |
| `.Site.Git.Available`, `.Site.Git.RepoRoot`, `.Site.Git.GitDir` | Repository paths. |
| `.Site.Git.Branch`, `.Site.Git.CommitHash`, `.Site.Git.ShortHash`, `.Site.Git.Dirty` | Current Git state. |

## Template functions

| Function | Meaning |
| --- | --- |
| `datefmt layout t` | Format a time value; returns `""` for zero time. |
| `uniq values` | Deduplicate `[]string`, preserving original order. |
| `first` | Return the first item from an array-like value. |
| `dict key value ...` | Build a `map[string]any`. |
| `merge map ...` | Merge maps; later maps win. |
| `raw value` | Convert a string to `template.HTML`. |
| `markdown value` | Render Markdown text to `template.HTML` using configured markdown options. |
| `debug value` | Render any value as escaped nested HTML tables for inspection. |
| `debugShort value` | Like `debug`, but omits zero and empty values. |
| `discard` | Abort the current template artefact without failing the build. |

## Queries

| Function | Meaning |
| --- | --- |
| `query sql args...` | Return `[]map[string]any`. |
| `queryRow sql args...` | Return the first row as `map[string]any`, or `nil`. |
| `queryPages sql args...` | Return page template data objects; the result must include `_page`. |
| `queryPage sql args...` | Return the first page template data object, or `nil`; the result must include `_page`. |

The built-in query tables include `pages` and `tags`. `select * from pages ...` includes `_page`, so use `queryPages` when you want page objects. Projected queries like `select Title from pages` return ordinary row data and can use `query`.

```gotmpl
{{ "{{" }} queryPages "select * from pages where Section = ? order by Created desc limit ?" "posts" 5 {{ "}}" }}
```

`tags` has one row per page/tag occurrence. It includes `Tag`, `TagSlug`, `PageSlug`, `PagePath`, `PageTitle`, `Section`, `Draft`, `PubDate`, `Weight`, and `_page`, so tag indexes can filter by page fields without reshaping `.Page.Tags` in templates.

```gotmpl
{{ "{{" }} query "select distinct TagSlug, Tag from tags where Section = ? order by Tag" "posts" {{ "}}" }}
{{ "{{" }} queryPages "select _page from tags where TagSlug = ? order by PubDate desc" "shizuka" {{ "}}" }}
```

If a `data/` directory exists, its manifests may register additional tables for the same query functions.

## Pagination

| Function | Meaning |
| --- | --- |
| `paginate perPage template items` | Abort the current render and render numbered child pages from `items`. |
| `paginateRoot perPage pageTemplate rootTemplate items` | Like `paginate`, but also render `rootTemplate` at the current page route. |
| `paginateOn field template items` | Abort the current render and render one child page per comparable `field` value. |
| `paginateOnRoot field pageTemplate rootTemplate items` | Like `paginateOn`, but also render `rootTemplate` at the current page route. |

Pagination functions are render effects. They discard any bytes already written by the current template and request new template renders.

`paginate` chunks a slice or array into numbered child routes under the current
page:

```gotmpl
{{ "{{" }} queryPages "select * from pages where Section = ? order by Created desc" "posts" | paginate 10 "posts-page" {{ "}}" }}
```

If the current page is `/posts/`, the generated pages are `/posts/1/`,
`/posts/2/`, and so on. Use `paginateRoot` when the source route should also
produce output:

```gotmpl
{{ "{{" }} queryPages "select * from pages where Section = ?" "posts" | paginateRoot 10 "posts-page" "posts-root" {{ "}}" }}
```

`paginateOn` groups input items by a named map key or exported struct field and
renders one child route per group:

```gotmpl
{{ "{{" }} query "select Params.tag as Tag, Title from pages" | paginateOn "Tag" "tag-page" {{ "}}" }}
```

Group values must be comparable. String group values are used directly as URL path segments, so values containing spaces, slashes, or other unsafe path characters fail the build instead of being slugified.

Paginated templates receive the normal `.Page` and `.Site` data, plus `.Pagination`:

| Field | Meaning |
| --- | --- |
| `.Pagination.Items` | Items selected for this generated page or group. |
| `.Pagination.Page`, `.Pagination.Pages` | Current page number and total page count. |
| `.Pagination.Total`, `.Pagination.PerPage` | Total selected items and chunk size. |
| `.Pagination.Prev`, `.Pagination.Next` | Previous and next route paths, when present. |
| `.Pagination.Group` | Group value for `paginateOn`; `nil` for `paginate`. |

Everything else is standard Go template behavior: `range`, `if`, `len`,
`index`, and the usual comparison functions.

## Example

```gotmpl
{{ "{{" }} define "page" {{ "}}" }}
<!doctype html>
<html lang="en">
<body>
    <main>{{ "{{" }} .Page.Body {{ "}}" }}</main>
</body>
</html>
{{ "{{" }} end {{ "}}" }}
```
