+++
title = "Round-Tripping Parsers"
description = "On making a roundtrippable JSON parser"
tags = ["programming"]
section = "posts"
weight = 30

featured = true
+++

[roundtrip](https://github.com/olimci/roundtrip) is a small Go library for parsing JSON (also JSONC, JSON5) in a way that lets you edit a document and write it back out without losing any of the original formatting, comments, or whitespace.

The standard library's `encoding/json` is great for pushing data between Go structs and bytes, but it throws away everything it doesn't care about. Specifically if you unmarshal a config file, change some data, and then remarshal it back, you lose all formatting and comments.

## Method

To do this we simultaneously handle two different representations of the document:

1. A normal Go value
2. A lossless syntax tree

The syntax tree is the source of truth for serialisation. The decoded Go value is just a convenience. When you want to change something, you go through the tree, and the tree only ever rewrites parts you actually touched. Everything else is preserved exactly.

## The Syntax Tree

The underlying data structure is a small generic thing called an SST (syntax-spanning tree). It's functionally very similar to a [rope](https://en.wikipedia.org/wiki/Rope_(data_structure)), a doubly-linked list of tokens with a tree of nodes layered on top, each node holds pointers into the token list marking where it starts and ends:

```go
type SST[TT, NT Enum] struct {
    Tokens *list.List[Token[TT]]
    Root   *Node[TT, NT]
}

type Node[TT, NT Enum] struct {
    Type     NT
    Start    *list.Elem[Token[TT]]
    End      *list.Elem[Token[TT]]
    Children []*Node[TT, NT]
}
```

Serialising back to bytes is then just walking the token list and concatenating literals.

## Anchor Tokens

When you change a value in the tree, you must splice its token representation into the backing list. In the case where two nodes share the same span pointers, you would need to update both, otherwise one node would carry a stale reference to the list.

The solution to this is introducing a zero-width anchor token, that acts as a sentinel for marking node boundaries without changing the output. This way, when you edit the tree, you do not need deal with the spans of any other nodes, meaning edit operations are effectively O(1).

## Design

The high-level API surface mirrors `encoding/json` closely:

```go
var cfg Config
meta, err := json.Unmarshal(data, &cfg)
```

The main difference is that, when decoding, along with the regular error, a metadata object is also returned. This metadata object is the syntax tree.

With this metadata handle, you can navigate and edit the tree by path:

```go
node, err := m.Root().At("compilerOptions", "paths", 0)
err = m.Root().ReplaceAt("./src", "compilerOptions", "baseUrl")
err = m.Root().InsertAt("dist", "exclude", json.Append)
```

...or alternatively by [JSON Pointer](https://www.rfc-editor.org/rfc/rfc6901.txt):

```go
err = m.Root().ReplaceJSONPointer("/compilerOptions/baseUrl", "./src")
```

There's also a [JSON Patch](https://www.rfc-editor.org/rfc/rfc6902.txt) and [Merge Patch](https://www.rfc-editor.org/rfc/rfc7396.txt) implementation on top, applied in the same way.

You can also use this to edit or read comments from the tree:

```go
field, _ := root.ObjectFieldNode("baseUrl")
if c, ok := field.Comments().First(); ok {
    _ = c.ReplaceText(" updated " + c.Text())
}
```

## Future Work

The library is currently JSON-only, but the core is generic over token and node types, so the plan is to extend this to work on other data formats, like TOML, or YAML. The difficulty with these formats though, is that unlike JSON, they do not require that child objects fully syntactically enclosed by their parent, so a more complex model is needed to represent the tree.
