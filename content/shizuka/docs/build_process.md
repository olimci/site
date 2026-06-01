+++
title = "Build Process"
description = "Read the high-level build dependency graph."
template = "shizuka_doc"
section = "shizuka-docs"
weight = 70
+++

The build pipeline is modeled as a directed acyclic graph of steps. Page indexing feeds the page render path and the optional output artefacts.

<div class="diagram">
    <img src="/assets/shizuka/build-step-dag.svg" alt="Diagram showing Shizuka build steps and their dependencies.">
    <p class="diagram-caption">High-level build step dependency graph.</p>
</div>
