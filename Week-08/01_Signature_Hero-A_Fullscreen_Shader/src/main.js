import './style.css';
import { vertexShaderSource, fragmentShaderSource } from './shader.js';

const canvas = document.getElementById('aurora-canvas');
const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });

if (!gl) {
  // No WebGL2 support: fall back to a plain CSS gradient instead of a
  // blank black screen. The hero text stays fully readable either way.
  canvas.style.display = 'none';
  document.body.style.background =
    'radial-gradient(ellipse at 50% 30%, #3a2a1c 0%, #14111c 55%, #06040c 100%)';
} else {
  runAuroraShader(gl, canvas);
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

function runAuroraShader(gl, canvas) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`);
  }
  gl.useProgram(program);

  const uTime = gl.getUniformLocation(program, 'u_time');
  const uResolution = gl.getUniformLocation(program, 'u_resolution');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');

  // --- Responsible sizing: cap the device pixel ratio. Shaders run
  // once per physical pixel, so an uncapped 3x/4x phone DPR can 9-16x
  // the fragment-shader cost for no visible benefit. ------------------
  const MAX_DPR = 2;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.floor(window.innerWidth * dpr);
    const height = Math.floor(window.innerHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }
  resize();
  window.addEventListener('resize', resize);

  // --- Mouse tracking, smoothed toward its target so the flow field
  // eases rather than snaps. Falls back to screen center on touch
  // devices that never fire a mousemove. ------------------------------
  const mouse = { x: 0.5, y: 0.5 };
  const mouseTarget = { x: 0.5, y: 0.5 };
  window.addEventListener('pointermove', (e) => {
    mouseTarget.x = e.clientX / window.innerWidth;
    mouseTarget.y = 1 - e.clientY / window.innerHeight; // flip to match GL's bottom-left origin
  });

  // --- prefers-reduced-motion: render exactly one static frame and
  // stop — no rAF loop is ever started. A visible opt-in button lets
  // the visitor turn the animation on anyway. -------------------------
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggleButton = document.getElementById('reduced-motion-toggle');
  let animationEnabled = !reduceMotionQuery.matches;

  function drawFrame(time) {
    gl.uniform1f(uTime, time);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let rafId = null;
  let startTime = performance.now();

  function loop(now) {
    // Ease the mouse position toward its target for a gentle, organic
    // response instead of an instant jump.
    mouse.x += (mouseTarget.x - mouse.x) * 0.05;
    mouse.y += (mouseTarget.y - mouse.y) * 0.05;

    const elapsed = (now - startTime) / 1000;
    drawFrame(elapsed);
    rafId = requestAnimationFrame(loop);
  }

  function startAnimation() {
    if (rafId !== null) return;
    startTime = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  function stopAnimation() {
    if (rafId === null) return;
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  if (animationEnabled) {
    startAnimation();
  } else {
    // Single static frame at t = 0 — a still, non-distracting aurora.
    drawFrame(0);
    toggleButton.hidden = false;
    toggleButton.addEventListener('click', () => {
      animationEnabled = true;
      toggleButton.hidden = true;
      startAnimation();
    });
  }

  // Ships responsibly: don't burn GPU/battery painting a hidden tab.
  document.addEventListener('visibilitychange', () => {
    if (!animationEnabled) return;
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  // If the OS-level setting changes mid-session, respect it live.
  reduceMotionQuery.addEventListener('change', (e) => {
    if (e.matches) {
      animationEnabled = false;
      stopAnimation();
      drawFrame(0);
      toggleButton.hidden = false;
    } else {
      toggleButton.hidden = true;
      animationEnabled = true;
      startAnimation();
    }
  });
}
