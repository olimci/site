+++
title = "Configuration"
description = "Configuring Tohru"
template = "tohru_doc"
section = "tohru-docs"
weight = 30
+++

Tohru loads machine-local JSONC configuration from `~/.tohru/config.jsonc`.

Configs may include `$schema` for editor support:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/olimci/tohru/refs/heads/main/_assets/config.schema.json",
  "version": "1.0.0",
  "options": {
    "backups": {
      "enabled": true,
      "prune": "auto"
    },
    "cache_profiles": true,
    "clobber_untracked": true,
    "protected_paths": ["~/.ssh", "~/.gnupg"]
  }
}
```

## Options

| Key | Meaning |
| --- | --- |
| `backups.enabled` | Enable backups for files Tohru would otherwise clobber. |
| `backups.prune` | Backup pruning mode, either `auto` or `manual`. |
| `cache_profiles` | Cache loaded profile slugs for future command lookup. |
| `clobber_untracked` | Replace existing destinations for manifest entries marked `untracked`. |
| `protected_paths` | Extra destinations that profiles may not manage. |

Configured protected paths are checked the same way as built-in protections,
including paths reached through existing parent symlinks.

Tohru also rejects manifests that try to write into the store root or back into
the active profile source tree.

Use `tohru tidy` to remove unreferenced backups when backup pruning is manual.
