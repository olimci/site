+++
title = "Measuring the Optical Rotation of Chiral Molecules"
description = "A polarimetry experiment with sucrose, glucose, and fructose"
tags = ["physics"]
section = "posts"

[params]
has_latex = true

[[params.links]]
text = "Full report (PDF)"
href = "/assets/documents/RLI.pdf"
icon = "page_white_acrobat"
+++

This was my second-year research-led investigation into the optical rotation of sugar solutions. Chiral molecules lack mirror symmetry and interact asymmetrically with circularly polarised light. When linearly polarised light passes through a solution of them, the plane of polarisation rotates. I measured that rotation for sucrose, glucose, and fructose using a 520 nm laser.

The laser passed through a static polariser and a tube containing the sugar solution, then through an adjustable polariser to a light sensor. For each sample, we recorded the transmitted intensity as the second polariser rotated. We fitted Malus' law to the normalised intensity to find the angle \\(\\phi\\) of the light's polarisation:

<div class="math-display">
\[
I(\theta) = \cos^2(\theta - \phi).
\]
</div>

The polar plots show the concentration series and fitted curves for glucose, fructose, and sucrose, with the residuals underneath. The change in phase as concentration increases is what we use to measure rotation.

<figure>
<a href="/assets/images/academic/polar-plots.png"><img src="/assets/images/academic/polar-plots.png" alt="Polar intensity curves for glucose, fructose, and sucrose at different concentrations, with fitted curves and residuals below each plot."></a>
</figure>

We then plotted each fitted phase relative to the water control against concentration to extract the *specific rotation* \\( [\\alpha] = \\alpha / (lc) \\), where \\(\\alpha\\) is the observed rotation, \\(l\\) is the path length and \\(c\\) is the concentration. The 50 g/L sucrose measurement was excluded from this fit.

<figure>
<img src="/assets/images/academic/optical-rotation.png" alt="Rotation relative to water against sugar concentration. Sucrose and glucose rise approximately linearly; fructose falls. Points show measurements and lines show fits.">
</figure>

At 520 nm, we measured specific rotations of +89.7 ± 1.0° for sucrose, +138.8 ± 1.6° for glucose, and −122.8 ± 1.4° for fructose. The direction of rotation matched expectations, but the magnitudes were quite different from literature values. Those values are usually reported at the sodium D-line (589 nm), though, and optical rotation depends on wavelength. We used Drude's dispersion model, \\( [\\alpha]_\\lambda = A/(\\lambda^2 - \\lambda_0^2) \\), to estimate the equivalent rotation at 589 nm:

<div class="math-display">
\[
[\alpha]_{589} = [\alpha]_{520}
\frac{520^2 - \lambda_0^2}{589^2 - \lambda_0^2}.
\]
</div>

Using literature values for \\(\\lambda_0\\), this brought sucrose to +68.6 ± 0.8°, close to its literature value of about +66°. Glucose remained anomalously high at +106.7 ± 1.2°; we couldn't apply the same correction to fructose because we couldn't find the necessary dispersion parameter.

One possible explanation for the glucose result is **mutarotation**. When glucose dissolves, its α and β forms slowly interconvert, and each has a different specific rotation. A solution measured before reaching equilibrium could therefore rotate light more strongly. This is consistent with our result, but we didn't measure rotation over time, so it isn't something we could confirm directly. The experiment also had only one trial per concentration, and uncertainty in concentration wasn't included in the fits.

The [full report](/assets/documents/RLI.pdf) has the plots, calculations, and a more detailed discussion of the uncertainties.
