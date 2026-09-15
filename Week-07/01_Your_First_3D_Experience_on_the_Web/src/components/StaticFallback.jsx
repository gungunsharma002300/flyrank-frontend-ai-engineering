export default function StaticFallback({ onEnable }) {
  return (
    <div className="static-fallback">
      <div className="static-fallback__art" aria-hidden="true">
        <div className="static-fallback__shape static-fallback__shape--core" />
        <div className="static-fallback__shape static-fallback__shape--ring" />
      </div>
      <p className="static-fallback__title">3D scene paused</p>
      <p className="static-fallback__body">
        Your system has "reduce motion" on, or this device may not have the headroom for a
        smooth animated scene, so we're keeping this static by default.
      </p>
      <button type="button" className="btn btn--primary" onClick={onEnable}>
        Enable the animated scene
      </button>
    </div>
  );
}
