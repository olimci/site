+++
title = "Getting Started"
description = "Getting started with Tohru"
template = "tohru_doc"
section = "tohru-docs"
weight = 10

[sitemap]
include = true
changefreq = "weekly"
priority = 0.9
+++

Install the binary:

```sh
go install github.com/olimci/tohru@latest
```

Create a profile:

```sh
tohru profile new dotfiles
```

Add files from your machine into the profile:

```sh
tohru profile add dotfiles ~/.zshrc
tohru profile add dotfiles ~/.config/kitty
```

Preview the load plan:

```sh
tohru plan dotfiles
```

Load the profile when the plan looks right:

```sh
tohru load dotfiles
```

Tohru records the profile it loaded, tracks managed objects, and restores
backed-up conflicts when the profile is unloaded.

Continue with [Manifests](/tohru/docs/manifests/) to see how profiles are
represented on disk.
