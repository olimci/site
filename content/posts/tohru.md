+++
title = "Tohru"
description = "Dotfiles manager"
tags = ["programming"]
template = "post"
section = "posts"
slug = "tohru"
weight = 40

featured = true

[sitemap]
include = true
changefreq = "never"
priority = 0.6

[rss]
include = true
+++

[Tohru](https://github.com/olimci/tohru) is my dotfiles manager. It is a small Go CLI for managing personal machine configuration. You can see my dotfiles using Tohru, [here](https://github.com/olimci/dotfiles).

The main goal is to be reversible. The application keeps track of what files it manages, so when you unload a profile, it can restore any files back to their original state.
