(() => {
    "use strict";

    const canvas = document.querySelector(".hero-field");
    const hero = canvas.closest(".hero");
    const wordmark = hero.querySelector(".forum-banner-link img");

    const selectedPhotograph = {
        source: "/assets/photos/romania-2025/web/bird.jpg",
        levels: [0.66, 0.91, 0.6, 0.86],
        motion: [0.014, 0.008, 0.12, 0.15],
        phase: 0.8,
    };
    const gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
    });
    if (!gl) return;

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

uniform sampler2D photograph;
uniform sampler2D wordmark;
uniform vec2 resolution;
uniform vec2 photographResolution;
uniform float time;
uniform vec4 levels;
uniform vec4 motion;
uniform float phase;

out vec4 fragmentColor;

vec2 coverUv(vec2 uv) {
    float viewportAspect = resolution.x / resolution.y;
    float photographAspect = photographResolution.x / photographResolution.y;
    vec2 scale = vec2(1.0);
    if (viewportAspect > photographAspect) {
        scale.y = photographAspect / viewportAspect;
    } else {
        scale.x = viewportAspect / photographAspect;
    }
    return (uv - 0.5) * scale + 0.5;
}

float luminance(vec3 colour) {
    return dot(colour, vec3(0.2126, 0.7152, 0.0722));
}

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
    vec2 screenUv = gl_FragCoord.xy / resolution;
    float clock = floor(time * 12.0) / 12.0;

    vec2 uv = coverUv(screenUv);
    float zoom = 1.2 + 0.01 * sin(clock * 0.13 + phase);
    uv = (uv - 0.5) / zoom + 0.5;
    uv += vec2(
        sin(clock * motion.z + phase) * motion.x,
        cos(clock * motion.w + phase) * motion.y
    );

    vec3 source = texture(
        photograph,
        clamp(uv, vec2(0.001), vec2(0.999))
    ).rgb;
    float value = luminance(source);
    value += sin(clock * 0.41 + value * 6.283 + phase) * 0.012;

    float tone = smoothstep(levels.x, levels.y, value);

    ivec2 pixel = ivec2(gl_FragCoord.xy);
    float threshold = bayer4(pixel) * 0.98 + 0.01;
    vec3 black = vec3(0.115, 0.137, 0.165);
    vec3 silver = vec3(0.626, 0.734, 0.629);

    float ditherBit = step(threshold, tone);
    vec3 ditherColour = mix(black, silver, ditherBit);
    float top = smoothstep(0.78, 1.0, screenUv.y);
    ditherColour = mix(ditherColour, black, top * 0.46);

    float markBit = step(threshold, texture(wordmark, screenUv).a * 0.95);
    ditherColour = mix(ditherColour, ditherColour * 0.22, markBit);

    fragmentColor = vec4(ditherColour, 1.0);
}
`;

    const compileShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }
        return shader;
    };

    const program = gl.createProgram();
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);
    gl.bindVertexArray(gl.createVertexArray());

    const resolutionLocation = gl.getUniformLocation(program, "resolution");
    const photographResolutionLocation = gl.getUniformLocation(
        program,
        "photographResolution",
    );
    const timeLocation = gl.getUniformLocation(program, "time");
    gl.uniform4fv(
        gl.getUniformLocation(program, "levels"),
        selectedPhotograph.levels,
    );
    gl.uniform4fv(
        gl.getUniformLocation(program, "motion"),
        selectedPhotograph.motion,
    );
    gl.uniform1f(
        gl.getUniformLocation(program, "phase"),
        selectedPhotograph.phase,
    );
    gl.uniform1i(gl.getUniformLocation(program, "photograph"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "wordmark"), 1);

    const loadImage = (source) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.decoding = "async";
            image.addEventListener("load", () => resolve(image), {
                once: true,
            });
            image.addEventListener("error", reject, { once: true });
            image.src = source;
        });

    Promise.all([loadImage(selectedPhotograph.source), loadImage(wordmark.src)]).then(
        ([photograph, wordmarkImage]) => {
            const photographTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, photographTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                gl.CLAMP_TO_EDGE,
            );
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                gl.CLAMP_TO_EDGE,
            );
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGB,
                gl.RGB,
                gl.UNSIGNED_BYTE,
                photograph,
            );
            gl.uniform2f(
                photographResolutionLocation,
                photograph.naturalWidth,
                photograph.naturalHeight,
            );

            const wordmarkCanvas = document.createElement("canvas");
            const wordmarkContext = wordmarkCanvas.getContext("2d");
            const wordmarkTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, wordmarkTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            const resize = () => {
                const renderScale = 0.52;
                const width = Math.max(
                    1,
                    Math.round(canvas.clientWidth * renderScale),
                );
                const height = Math.max(
                    1,
                    Math.round(canvas.clientHeight * renderScale),
                );
                if (canvas.width === width && canvas.height === height) return;

                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
                gl.uniform2f(resolutionLocation, width, height);

                wordmarkCanvas.width = width;
                wordmarkCanvas.height = height;
                const canvasRect = canvas.getBoundingClientRect();
                const wordmarkRect = wordmark.getBoundingClientRect();
                wordmarkContext.drawImage(
                    wordmarkImage,
                    ((wordmarkRect.left - canvasRect.left) / canvasRect.width) * width,
                    ((wordmarkRect.top - canvasRect.top) / canvasRect.height) * height,
                    (wordmarkRect.width / canvasRect.width) * width,
                    (wordmarkRect.height / canvasRect.height) * height,
                );
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, wordmarkTexture);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    wordmarkCanvas,
                );
            };

            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;
            const started = performance.now();
            let animationFrame = 0;
            let heroVisible = true;

            const draw = (now) => {
                resize();
                const seconds = reducedMotion ? 4.8 : (now - started) / 1000;
                gl.uniform1f(timeLocation, seconds);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
            };

            const render = (now) => {
                draw(now);
                animationFrame = requestAnimationFrame(render);
            };

            draw(started);
            hero.classList.add("hero-active");

            if (reducedMotion) {
                window.addEventListener("resize", () => draw(started));
                return;
            }

            new IntersectionObserver(([entry]) => {
                heroVisible = entry.isIntersecting;
                if (heroVisible && !document.hidden && animationFrame === 0) {
                    animationFrame = requestAnimationFrame(render);
                } else if (!heroVisible && animationFrame !== 0) {
                    cancelAnimationFrame(animationFrame);
                    animationFrame = 0;
                }
            }).observe(hero);

            document.addEventListener("visibilitychange", () => {
                if (document.hidden && animationFrame !== 0) {
                    cancelAnimationFrame(animationFrame);
                    animationFrame = 0;
                } else if (
                    !document.hidden &&
                    heroVisible &&
                    animationFrame === 0
                ) {
                    animationFrame = requestAnimationFrame(render);
                }
            });

            animationFrame = requestAnimationFrame(render);
        },
    );
})();
