+++
title = "shape rotator"
description = "n-dimensional cube visualiser"
tags = ["programming", "visualisation"]
template = "post"
section = "posts"
slug = "shape-rotation"

[params.index_icon_morph]
from = "h01,h11,v10,v11,d00b,d10a,d01a,d11b"
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

this project was originally developed as part of my oxford application. it’s a visualiser for n-dimensional hypercubes (tesseracts and beyond), allowing interactive rotation and projection into lower dimensions.

the demo is available [here](/wasm/run.html?path=cube.wasm).  
it’s written in go using ebitengine, gonum, and wasm.
