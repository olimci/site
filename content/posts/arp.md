+++
title = "ARP Fuckery"
description = "Building a distributed object store on ARP"
draft = true
tags = ["programming"]
template = "post"
section = "posts"
slug = "arp"

[params.index_icon_morph]
from = "v00,v10,v11,v20,d00a,d00b,d10a,d10b"
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

[LARP](https://github.com/olimci/larp) is a small Go experiment in using ARP as a local-network transport for a distributed object store.

The basic idea is stupid enough to be interesting: take gratuitous ARP requests, hide a tiny protocol inside the fields that would normally identify IP addresses, and use that to announce, request, and transfer object fragments between machines on the same LAN. It is absolutely not a sensible way to move data, but it is a fun way to learn where the edges of a familiar protocol actually are.

## Transport

The packet layer is built around three message types:

- `HAVE`, for announcing that a peer has an object.
- `WANT`, for requesting specific fragments of an object.
- `FRAG`, for sending one fragment payload.

Objects have an ID, full hash, size, fragment count, and a small metadata blob. The client keeps track of partial objects, retries missing fragments, pins owned or received objects when needed, and emits progress events as fragments arrive.

The ARP part is mostly a carrier. LARP filters for gratuitous ARP requests with a project-specific magic prefix, then decodes the payload into one of the internal packet types. That makes the whole thing local-network only, broadcast-heavy, and deeply questionable, which is exactly the point.

## Demos

The repo has a reusable `larp` package and a CLI with two demos.

`larp chat` is a terminal chat prototype built on top of the object transport. Messages are small objects with chat metadata, and peers announce join/leave events as they come and go.

`larp wormhole` is a file-transfer flow for machines on the same network. The sender creates an object for the file and prints a receive code; the receiver uses that code to admit only the matching transfer, downloads the fragments, writes the file, and sends back a receipt object.

## Notes

This is mostly a protocol toy rather than a useful file-transfer tool. The interesting bit is not performance or practicality, but the shape of the abstraction: an object store where discovery, transfer, and progress all happen through tiny packets pretending to be ARP.
