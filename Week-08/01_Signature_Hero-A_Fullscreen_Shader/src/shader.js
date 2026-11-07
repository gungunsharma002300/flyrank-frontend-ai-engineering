// A single fullscreen triangle covers the whole viewport in one draw
// call (cheaper than two triangles / a quad — no shared edge to
// rasterize twice). Position is derived straight from gl_VertexID,
// no vertex buffer needed at all.
export const vertexShaderSource = `#version 300 es
void main() {
  // gl_VertexID is 0, 1, 2 for our 3 "fake" vertices.
  // This maps them to (-1,-1), (3,-1), (-1,3) — a triangle big enough
  // to cover the full [-1,1] clip-space square and then some.
  vec2 pos = vec2(
    (gl_VertexID == 1) ? 3.0 : -1.0,
    (gl_VertexID == 2) ? 3.0 : -1.0
  );
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;

// The aurora itself. Everything you see is computed per-pixel, every
// frame — there is no texture, image or video anywhere in this file.
export const fragmentShaderSource = `#version 300 es
precision highp float;

uniform float u_time;       // seconds since the animation started
uniform vec2  u_resolution; // canvas size in physical pixels
uniform vec2  u_mouse;      // pointer position, normalized 0..1 (y flipped to match screen space)

out vec4 outColor;

// ---- 2D hash / value noise -------------------------------------------------
// A cheap pseudo-random function: turns a 2D point into a "random"
// float in [0,1). This is the seed everything else is built from.
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Smoothly interpolated noise built on top of the hash above — instead
// of jumping randomly pixel to pixel, it blends between four random
// corner values across each unit cell, giving soft blobby shapes.
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep-style easing
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Fractal Brownian Motion: stacks several octaves of the noise above
// at increasing frequency and decreasing weight. This is what turns
// simple blobs into the layered, wispy "aurora curtain" look.
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.05;        // each octave is finer detail...
    amplitude *= 0.55; // ...and contributes less to the final result
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  // Correct for non-square viewports so the noise field isn't stretched.
  vec2 p = uv;
  p.x *= u_resolution.x / u_resolution.y;

  // Mouse influence: gently shear the sampling domain toward the
  // cursor, so the flow field visibly "leans" where you point without
  // ever snapping or feeling like a hard cutout.
  vec2 mouseNorm = vec2(u_mouse.x * (u_resolution.x / u_resolution.y), u_mouse.y);
  vec2 toMouse = mouseNorm - p;
  p += toMouse * 0.035;

  // Slow, large-scale drift — deliberately unhurried, like ink settling
  // in water rather than a flashing light show. (0.045 here — bump
  // this up/down to make the whole scene faster or slower; everything
  // else scales off this one number.) The sample points are also
  // scaled down (p * 0.9 / 1.3 instead of 1.6 / 2.3) so the shapes read
  // as broad, soft currents instead of busy, small detail.
  float t = u_time * 0.045;
  float flow = fbm(p * 0.9 + vec2(0.0, -t * 1.1));
  float flow2 = fbm(p * 1.3 + vec2(t * 0.35, t * 0.55));
  float field = flow * 0.7 + flow2 * 0.4;

  // --- palette: a single, restrained accent (warm copper) drifting ---
  // --- through near-black and deep indigo — a studio backdrop, -------
  // --- not a rainbow. -------------------------------------------------
  vec3 ink     = vec3(0.035, 0.03, 0.05);
  vec3 indigo  = vec3(0.11, 0.10, 0.22);
  vec3 copper  = vec3(0.78, 0.52, 0.32);
  vec3 highlight = vec3(0.93, 0.79, 0.62);

  vec3 color = ink;
  color = mix(color, indigo,  smoothstep(0.20, 0.60, field));
  color = mix(color, copper,  smoothstep(0.55, 0.90, field) * 0.55);
  color = mix(color, highlight, smoothstep(0.86, 1.05, field) * 0.35);

  // Vertical falloff: darker toward the very top and bottom edges so
  // the curtain reads as a hero backdrop rather than a flat texture.
  float vignette = smoothstep(0.0, 0.35, uv.y) * smoothstep(1.0, 0.55, uv.y);
  color *= mix(0.55, 1.0, vignette);

  // Film grain: a fast per-pixel dither on top of the gradient. This
  // is the "grain pass" the brief calls out — it breaks up banding on
  // the smooth color ramps and adds a bit of texture/depth.
  float grain = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.022;
  color += grain;

  outColor = vec4(color, 1.0);
}
`;
