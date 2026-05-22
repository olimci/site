+++
title = "ARP Fuckery"
description = "Building a distributed object store on ARP"
tags = ["programming"]
template = "post"
section = "posts"
slug = "arp"

draft = true

[sitemap]
include = true
changefreq = "never"
priority = 0.6

[rss]
include = true
+++
[LARP](https://github.com/olimci/larp) is an experiment in using ARP to tunnel data between machines on the same LAN.

## Concept

The core of the protocol is embedding data in gratuitous ARP requests, using a custom protocol header. Specifically, an ARP packet looks like this:

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

A gratuitous ARP request is one that has the same sender and target protocol address. They are used to announce the sender's MAC address on the network. We use them because they tend to have good deliverability on most networks.

By using the Local Experimental Ethertype (0x88B5) we can make effectively arbitrarily large protocol addresses, to embed data in.

Given this, our arp packets end up looking like this:

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

## Sending Data With This

For no paticularly good reason, the protocol shape I arrived at was a effectively a distributed object store.

To differentiate our packets from any other ARP traffic, we use a custom magic prefix 0x70697275 in the protocol field.

The magic number is then followed by the packet type. For the protocol we have the following types:

- 0x00 `HAVE`, for announcing ownership of an object.
- 0x01 `WANT`, for requesting specific fragments of an object.
- 0x02 `FRAG`, for sending one fragment of an object.

TODO: put full protocol spec here

Objects have an ID, full hash, size, fragment count, and a small metadata blob. The client keeps track of partial objects, retries missing fragments, pins owned or received objects when needed, and emits progress events as fragments arrive.

By default the client just tries to replicate/pin all objects it receives, however you can configure a pinning policy to only pin certain objects, so for example the chat application will only pin chat messages. (A cool feature of this is that you can independently reconstruct the entire chat history from the pinned objects, even if none of the original peers are online.)

## Using the Protocol

To test out the protocol, I made a few CLI demos. One of which was a simple chat application. The other was a file transfer demo, inspired by magic wormhole.

## Inspiration

This project was heavily inspired by [kognise/arpchat](https://github.com/kognise/arpchat). Please check it out!
