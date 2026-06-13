+++
title = "Commands"
description = "Tohru command reference"
template = "tohru_doc"
section = "tohru-docs"
weight = 50
+++

Global flags:

| Flag | Meaning |
| --- | --- |
| `--debug` | Enable debug logging. |
| `--format auto\|plain\|pretty\|json` | Set log output format. |
| `--verbose` | Show changed filesystem paths. |

## Application

| Command | Purpose |
| --- | --- |
| `tohru install [--force] [--no-hooks] [profile]` | Initialize the Tohru store and optionally load a profile. |
| `tohru uninstall [--no-hooks]` | Unload the current profile and remove Tohru application files. |
| `tohru tidy` | Remove untracked backups. |
| `tohru version` | Print the current version. |
| `tohru completion <shell>` | Print a shell completion script for `bash`, `zsh`, `fish`, or `pwsh`. |

## Profiles

| Command | Purpose |
| --- | --- |
| `tohru profile list` | List cached profile slugs and paths. |
| `tohru profile new <slug>` | Create a profile in `~/.tohru/profiles/<slug>`. |
| `tohru profile add <slug> <path>` | Copy a local path into a profile and add manifest entries. |
| `tohru profile tidy <slug>` | Merge nested roots in a profile manifest. |

## Loading

| Command | Purpose |
| --- | --- |
| `tohru plan <profile>` | Preview what loading a profile would do. |
| `tohru load [--force] [--discard-changes] [--no-hooks] <profile>` | Load a profile by path or cached slug. |
| `tohru reload [--force] [--discard-changes] [--no-hooks]` | Unload and load the current profile again. |
| `tohru unload [--force] [--discard-changes] [--no-hooks]` | Unload the current profile and restore tracked conflicts. |

`tohru load` also has the alias `tohru switch`.

## Status And Hooks

| Command | Purpose |
| --- | --- |
| `tohru status [--flat] [--json] [--backups]` | Show tracked objects or backup details. |
| `tohru hooks list <profile>` | Inspect profile hooks. |
| `tohru hooks trusted [profile]` | List trusted hooks. |
| `tohru hooks allow <profile> <hook-id>` | Trust a profile hook locally. |
| `tohru hooks revoke <profile> <hook-id>` | Revoke local trust for a profile hook. |

## Shell Completions

Generate completions with:

```sh
tohru completion zsh
```

Use the shell name you need: `bash`, `zsh`, `fish`, or `pwsh`.
Generated completions include commands, flags, cached profile slugs, and hook IDs where a command accepts them.
