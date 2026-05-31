+++
title = "oli.mcinnes.cc"
template = "index"

[sitemap]
include = true
changefreq = "weekly"
priority = 1.0

[params]
banner_image = "/assets/images/banner.png"
banner_alt = "Monochrome tower banner"

# Layout order on the home page. Slots:
#   about              banner + the first markdown section
#   posts              featured posts list
#   photos             featured albums list
#   copy   index = N   render markdown section N inside a copy panel
# Section indices map to body chunks separated by standalone `---` lines.
[[params.layout]]
type = "about"

[[params.layout]]
type = "posts"

[[params.layout]]
type = "copy"
index = 1

[[params.layout]]
type = "photos"
+++

Hi, I'm Oliver.

I'm a physics undergrad at Durham. I'm mostly interested in machine learning, statistical mechanics, and network protocols. I'm proficient in Go and Python, but I'm able to work with other languages as well.

Besides that, I spend a lot of time mountain biking, messing with my car, snowboarding, taking photos, and trying to learn a bit of Japanese.

Please check out my projects or photos below, find more on [GitHub](https://github.com/olimci), or email me at [oli@mcinnes.cc](mailto:oli@mcinnes.cc).

You can see my CV [here](/cv)

---

Please check out some of my photos too:
