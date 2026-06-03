+++
title = "tohru"
description = "A small dotfiles manager for reversible machine configuration."
template = "tohru_landing"
section = "tohru"
weight = 20

[sitemap]
include = true
changefreq = "weekly"
priority = 0.8
+++

Tohru is a small Go CLI for managing personal machine configuration.

## Quickstart

Install the binary:

```sh
go install github.com/olimci/tohru@latest
```

Create a profile, add files, and preview what would change:

```sh
tohru profile new dotfiles
tohru profile add dotfiles ~/.zshrc
tohru plan dotfiles
```

Load the profile when the plan looks right:

```sh
tohru load dotfiles
```

Tohru backs up files it would clobber and restores them when the conflicting
profile is unloaded.

Profiles are described by JSONC manifests named `tohru.jsonc`, with optional
schema metadata for editor support.

## Contribute

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/olimci/tohru).
