function Toggle({ id, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <span id={`${id}-label`} className="field-label mb-0.5">
          {label}
        </span>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full
          transition-colors duration-200 ease-in-out
          ${checked ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-700"}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md
            transition-transform duration-200 ease-in-out
            ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

export default Toggle;
