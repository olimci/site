+++
title = "Shizuka"
description = "Static site generator"
tags = ["programming"]
template = "post"
section = "posts"
slug = "shizuka"

draft = true

[params.index_icon_morph]
from = "h00,h11,h02,h12,v00,v01,v10,v21,d10a"
to = "h01,h11,v00,d10a,d11b"
duration_ms = 250
fade_ms = 0
decorative = true

[sitemap]
include = true
changefreq = "never"
priority = 0.6

[rss]
include = true
+++

[Shizuka](https://github.com/olimci/shizuka) is my static site generator. I built it because I kept finding existing SSGs either too magical, too template-opinionated, or just annoying enough that writing my own started to seem reasonable.

This site is built with it, so the project is partly a real tool and partly an excuse to keep sharpening the website until the generator feels right.

## Shape

Shizuka is a Go CLI with a few core commands:

- `shizuka init`, for scaffolding a new site.
- `shizuka dev`, for running a local development server with rebuilds and live reload.
- `shizuka build`, for writing a static output directory.
- `shizuka x ...`, for non-interactive versions of the main commands.

The content model is deliberately plain: Markdown files with front matter, Go templates, static assets, and a config file. It supports TOML, YAML, or JSON config, but the default shape is `shizuka.toml`, `content/`, `templates/`, `static/`, and `dist/`.

## Features

The parts I care about most are the boring ones:

- Content defaults and front matter that behave predictably.
- Goldmark-based Markdown with optional wikilinks.
- Git-backed page metadata, so dates can be inferred from repository history.
- RSS and sitemap generation.
- Netlify-style `_headers` and `_redirects` output.
- Page queries for archive and tag pages.
- Scaffold templates, including remote template sources.
- A dev server that can show template errors without killing the workflow.

The build pipeline is also structured around explicit page and artifact steps, with cache state reused in development mode. That makes rebuilds feel much closer to editing a small local app than running a big one-shot generator every time.

## Why Bother?

The point is control. I wanted a site generator where the behaviour is small enough to fit in my head, but still has the features I actually use: feeds, redirects, generated archives, git metadata, and a development loop that does not get in the way.

It is not trying to be a general replacement for Hugo or Jekyll. It is mostly tuned for how I like writing and maintaining this site.
