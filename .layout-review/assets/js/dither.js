(()=>{"use strict";const e=document.querySelectorAll(".dither-surface");if(e.length===0)return;const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=1,o=300,i=`#version 300 es
precision highp float;

const vec2 positions[3] = vec2[3](
    vec2(-1.0, -1.0),
    vec2( 3.0, -1.0),
    vec2(-1.0,  3.0)
);

void main() {
    gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
}
`,a=`#version 300 es
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
`,s=(e,t,n)=>{const s=e.createShader(t);if(e.shaderSource(s,n),e.compileShader(s),!e.getShaderParameter(s,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(s));return s};for(const p of e){const v=p.querySelector(".dither-field"),F=[...p.querySelectorAll(".dither-target")],r=v.getContext("webgl2",{alpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"low-power"});if(!r)continue;const l=r.createProgram();if(r.attachShader(l,s(r,r.VERTEX_SHADER,i)),r.attachShader(l,s(r,r.FRAGMENT_SHADER,a)),r.linkProgram(l),!r.getProgramParameter(l,r.LINK_STATUS))throw new Error(r.getProgramInfoLog(l));r.useProgram(l),r.bindVertexArray(r.createVertexArray()),r.enable(r.BLEND),r.blendFunc(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA);const E=r.getUniformLocation(l,"targetRect"),k=r.getUniformLocation(l,"targetCoverage"),A=r.getUniformLocation(l,"targetOpacity"),T=r.getUniformLocation(l,"colour"),z=getComputedStyle(p).getPropertyValue("--project-accent-rgb").split(",").map(Number).map(e=>e/255);r.uniform3fv(T,z);let m=1,b=p.getBoundingClientRect(),y=null,g=null,c=null,h=0,d=0,x=0,j=0,f=0;const w=0,C=0,S=e=>{const t=e.getBoundingClientRect();return[(t.left-b.left+w)*m,(b.bottom-t.bottom+w+C)*m,(t.width-w*2)*m,(t.height-w*2-C)*m]},M=()=>{b=p.getBoundingClientRect(),m=window.innerWidth<700?.6:.52;const e=Math.max(1,Math.ceil(b.width*m)),t=Math.max(1,Math.ceil(b.height*m));if(v.width===e&&v.height===t)return;v.width=e,v.height=t,r.viewport(0,0,e,t)},u=()=>{M(),r.uniform4fv(E,c?S(c):[0,0,0,0]),r.uniform1f(k,h),r.uniform1f(A,.18),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.drawArrays(r.TRIANGLES,0,3)},O=e=>{const t=Math.min((e-x)/o,1),n=1-(1-t)**3;h=j+(d-j)*n,u(),t<1?f=requestAnimationFrame(O):(h=d,u(),!d&&c&&(c.classList.remove("dither-active"),c=null),f=0)},_=e=>{if(e&&c!==e){if(c?.classList.remove("dither-active"),e.classList.add("dither-active"),c=e,h=0,d=n,j=0,x=performance.now(),t){h=d,u();return}f===0&&(f=requestAnimationFrame(O));return}const s=e?n:0;if(s===d){u();return}if(d=s,j=h,x=performance.now(),t){h=d,u(),!d&&c&&(c.classList.remove("dither-active"),c=null);return}f===0&&(f=requestAnimationFrame(O))};for(const e of F)e.addEventListener("pointerenter",()=>{y=e,_(g||y)}),e.addEventListener("pointerleave",()=>{y=null,_(g)}),e.addEventListener("focus",()=>{g=e,_(g)}),e.addEventListener("blur",()=>{g=null,_(y)});new ResizeObserver(u).observe(p),window.addEventListener("resize",u,{passive:!0}),u()}})()