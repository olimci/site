+++
title = "Manifests"
description = "Writing Tohru manifests"
template = "tohru_doc"
section = "tohru-docs"
weight = 20
+++

Profiles are defined by a `tohru.jsonc` manifest.

Manifests should include the version of Tohru they target. Tohru rejects
manifests whose version is incompatible with the running binary according to
semver.

JSONC manifests may include `$schema` for editor support:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/olimci/tohru/refs/heads/main/_assets/manifest.schema.json",
  "version": "0.2.0",
  "profile": {
    "slug": "my-dotfiles",
    "name": "my-dotfiles",
    "description": "personal setup"
  },
  "roots": [
    {
      "source": "home",
      "dest": "~",
      "defaults": {
        "type": "link"
      },
      "tree": {
        ".zshrc": ["copy"],
        ".config": {
          "kitty": {
            "kitty.conf": [],
            "theme.conf": [],
            "kitty.app.png": ["copy", "untracked"]
          }
        }
      }
    }
  ]
}
```

## Profile

| Key | Meaning |
| --- | --- |
| `slug` | Stable identifier used for cached profile lookup. |
| `name` | Human-readable profile name. |
| `description` | Optional profile description. |

When a loaded profile has `profile.slug`, Tohru caches `slug -> profile path`
in state. Future commands can use the slug instead of the full manifest path.

## Roots

Each root maps a source tree inside the profile to a destination tree on the
machine.

| Key | Meaning |
| --- | --- |
| `source` | Profile source directory. Relative paths are resolved from the profile directory. |
| `dest` | Destination directory. `~` expands to the current user's home directory. |
| `defaults.type` | Default file operation, either `link` or `copy`. |
| `defaults.track` | Optional default tracking mode for copied files and directories. |
| `tree` | Structural tree describing managed destinations. |

In the structural tree, arrays represent files and objects represent
directories. Directory metadata uses the reserved `"."` key. An empty array
inherits defaults with no overrides.

Profile source trees encode hidden path segments with `dot_`, so `.config/nvim`
is stored as `dot_config/nvim`. Literal source names starting with `dot_` are
escaped by adding another underscore.

## File Flags

| Flag | Meaning |
| --- | --- |
| `link` | Manage the destination as a symbolic link to the profile source. |
| `copy` | Copy the profile source to the destination. |
| `tracked` | Track destination state and restore conflicts when unloading. |
| `untracked` | Manage without recording the destination for restore. Only valid for copied files or directories. |

Type flags are valid on files only. Directory metadata may set tracking flags.
