+++
title = "CV"
description = "My CV"
template = "post"
section = "pages"

[[params.links]]
text = "Email me"
href = "mailto:oli@mcinnes.cc"
icon = "email"

[[params.links]]
text = "GitHub"
href = "https://github.com/olimci"
icon = "script_code"

[sitemap]
include = true
changefreq = "yearly"
priority = 0.9

[rss]
include = false
+++

# Education

## Durham University: _2023-2027 (ongoing)_

- MPhys Physics, Year 4 of 4

- Working at average 2:1

# Work Experience

## Confidential Employer (Defence R&D): _Intern_ - _Summer 2026_

- Worked on proprietary systems in a security-sensitive environment.
- Developed and maintained actively used software using Rust and Python.
- Collaborated with engineers on the design and implementation of internal tooling.
- Further information may be available on request.

## Technology Box: _Python Developer_ - _2022–2025 (part time)_

- Designed and built a production billing automation system from the ground up, using python.
- Replaced many manual billing and data-management tasks with reliable and extensible tooling.
- Developed automated alerting and reporting infrastructure now used in daily internal operations.
- Improved the reliability, visibility, and turnaround time of routine business processes by reducing dependence on manual checks and ad-hoc scripts.
- Worked across the full lifecycle of internal tooling, from requirements gathering and system design through to deployment, iteration, and maintenance.

# Selected Projects

## Go Machine Learning Framework

[Blog post](/posts/autograd) [GitHub](https://github.com/olimci/autograd)

- Built an automatic differentiation and machine learning library in pure Go.
- Implemented tensors, convolution layers, optimisers, and model-training utilities.
- Trained an MNIST classifier to 96% accuracy.
- Compiled models to WebAssembly for browser-based inference demos.

## Shizuka, Custom Static Site Generator

[GitHub](https://github.com/olimci/shizuka)

- Built an extensible static site generator and CLI, supporting multiple content types and automatic RSS and sitemap generation.
- Added development tooling including live preview, project scaffolding, and support for remote template sources.
- Designed flexible configuration for automated deployments and custom project setup.

## frsh, Ephemeral Reverse Shell Tool

[GitHub](https://github.com/olimci/frsh)

- Built a small Python CLI for creating short-lived reverse shells through a temporary fast-reverse-proxy gateway.
- Designed the tool for quick access to machines behind NAT or firewalls without maintaining long-lived SSH configuration.
- Packaged the workflow into a small, reusable command-line tool for fast setup and teardown.
