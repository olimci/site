# oli.mcinnes.cc

This is the code for my personal website, built with Shizuka.

## Build

Requirements:

- `shizuka` on `PATH`

Build the site:

```sh
sh scripts/build-site.sh
```

The generated site is written to `dist/`.

## Deploy

This repo is set up as a static site.

1. Run `sh scripts/build-site.sh`.
2. Deploy the contents of `dist/` to your static host.

If your host supports publish directories, set the publish directory to `dist/`.

## Notes

- Draft posts are excluded from the public post index, tag archives, RSS, sitemap, and shortlinks.
- Shortlinks are defined in `static/_redirects`.
- `scripts/build-site.sh` clears stale files from `dist/` before rebuilding.
