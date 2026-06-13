+++
title = "Getting Started"
description = "Getting started with Shizuka"
template = "shizuka_doc"
section = "shizuka-docs"
weight = 10

[sitemap]
include = true
changefreq = "weekly"
priority = 0.9
+++

Install the binary:

```sh
go install github.com/olimci/shizuka@latest
```

Start from the example site:

```sh
git clone github.com/olimci/shizuka-example-site my-site
cd my-site
shizuka dev
```

Open the URL printed by `shizuka dev`, then edit files under `content/`,
`templates/`, and `static/`.

Shell completions are available for `bash`, `zsh`, `fish`, and `pwsh`:

```sh
shizuka completion zsh
```

Continue with [Creating Sites](/shizuka/docs/site-structure/) to see how the
source directory maps to generated output.
