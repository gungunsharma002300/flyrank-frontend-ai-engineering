(() => {
  "use strict";

  const SHAKE_MS = 380;
  const SUCCESS_HOLD_MS = 1300;
  const ERROR_HOLD_MS = 1800;
  const LOADING_MIN_MS = 650;
  const LOADING_MAX_MS = 1450;

  let forceMode = "random"; // 'random' | 'success' | 'error'

  const buttons = Array.from(document.querySelectorAll(".brain-btn"));
  // per-button bookkeeping so async timers from a previous click never
  // stomp on a state a later click already moved on from
  const runId = new WeakMap();

  buttons.forEach((btn) => {
    runId.set(btn, 0);
    btn.addEventListener("click", () => handleClick(btn));
  });

  function handleClick(btn) {
    const state = btn.dataset.state;
    // interruptible, not breakable: a click while a request is in flight
    // is simply ignored rather than allowed to stack a second request
    if (state === "loading" || btn.disabled) return;

    const myRun = (runId.get(btn) || 0) + 1;
    runId.set(btn, myRun);

    setButtonState(btn, "loading");

    const delay = LOADING_MIN_MS + Math.random() * (LOADING_MAX_MS - LOADING_MIN_MS);
    window.setTimeout(() => {
      if (runId.get(btn) !== myRun) return; // superseded, drop silently
      const outcome = resolveOutcome();
      if (outcome === "success") {
        setButtonState(btn, "success");
        window.setTimeout(() => {
          if (runId.get(btn) !== myRun) return;
          setButtonState(btn, "idle");
        }, SUCCESS_HOLD_MS);
      } else {
        setButtonState(btn, "error");
        triggerShake(btn);
        window.setTimeout(() => {
          if (runId.get(btn) !== myRun) return;
          setButtonState(btn, "idle");
        }, ERROR_HOLD_MS);
      }
    }, delay);
  }

  function resolveOutcome() {
    if (forceMode === "success") return "success";
    if (forceMode === "error") return "error";
    return Math.random() < 0.2 ? "error" : "success";
  }

  // ---- state + FLIP width transition -------------------------------

  function setButtonState(btn, next) {
    const faces = btn.querySelectorAll(".btn-face");
    const startWidth = btn.getBoundingClientRect().width;

    btn.style.width = startWidth + "px";
    btn.dataset.state = next;

    faces.forEach((face) => {
      const isTarget = face.dataset.face === next;
      face.classList.toggle("is-active", isTarget);
    });

    if (next === "success") replayDraw(btn);

    // Let the new face's natural size settle, then FLIP to it.
    requestAnimationFrame(() => {
      btn.style.width = "auto";
      const endWidth = btn.getBoundingClientRect().width;
      btn.style.width = startWidth + "px";
      // eslint-disable-next-line no-unused-expressions
      btn.offsetHeight; // force reflow so the browser registers the start value
      requestAnimationFrame(() => {
        btn.style.width = endWidth + "px";
      });
    });

    btn.setAttribute(
      "aria-label",
      next === "loading" ? "Working" : next === "success" ? "Done" : next === "error" ? "Failed, retry" : ""
    );
  }

  function replayDraw(btn) {
    const path = btn.querySelector('[data-face="success"] .check-path');
    if (!path) return;
    path.style.animation = "none";
    // eslint-disable-next-line no-unused-expressions
    path.getBoundingClientRect();
    path.style.animation = "";
  }

  function triggerShake(btn) {
    btn.classList.remove("shake");
    // eslint-disable-next-line no-unused-expressions
    btn.offsetWidth;
    btn.classList.add("shake");
    window.setTimeout(() => btn.classList.remove("shake"), SHAKE_MS + 20);
  }

  // ---- demo controls --------------------------------------------------

  const chips = Array.from(document.querySelectorAll(".chip[data-force]"));
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      forceMode = chip.dataset.force;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    });
  });

  const disableToggle = document.getElementById("disable-toggle");
  disableToggle.addEventListener("change", () => {
    buttons.forEach((btn) => {
      btn.disabled = disableToggle.checked;
      if (disableToggle.checked) setButtonState(btn, "idle");
    });
  });

  const motionToggle = document.getElementById("motion-toggle");
  motionToggle.addEventListener("change", () => {
    document.body.classList.toggle("force-reduced-motion", motionToggle.checked);
  });
})();
