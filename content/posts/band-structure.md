+++
title = "band structure"
description = "silicon band structure visualisation"
featured = true
tags = ["physics", "programming"]
template = "post"
section = "posts"
slug = "band-structure"

[params.index_icon_morph]
from = "h00,h10,h02,h12,v00,v01,v20,v21,d00a,d10b,d01b,d11a"
to = "h01,h11,v00,d10a,d11b"
duration_ms = 250
fade_ms = 0
decorative = true

[sitemap]
include = true
changefreq = "never"
priority = 0.6

[rss]
include = true
+++

this is a silicon band structure visualisation. the underlying band data was calculated with python, and it’s rendered with three.js. it scored 75%.

you can view it [here](/band-structure.html) and see the poster pdf [here](/pdfs/comp_poster.pdf)
