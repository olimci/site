+++
title = "shizuka"
description = "A small, opinionated static site generator written in Go."
template = "shizuka_landing"
section = "shizuka"
weight = 10

[sitemap]
include = true
changefreq = "weekly"
priority = 0.8
+++

Shizuka is a small, opinionated static site generator written in Go.

## Quickstart

Install the binary:

```sh
go install github.com/olimci/shizuka@latest
```

Scaffold a new site, then build it:

```sh
git clone github.com/olimci/shizuka-example-site my-site
cd my-site
shizuka dev
```

That's it. Open the URL it prints and start editing.

## Status

Currently in alpha prerelease. Expect API breakages until `1.0`.
