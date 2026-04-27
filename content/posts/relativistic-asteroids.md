+++
title = "relativistic asteroids"
description = "arcade physics game with special relativity"
featured = true
tags = ["physics", "programming"]
template = "post"
section = "posts"
slug = "relativistic-asteroids"

[params.index_icon_morph]
from = "h00,h10,h02,h12,d00a,d10b,d01b,d11a"
to = "h01,h11,v00,d10a,d11b"
duration_ms = 250
fade_ms = 0
decorative = true

[sitemap]
include = true
changefreq = "never"
priority = 0.7

[rss]
include = true
+++

this is a small project i originally developed while preparing my oxford application. it combines a simplified relativistic physics engine with a clone of the classic arcade game *asteroids*, implemented in go using ebitengine and compiled to wasm.

the goal was to explore how relativistic effects—such as time dilation and velocity addition—could be integrated into a game environment in an intuitive and visual way.

you can try the demo [here](/wasm/run.html?path=asteroids.wasm). (note: it’s an older project and may have some quirks.)
