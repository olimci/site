(()=>{"use strict";const n=document.querySelector(".hero-field"),s=n.closest(".hero"),l=.14;let d=Math.min(s.offsetHeight*.2,180),c=0;const i=()=>{const e=Math.max(0,Math.min(window.scrollY,s.offsetHeight)),t=Math.max(0,Math.min(e/d,1));c=e/s.offsetHeight*l,document.documentElement.style.setProperty("--hero-exit",t),document.documentElement.style.setProperty("--hero-parallax",`${e*l}px`)};i(),window.addEventListener("scroll",i,{passive:!0}),window.addEventListener("resize",()=>{d=Math.min(s.offsetHeight*.2,180),i()},{passive:!0});const r=[{source:"/assets/hero-backgrounds/1213.jpg",levels:[.12,.92,.1,.72],motion:[.01,.006,.17,.13],phase:.2},{source:"/assets/hero-backgrounds/172.jpg",levels:[.54,.76,.37,.63],motion:[.014,.008,.15,.11],phase:1},{source:"/assets/hero-backgrounds/39.jpg",levels:[.38,.9,.34,.82],motion:[.012,.007,.18,.12],phase:2.2},{source:"/assets/hero-backgrounds/DSCF5335.jpg",levels:[.1,.88,.08,.7],motion:[.011,.007,.12,.15],phase:3},{source:"/assets/photos/japan-2025/web/fuji.jpg",levels:[.08,.88,.06,.68],motion:[.01,.006,.14,.11],phase:4.1},{source:"/assets/photos/japan-2025/web/skytree.jpg",levels:[.08,.88,.06,.68],motion:[.011,.006,.13,.16],phase:5},{source:"/assets/photos/romania-2025/web/big-cloud.jpg",levels:[.14,.88,.1,.7],motion:[.013,.007,.15,.1],phase:5.8},{source:"/assets/photos/romania-2025/web/bird.jpg",levels:[.66,.91,.6,.86],motion:[.014,.008,.12,.15],phase:.8},{source:"/assets/photos/romania-2025/web/carol-i.jpg",levels:[.1,.91,.08,.72],motion:[.009,.006,.15,.12],phase:1.6},{source:"/assets/photos/romania-2025/web/concrete.jpg",levels:[.08,.86,.06,.66],motion:[.011,.007,.13,.17],phase:2.5},{source:"/assets/photos/romania-2025/web/hut.jpg",levels:[.18,.88,.13,.7],motion:[.012,.006,.16,.11],phase:3.4},{source:"/assets/photos/romania-2025/web/lost.jpg",levels:[.08,.88,.06,.68],motion:[.013,.007,.11,.15],phase:4.3},{source:"/assets/photos/romania-2025/web/radio.jpg",levels:[.14,.9,.1,.7],motion:[.011,.008,.15,.13],phase:5.2},{source:"/assets/photos/romania-2025/web/twek24.jpg",levels:[.08,.88,.06,.68],motion:[.01,.006,.12,.16],phase:6},{source:"/assets/photos/romania-2025/web/where.jpg",levels:[.12,.86,.08,.66],motion:[.013,.007,.14,.11],phase:2.9}],o=r[Math.floor(Math.random()*r.length)];document.documentElement.style.setProperty("--hero-image",`url("${o.source}")`);const e=n.getContext("webgl2",{alpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});if(!e)return;const u=`#version 300 es
precision highp float;

const vec2 positions[3] = vec2[3](
    vec2(-1.0, -1.0),
    vec2( 3.0, -1.0),
    vec2(-1.0,  3.0)
);

void main() {
    gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
}
`,h=`#version 300 es
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
`,a=(t,n)=>{const s=e.createShader(t);if(e.shaderSource(s,n),e.compileShader(s),!e.getShaderParameter(s,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(s));return s},t=e.createProgram();if(e.attachShader(t,a(e.VERTEX_SHADER,u)),e.attachShader(t,a(e.FRAGMENT_SHADER,h)),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(t));e.useProgram(t),e.bindVertexArray(e.createVertexArray());const m=e.getUniformLocation(t,"resolution"),f=e.getUniformLocation(t,"photographResolution"),p=e.getUniformLocation(t,"time"),g=e.getUniformLocation(t,"scrollOffset");e.uniform4fv(e.getUniformLocation(t,"levels"),o.levels),e.uniform4fv(e.getUniformLocation(t,"motion"),o.motion),e.uniform1f(e.getUniformLocation(t,"phase"),o.phase),e.uniform1i(e.getUniformLocation(t,"photograph"),0),e.uniform1i(e.getUniformLocation(t,"markTexture"),1);const v=e=>new Promise((t,n)=>{const s=new Image;s.decoding="async",s.addEventListener("load",()=>t(s),{once:!0}),s.addEventListener("error",n,{once:!0}),s.src=e}),b=[o.source,"/assets/symbols/o.svg","/assets/symbols/l.svg","/assets/symbols/i.svg"];Promise.all(b.map(v)).then(([t,o,i,a])=>{const _=e.createTexture();e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,_),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGB,e.RGB,e.UNSIGNED_BYTE,t),e.uniform2f(f,t.naturalWidth,t.naturalHeight);const l=document.createElement("canvas"),j=l.getContext("2d"),y=e.createTexture();e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,y),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const w=[o,i,a],O=()=>{const a=window.innerWidth<700?.6:.52,t=Math.max(1,Math.round(n.clientWidth*a)),s=Math.max(1,Math.round(n.clientHeight*a));if(n.width===t&&n.height===s)return;n.width=t,n.height=s,e.viewport(0,0,t,s),e.uniform2f(m,t,s),l.width=t,l.height=s;const i=Math.min(t*.67,s*1.72),r=i*.014,o=(i-r*2)/3,c=(t-i)/2,d=(s-o)/2;j.clearRect(0,0,t,s);for(const[e,t]of w.entries())j.drawImage(t,c+e*(o+r),d,o,o);e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,y),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,l)},h=window.matchMedia("(prefers-reduced-motion: reduce)").matches,v=performance.now();let r=0,d=!0;const b=t=>{O();const n=h?4.8:(t-v)/1e3;e.uniform1f(p,n),e.uniform1f(g,h?0:c),e.drawArrays(e.TRIANGLES,0,3)},u=e=>{b(e),r=requestAnimationFrame(u)};if(b(v),s.classList.add("hero-active"),h){window.addEventListener("resize",()=>b(v));return}new IntersectionObserver(([e])=>{d=e.isIntersecting,d&&!document.hidden&&r===0?r=requestAnimationFrame(u):!d&&r!==0&&(cancelAnimationFrame(r),r=0)}).observe(s),document.addEventListener("visibilitychange",()=>{document.hidden&&r!==0?(cancelAnimationFrame(r),r=0):!document.hidden&&d&&r===0&&(r=requestAnimationFrame(u))}),r=requestAnimationFrame(u)})})()