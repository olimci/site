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
  "version": "1.0.0",
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
            "theme.conf": ["l"],
            "kitty.app.png": ["copy", "untracked"]
          },
          "nvim": {
            "after": {
              ".": ["untracked"]
            }
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
| `platforms` | Optional list of `GOOS` platform names where the root is active. |
| `profiles` | Optional list of profile slugs where the root is active. |
| `env` | Optional environment variable matches required for the root to be active. |
| `run` | Optional argv command that materializes the root source before plan or load. |
| `temp` | Remove the dynamic root source after plan or load. Temporary roots are copy-only. |

In the structural tree, arrays represent files and objects represent
directories. Directory metadata uses the reserved `"."` key. An empty array
inherits defaults with no overrides.

Profile source trees encode hidden path segments with `dot_`, so `.config/nvim`
is stored as `dot_config/nvim`. Literal source names starting with `dot_` are
escaped by adding another underscore.

Root `source` and `dest` values expand environment variables.

## Root Selection

Roots can be scoped to platforms, profile slugs, and environment values:

```jsonc
{
  "source": "home",
  "dest": "~",
  "platforms": ["darwin", "linux"],
  "profiles": ["work"],
  "env": {
    "TOHRU_LAPTOP": "1"
  },
  "defaults": {
    "type": "copy"
  },
  "tree": {
    ".gitconfig": []
  }
}
```

The root is skipped unless all configured selectors match.

## Dynamic Roots

Dynamic roots run a command before plan or load so the profile can materialize
source files internally:

```jsonc
{
  "source": "generated/kitty",
  "dest": "~/.config/kitty",
  "run": ["./scripts/build-kitty-profile"],
  "temp": true,
  "defaults": {
    "type": "copy"
  },
  "tree": {
    "kitty.conf": []
  }
}
```

Dynamic root commands run from the profile directory with `TOHRU_ROOT_SOURCE`,
`TOHRU_ROOT_DEST`, `TOHRU_PROFILE_DIR`, `TOHRU_PROFILE_SLUG`, and
`TOHRU_STORE_DIR` in the environment.

Temporary dynamic roots are removed after plan or load and cannot contain link
entries.

## File Flags

| Flag | Meaning |
| --- | --- |
| `link` | Manage the destination as a symbolic link to the profile source. |
| `copy` | Copy the profile source to the destination. |
| `tracked` | Track destination state and restore conflicts when unloading. |
| `untracked` | Manage without recording the destination for restore. Existing destinations are replaced when `clobber_untracked` is enabled. Only valid for copied files or directories. |

Type flags are valid on files only. Directory metadata may set tracking flags.

Aliases are also supported: `l`, `c`, `t`, and `u` for `link`, `copy`,
`tracked`, and `untracked`.
