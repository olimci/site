+++
title = "Go Autograd"
description = "Go autograd and machine learning library"
featured = true
tags = ["programming", "math"]
template = "post"
section = "posts"
slug = "autograd"

[params.index_icon_morph]
from = "h00,h10,h02,h12,d00a,d01b"
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

For [this project](https://github.com/olimci/autograd), I set myself the challenge of writing a complete autograd and machine learning library from scratch in Go.

## Design

To simplify the project, I broke it up into a few submodules: `autograd/tensor` for ndarray handling, and `autograd/module` for machine learning primitives. The core `autograd` library then provides a collection of autograd operations, as well as functions for backprop and SGD.

I figured MNIST is the obvious MVP machine learning model to implement, so the library includes 2D convolutions and pooling as default primitives. Here is an example of a LeNet-style model built in this library:

```go
var eval bool
model := module.Sequential{
    module.Conv2D(1, 32, 3, 3, 1, 1, 1, 1).InitHe(),
    module.ReLU,
    module.Conv2D(32, 64, 3, 3, 1, 1, 1, 1).InitHe(),
    module.ReLU,
    module.MaxPool2D(2, 2, 2, 2),
    module.Conv2D(64, 128, 3, 3, 1, 1, 1, 1).InitHe(),
    module.ReLU,
    module.MaxPool2D(2, 2, 2, 2),
    module.Flatten,
    module.Affine(128*7*7, 256).InitHe(),
    module.ReLU,
    module.Affine(256, 10).InitXavier(),
    module.DoWhen(&eval, module.Softmax),
}
```

(This model got up to 96% in testing on MNIST, after 10,000 iterations of training.)

## Demo

Since the project is pure Go, it can be compiled into WebAssembly, so you can run models in the browser. You can see a demo [here](/wasm/run.html?path=mnist.wasm). (It probably won't work on mobile browsers.)
