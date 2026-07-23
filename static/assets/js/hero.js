(() => {
    "use strict";

    const canvas = document.querySelector(".hero-field");
    const hero = canvas.closest(".hero");
    const scrollDepth = 0.14;
    let exitDistance = Math.min(hero.offsetHeight * 0.2, 180);
    let photographScroll = 0;

    const updateScrollState = () => {
        const scroll = Math.max(
            0,
            Math.min(window.scrollY, hero.offsetHeight),
        );
        const progress = Math.max(
            0,
            Math.min(scroll / exitDistance, 1),
        );
        photographScroll = (scroll / hero.offsetHeight) * scrollDepth;
        document.documentElement.style.setProperty("--hero-exit", progress);
        document.documentElement.style.setProperty(
            "--hero-parallax",
            `${scroll * scrollDepth}px`,
        );
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener(
        "resize",
        () => {
            exitDistance = Math.min(hero.offsetHeight * 0.2, 180);
            updateScrollState();
        },
        { passive: true },
    );

    const photographs = [
        {
            source: "/assets/hero-backgrounds/1213.jpg",
            levels: [0.12, 0.92, 0.1, 0.72],
            motion: [0.01, 0.006, 0.17, 0.13],
            phase: 0.2,
        },
        {
            source: "/assets/hero-backgrounds/172.jpg",
            levels: [0.54, 0.76, 0.37, 0.63],
            motion: [0.014, 0.008, 0.15, 0.11],
            phase: 1.0,
        },
        {
            source: "/assets/hero-backgrounds/39.jpg",
            levels: [0.38, 0.9, 0.34, 0.82],
            motion: [0.012, 0.007, 0.18, 0.12],
            phase: 2.2,
        },
        {
            source: "/assets/hero-backgrounds/DSCF5335.jpg",
            levels: [0.1, 0.88, 0.08, 0.7],
            motion: [0.011, 0.007, 0.12, 0.15],
            phase: 3.0,
        },
        {
            source: "/assets/photos/japan-2025/web/fuji.jpg",
            levels: [0.08, 0.88, 0.06, 0.68],
            motion: [0.01, 0.006, 0.14, 0.11],
            phase: 4.1,
        },
        {
            source: "/assets/photos/japan-2025/web/skytree.jpg",
            levels: [0.08, 0.88, 0.06, 0.68],
            motion: [0.011, 0.006, 0.13, 0.16],
            phase: 5.0,
        },
        {
            source: "/assets/photos/romania-2025/web/big-cloud.jpg",
            levels: [0.14, 0.88, 0.1, 0.7],
            motion: [0.013, 0.007, 0.15, 0.1],
            phase: 5.8,
        },
        {
            source: "/assets/photos/romania-2025/web/bird.jpg",
            levels: [0.66, 0.91, 0.6, 0.86],
            motion: [0.014, 0.008, 0.12, 0.15],
            phase: 0.8,
        },
        {
            source: "/assets/photos/romania-2025/web/carol-i.jpg",
            levels: [0.1, 0.91, 0.08, 0.72],
            motion: [0.009, 0.006, 0.15, 0.12],
            phase: 1.6,
        },
        {
            source: "/assets/photos/romania-2025/web/concrete.jpg",
            levels: [0.08, 0.86, 0.06, 0.66],
            motion: [0.011, 0.007, 0.13, 0.17],
            phase: 2.5,
        },
        {
            source: "/assets/photos/romania-2025/web/hut.jpg",
            levels: [0.18, 0.88, 0.13, 0.7],
            motion: [0.012, 0.006, 0.16, 0.11],
            phase: 3.4,
        },
        {
            source: "/assets/photos/romania-2025/web/lost.jpg",
            levels: [0.08, 0.88, 0.06, 0.68],
            motion: [0.013, 0.007, 0.11, 0.15],
            phase: 4.3,
        },
        {
            source: "/assets/photos/romania-2025/web/radio.jpg",
            levels: [0.14, 0.9, 0.1, 0.7],
            motion: [0.011, 0.008, 0.15, 0.13],
            phase: 5.2,
        },
        {
            source: "/assets/photos/romania-2025/web/twek24.jpg",
            levels: [0.08, 0.88, 0.06, 0.68],
            motion: [0.01, 0.006, 0.12, 0.16],
            phase: 6.0,
        },
        {
            source: "/assets/photos/romania-2025/web/where.jpg",
            levels: [0.12, 0.86, 0.08, 0.66],
            motion: [0.013, 0.007, 0.14, 0.11],
            phase: 2.9,
        },
    ];
    const selectedPhotograph =
        photographs[Math.floor(Math.random() * photographs.length)];
    document.documentElement.style.setProperty(
        "--hero-image",
        `url("${selectedPhotograph.source}")`,
    );

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
uniform sampler2D markTexture;
uniform vec2 resolution;
uniform vec2 photographResolution;
uniform float time;
uniform float scrollOffset;
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
    float mark = texture(markTexture, screenUv).a;

    float clock = floor(time * 12.0) / 12.0;

    vec2 uv = coverUv(screenUv);
    uv.y += scrollOffset;
    float zoom = 1.045 + 0.01 * sin(clock * 0.13 + phase);
    uv = (uv - 0.5) / zoom + 0.5;
    uv += vec2(
        sin(clock * motion.z + phase) * motion.x,
        cos(clock * motion.w + phase) * motion.y
    );

    vec2 markRegistration = vec2(
        sin(clock * 0.53 + phase),
        cos(clock * 0.41 + phase)
    ) * 0.008;
    vec2 sampledUv = uv + markRegistration * mark;

    vec3 source = texture(
        photograph,
        clamp(sampledUv, vec2(0.001), vec2(0.999))
    ).rgb;
    float value = luminance(source);
    value += sin(clock * 0.41 + value * 6.283 + phase) * 0.012;

    float outerTone = smoothstep(levels.x, levels.y, value);
    float innerTone = smoothstep(levels.z, levels.w, value);
    float tone = mix(outerTone, 1.0 - innerTone, mark);

    ivec2 pixel = ivec2(gl_FragCoord.xy);
    ivec2 markPhase = ivec2(2, 1) * int(mark > 0.5);
    float threshold = bayer4(pixel + markPhase) * 0.98 + 0.01;
    vec3 black = vec3(0.0314);
    vec3 silver = vec3(0.749, 0.741, 0.714);

    float ditherBit = step(threshold, tone);
    vec3 ditherColour = mix(black, silver, ditherBit);
    float top = smoothstep(0.78, 1.0, screenUv.y);
    ditherColour = mix(ditherColour, black, top * 0.46);

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
    const scrollOffsetLocation = gl.getUniformLocation(
        program,
        "scrollOffset",
    );
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
    gl.uniform1i(gl.getUniformLocation(program, "markTexture"), 1);

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

    const sources = [
        selectedPhotograph.source,
        "/assets/symbols/o.svg",
        "/assets/symbols/l.svg",
        "/assets/symbols/i.svg",
    ];

    Promise.all(sources.map(loadImage)).then(
        ([photograph, symbolO, symbolL, symbolI]) => {
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

            const markCanvas = document.createElement("canvas");
            const markContext = markCanvas.getContext("2d");
            const markTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, markTexture);
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

            const symbols = [symbolO, symbolL, symbolI];

            const resize = () => {
                const renderScale = window.innerWidth < 700 ? 0.6 : 0.52;
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

                markCanvas.width = width;
                markCanvas.height = height;
                const totalWidth = Math.min(width * 0.67, height * 1.72);
                const gap = totalWidth * 0.014;
                const glyph = (totalWidth - gap * 2) / 3;
                const left = (width - totalWidth) / 2;
                const top = (height - glyph) / 2;
                markContext.clearRect(0, 0, width, height);
                for (const [index, symbol] of symbols.entries()) {
                    markContext.drawImage(
                        symbol,
                        left + index * (glyph + gap),
                        top,
                        glyph,
                        glyph,
                    );
                }

                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, markTexture);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    markCanvas,
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
                gl.uniform1f(
                    scrollOffsetLocation,
                    reducedMotion ? 0 : photographScroll,
                );
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
