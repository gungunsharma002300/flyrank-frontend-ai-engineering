function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  autoComplete,
}) {
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span className="ml-0.5 text-rose-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={`w-full rounded-xl border bg-white/80 px-4 py-2.5 text-sm text-slate-900
          placeholder:text-slate-400 transition-colors duration-150
          focus-visible:border-brand-500 dark:bg-slate-800/70 dark:text-white dark:placeholder:text-slate-500
          ${hasError
            ? "border-rose-400 focus-visible:ring-rose-300 dark:border-rose-500"
            : "border-slate-200 dark:border-slate-700"
          }`}
      />

      {hasError && (
        <p id={errorId} role="alert" className="field-error">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l6.28 11.183c.75 1.334-.213 2.985-1.742 2.985H3.72c-1.53 0-2.492-1.651-1.743-2.985L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-.25-5.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default InputField;
