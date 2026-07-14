const VARIANT_STYLES = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 disabled:bg-slate-300 dark:disabled:bg-slate-700",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  onClick,
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5
        text-sm font-semibold shadow-sm transition-all duration-150 ease-in-out
        disabled:cursor-not-allowed disabled:opacity-70
        hover:-translate-y-0.5 hover:shadow-md active:translate-y-0
        ${VARIANT_STYLES[variant]}`}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin text-current"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
