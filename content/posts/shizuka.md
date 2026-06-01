+++
title = "Shizuka"
description = "Static site generator"
tags = ["programming"]
section = "posts"
weight = 40

featured = true
+++

[Shizuka](https://github.com/olimci/shizuka) is my static site generator. I built it because I wasn't particularly happy with existing static site generators, and I thought it would be an interesting project to make my own.

This site itself is generated using Shizuka. You can see the source code [here](https://github.com/olimci/site).

## Features

I intentionally kept the feature set minimal, but by design you can implement lots of advanced features on top of it, just by writing your own templates.

Currently it supports:

- Markdown, with optional extra features.
- A page query system.
- Git-backed page metadata.
- RSS and sitemap generation.
- Automatic `_headers` and `_redirects` generation.
- A scaffolding system for creating sites from templates.
- A hot-reloading dev server.

It also supports caching, and a smart artefact build system, so rebuild times are relatively fast even for large sites. (This site builds in ~353ms on my machine.)

The query system is a small in-memory SQL interpreter that I wrote, that uses go structs to represent database rows. This allows for relatively complex page behaviour, without hardcoding any defaults. You can see the project [here](https://github.com/olimci/structql).
