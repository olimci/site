+++
title = "go autograd"
description = "go autograd and machine learning library"
featured = true
tags = ["programming", "machine-learning"]
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

for [this project](https://github.com/olimci/autograd) i set myself the challenge of writing a complete autograd / machine learning library from scratch in go.

## design

to simplify the project i broke it up into a few submodules, `autograd/tensor` for ndarray handling, and `autograd/module` for machine learning primatives. the core `autograd` library then provides a collection of autograd operations, as well as functions for backprop and SGD.

i figured MNIST is the obvious MVP machine learning model to implement, so the library includes 2d convolutions and pooling as default primatives. here is an example of a LeNet-style model built in this library:

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

(this model got up to 96% in testing on MNIST, after 10,000 iterations of training!)

i previously wrote a similar library for my A-Level computer science coursework, however that library didn't use an autograd, and instead you had to calculate gradients manually.

## demo

one of the very cool benefits of this being pure go, is that i can compile the go binaries into webassembly, and run the model in the browser. because of this i have an in-browser demo of the MNIST model [here](/wasm/run.html?path=mnist.wasm). (i'm not sure this will work quite right on mobile... sorry)
