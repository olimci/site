+++
title = "Hooks"
description = "Using Tohru hooks"
template = "tohru_doc"
section = "tohru-docs"
weight = 40
+++

Profiles can define trusted operation hooks:

```jsonc
{
  "hooks": [
    {
      "triggers": ["post_load"],
      "run": ["kitty", "@", "load-config"],
      "cwd": "home"
    }
  ]
}
```

## Fields

| Key | Meaning |
| --- | --- |
| `triggers` | Hook events. Supported values are `pre_load`, `post_load`, `pre_unload`, and `post_unload`. |
| `run` | Command argv. The first entry is the executable. |
| `cwd` | Working directory, either `profile` or `home`. Defaults to `profile`. |

`reload` is an unload followed by a load, so reload runs unload hooks and then
load hooks. There is no separate reload hook event.

Hooks receive `TOHRU_EVENT`, `TOHRU_PROFILE_DIR`, `TOHRU_PROFILE_SLUG`, and
`TOHRU_STORE_DIR` in the environment.

## Trust

Hooks are not trusted automatically. Approvals live in the local Tohru store,
not in the profile manifest.

Inspect hooks declared by a profile:

```sh
tohru hooks list dotfiles
```

Trust or revoke a hook:

```sh
tohru hooks allow dotfiles <hook-id>
tohru hooks revoke dotfiles <hook-id>
```

List trusted hooks:

```sh
tohru hooks trusted
tohru hooks trusted dotfiles
```

When an untrusted hook prompts interactively, choose `run once`, `skip`, or
`trust and run`. Pass `--no-hooks` to load, reload, unload, install, or
uninstall without running hooks.
