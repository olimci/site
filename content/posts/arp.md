+++
title = "ARP Fuckery"
description = "Building a distributed object store on ARP"
tags = ["programming"]
template = "post"
section = "posts"
slug = "arp"
weight = 10

featured = true

[sitemap]
include = true
changefreq = "never"
priority = 0.6

[rss]
include = true
+++
[LARP](https://github.com/olimci/larp) is an experiment in using ARP to tunnel data between machines on the same LAN.

## Concept

The core of the protocol is embedding data in gratuitous ARP requests, using a custom protocol header. A normal ARP packet looks like this:

<div class="table-scroll">
<table class="packet-table">
  <tr><th>0</th><th>1</th><th>2</th><th>3</th></tr>

  <tr>
    <td colspan="2">hardware type</td>
    <td colspan="2">protocol type</td>
  </tr>
  <tr>
    <td>hardware size</td>
    <td>protocol size</td>
    <td colspan="2">operation</td>
  </tr>
  <tr>
    <td colspan="2">sender hardware address</td>
    <td colspan="2">sender protocol address</td>
  </tr>
  <tr>
    <td colspan="2">target hardware address</td>
    <td colspan="2">target protocol address</td>
  </tr>
</table>
</div>

A gratuitous ARP request is one that has the same sender and target protocol address. These packets are used to announce the sender's MAC address on the network. For our purposes, we use them because they tend to have good deliverability on most networks.

By using the Local Experimental EtherType (0x88B5), we can use a custom protocol address size and embed our data in the sender and target protocol-address fields.

Given this, our ARP packets end up looking like this:

<div class="table-scroll">
<table class="packet-table">
  <tr><th>0</th><th>1</th><th>2</th><th>3</th></tr>

  <tr>
    <td colspan="2">hardware type</td>
    <td colspan="2">protocol type</td>
  </tr>

  <tr>
    <td>hardware size</td>
    <td>message size</td>
    <td colspan="2">ARP request</td>
  </tr>

  <tr>
    <td colspan="2">our MAC address</td>
    <td colspan="2">message body</td>
  </tr>

  <tr>
    <td colspan="2">00:00:00:00:00:00</td>
    <td colspan="2">duplicate message body</td>
  </tr>
</table>
</div>

## Sending Data With This

For no particularly good reason, the protocol shape I arrived at was effectively a distributed object store.

To differentiate our packets from any other ARP traffic, the embedded protocol address starts with the magic prefix `0x70697275`.

The magic number is followed by a one-byte packet type. The protocol currently has the following packet types:

- 0x00 `HAVE`, for announcing ownership of an object.
- 0x01 `WANT`, for requesting specific fragments of an object.
- 0x02 `FRAG`, for sending one fragment of an object.

All multi-byte integers are encoded big-endian. `object id` is the first 16 bytes of the object's SHA-256 hash, while `object hash` is the full 32-byte SHA-256 hash.

The shared packet header is:

<div class="table-scroll">
<table class="packet-table">
  <tr><th>bytes</th><th>field</th></tr>
  <tr><td>4</td><td>magic: <code>0x70697275</code></td></tr>
  <tr><td>1</td><td>packet type</td></tr>
</table>
</div>

`HAVE` packets announce that a peer has an object:

<div class="table-scroll">
<table class="packet-table">
  <tr><th>bytes</th><th>field</th></tr>
  <tr><td>16</td><td>object id</td></tr>
  <tr><td>8</td><td>object size</td></tr>
  <tr><td>32</td><td>object hash</td></tr>
  <tr><td>2</td><td>fragment count</td></tr>
  <tr><td>remaining</td><td>metadata</td></tr>
</table>
</div>

`WANT` packets request one or more fragments from an announced object:

<div class="table-scroll">
<table class="packet-table">
  <tr><th>bytes</th><th>field</th></tr>
  <tr><td>16</td><td>object id</td></tr>
  <tr><td>2</td><td>fragment count</td></tr>
  <tr><td>2 each</td><td>fragment indices</td></tr>
</table>
</div>

`FRAG` packets carry one fragment of object data:

<div class="table-scroll">
<table class="packet-table">
  <tr><th>bytes</th><th>field</th></tr>
  <tr><td>16</td><td>object id</td></tr>
  <tr><td>2</td><td>fragment index</td></tr>
  <tr><td>remaining</td><td>payload</td></tr>
</table>
</div>

I found that packets much larger than 100 bytes were often poorly delivered, so we have an 100-byte advisory limit on packet bodies. Similarly we cannot specify a protocol address larger than 255 bytes, so the maximum possible fragment payload size is ~82 bytes.

Objects have an ID, full hash, size, fragment count, and a small metadata blob. The client keeps track of partial objects, retries missing fragments, pins owned or received objects when needed, and emits progress events as fragments arrive.

By default the client registers every announced object it receives. You can configure an admission policy to reject objects before downloading them, and you can configure whether owned or received objects should be pinned. For example, the chat demo application only admits chat messages.

## Using the Protocol

To test out the protocol, I made a couple of CLI demos: a simple chat application and a file-transfer demo inspired by Magic Wormhole. A neat property of the chat demo is that message history is replicated on each peer, so you can reconstruct the entire chat history even if none of the original peers are online.

## Inspiration

This project was heavily inspired by [kognise/arpchat](https://github.com/kognise/arpchat). Please check it out!
