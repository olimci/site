+++
title = "Tohru"
description = "Dotfiles manager"
tags = ["programming"]
template = "post"
section = "posts"
slug = "tohru"

draft = true

[params.index_icon_morph]
from = "v10,d00b,d10a,d01a,d11b"
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

[Tohru](https://github.com/olimci/tohru) is my dotfiles manager. It is a Go CLI for loading, unloading, and tracking personal machine configuration without pretending that symlinking files into `$HOME` is always harmless.

The main goal is to make dotfiles reversible. If a profile wants to write over something that already exists, Tohru can back it up first and restore it later when the profile is unloaded.

## Profiles

A profile is described by a `tohru.json` manifest. The manifest defines metadata, root directories, destination paths, and a tree of files to copy or link.

The tree format is structural: objects are directories, arrays are files, and directory metadata goes under a reserved `"."` key. That makes the manifest readable without needing one huge flat list of paths.

Tohru also caches profile slugs, so after a profile has been loaded once, commands like this can use the short name instead of a full path:

```sh
tohru load my-dotfiles
tohru plan my-dotfiles
tohru unload
```

## Workflow

The CLI covers the usual dotfiles operations:

- `tohru profile new` creates a new empty profile.
- `tohru profile add` copies a local path into a profile and updates the manifest.
- `tohru plan` previews what would change.
- `tohru load`, `reload`, and `unload` apply or remove a profile.
- `tohru status` shows what Tohru is currently tracking.
- `tohru install` and `uninstall` manage the local store.

The important command is probably `plan`. Dotfiles tools can get scary quickly because they operate in exactly the directories you care about. A dry-run view of creates, links, copies, conflicts, backups, and restores makes the whole thing much easier to trust.

## Hooks and Safety

Profiles can define post-operation hooks, for things like reloading an app config after files have changed. Hooks are not trusted automatically: approvals live in the local Tohru store, outside the profile manifest, so pulling someone else's profile cannot silently teach your machine to run arbitrary commands.

There are also protections around dangerous destinations. Tohru rejects manifests that try to write into its own store or back into the active profile source tree, and machine-local config can mark paths like `~/.ssh` or `~/.gnupg` as protected.

## Notes

This is mostly built around the way I move between machines. I want dotfiles to be easy to install, but also easy to reverse, inspect, and repair when a machine already has its own state.
