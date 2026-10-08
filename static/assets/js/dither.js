(() => {
    "use strict";

    const surfaces = document.querySelectorAll(".dither-surface");
    if (surfaces.length === 0) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    const maxCoverage = 1.0;
    const transitionDuration = 300;

    const vertexSource = `#version 300 es
precision highp float;

const vec2 positions[3] = vec2[3](
    vec2(-1.0, -1.0),
    vec2( 3.0, -1.0),
    vec2(-1.0,  3.0)
);

void main() {
    gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
}
`;

    const fragmentSource = `#version 300 es
precision highp float;

uniform vec4 targetRect;
uniform float targetCoverage;
uniform float targetOpacity;
uniform vec3 colour;

out vec4 fragmentColor;

float bayer4(ivec2 pixel) {
    const float matrix[16] = float[16](
         1.0,  9.0,  3.0, 11.0,
        13.0,  5.0, 15.0,  7.0,
         4.0, 12.0,  2.0, 10.0,
        16.0,  8.0, 14.0,  6.0
    );
    int x = pixel.x & 3;
    int y = pixel.y & 3;
    return matrix[y * 4 + x] / 17.0;
}

void main() {
    vec2 pixel = gl_FragCoord.xy;
    bool inside =
        pixel.x >= targetRect.x &&
        pixel.y >= targetRect.y &&
        pixel.x < targetRect.x + targetRect.z &&
        pixel.y < targetRect.y + targetRect.w;
    float coverage = inside ? targetCoverage : 0.0;
    float opacity = inside ? targetOpacity : 0.0;

    float ditherBit = step(bayer4(ivec2(floor(pixel))), coverage);
    fragmentColor = vec4(colour, ditherBit * opacity);
}
`;

    const compileShader = (gl, type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }
        return shader;
    };

    for (const surface of surfaces) {
        const canvas = surface.querySelector(".dither-field");
        const targets = [...surface.querySelectorAll(".dither-target")];
        const gl = canvas.getContext("webgl2", {
            alpha: true,
            antialias: false,
            depth: false,
            stencil: false,
            powerPreference: "low-power",
        });
        if (!gl) continue;

        const program = gl.createProgram();
        gl.attachShader(
            program,
            compileShader(gl, gl.VERTEX_SHADER, vertexSource),
        );
        gl.attachShader(
            program,
            compileShader(
                gl,
                gl.FRAGMENT_SHADER,
                fragmentSource,
            ),
        );
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program));
        }

        gl.useProgram(program);
        gl.bindVertexArray(gl.createVertexArray());
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const targetRectLocation = gl.getUniformLocation(program, "targetRect");
        const targetCoverageLocation = gl.getUniformLocation(
            program,
            "targetCoverage",
        );
        const targetOpacityLocation = gl.getUniformLocation(
            program,
            "targetOpacity",
        );
        const colourLocation = gl.getUniformLocation(program, "colour");
        const accent = getComputedStyle(surface)
            .getPropertyValue("--project-accent-rgb")
            .split(",")
            .map(Number)
            .map((channel) => channel / 255);
        gl.uniform3fv(colourLocation, accent);

        let renderScale = 1;
        let surfaceRect = surface.getBoundingClientRect();
        let hoveredTarget = null;
        let focusedTarget = null;
        let renderTarget = null;
        let coverage = 0;
        let destinationCoverage = 0;
        let transitionStart = 0;
        let transitionFrom = 0;
        let animationFrame = 0;
        const targetInset = 0;
        const targetBottomBorder = 0;

        const rectFor = (element) => {
            const rect = element.getBoundingClientRect();
            return [
                (rect.left - surfaceRect.left + targetInset) * renderScale,
                (
                    surfaceRect.bottom -
                    rect.bottom +
                    targetInset +
                    targetBottomBorder
                ) * renderScale,
                (rect.width - targetInset * 2) * renderScale,
                (
                    rect.height -
                    targetInset * 2 -
                    targetBottomBorder
                ) * renderScale,
            ];
        };

        const resize = () => {
            surfaceRect = surface.getBoundingClientRect();
            renderScale = window.innerWidth < 700 ? 0.6 : 0.52;
            const width = Math.max(
                1,
                Math.ceil(surfaceRect.width * renderScale),
            );
            const height = Math.max(
                1,
                Math.ceil(surfaceRect.height * renderScale),
            );
            if (canvas.width === width && canvas.height === height) return;

            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);
        };

        const draw = () => {
            resize();
            gl.uniform4fv(
                targetRectLocation,
                renderTarget ? rectFor(renderTarget) : [0, 0, 0, 0],
            );
            gl.uniform1f(targetCoverageLocation, coverage);
            gl.uniform1f(targetOpacityLocation, 0.18);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        const render = (now) => {
            const progress = Math.min(
                (now - transitionStart) / transitionDuration,
                1,
            );
            const eased = 1 - (1 - progress) ** 3;
            coverage =
                transitionFrom +
                (destinationCoverage - transitionFrom) * eased;
            draw();

            if (progress < 1) {
                animationFrame = requestAnimationFrame(render);
            } else {
                coverage = destinationCoverage;
                draw();
                if (!destinationCoverage && renderTarget) {
                    renderTarget.classList.remove("dither-active");
                    renderTarget = null;
                }
                animationFrame = 0;
            }
        };

        const setActiveTarget = (target) => {
            if (target && renderTarget !== target) {
                renderTarget?.classList.remove("dither-active");
                target.classList.add("dither-active");
                renderTarget = target;
                coverage = 0;
                destinationCoverage = maxCoverage;
                transitionFrom = 0;
                transitionStart = performance.now();
                if (reducedMotion) {
                    coverage = destinationCoverage;
                    draw();
                    return;
                }
                if (animationFrame === 0) {
                    animationFrame = requestAnimationFrame(render);
                }
                return;
            }
            const nextCoverage = target ? maxCoverage : 0;
            if (nextCoverage === destinationCoverage) {
                draw();
                return;
            }

            destinationCoverage = nextCoverage;
            transitionFrom = coverage;
            transitionStart = performance.now();
            if (reducedMotion) {
                coverage = destinationCoverage;
                draw();
                if (!destinationCoverage && renderTarget) {
                    renderTarget.classList.remove("dither-active");
                    renderTarget = null;
                }
                return;
            }
            if (animationFrame === 0) {
                animationFrame = requestAnimationFrame(render);
            }
        };

        for (const target of targets) {
            target.addEventListener("pointerenter", () => {
                hoveredTarget = target;
                setActiveTarget(focusedTarget || hoveredTarget);
            });
            target.addEventListener("pointerleave", () => {
                hoveredTarget = null;
                setActiveTarget(focusedTarget);
            });
            target.addEventListener("focus", () => {
                focusedTarget = target;
                setActiveTarget(focusedTarget);
            });
            target.addEventListener("blur", () => {
                focusedTarget = null;
                setActiveTarget(hoveredTarget);
            });
        }

        new ResizeObserver(draw).observe(surface);
        window.addEventListener("resize", draw, { passive: true });
        draw();
    }
})();
