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
  "version": "0.2.0",
  "options": {
    "backups": {
      "enabled": true,
      "prune": "auto"
    },
    "cache_profiles": true,
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
| `protected_paths` | Extra destinations that profiles may not manage. |

Configured protected paths are checked the same way as built-in protections,
including paths reached through existing parent symlinks.

Use `tohru tidy` to remove unreferenced backups when backup pruning is manual.
