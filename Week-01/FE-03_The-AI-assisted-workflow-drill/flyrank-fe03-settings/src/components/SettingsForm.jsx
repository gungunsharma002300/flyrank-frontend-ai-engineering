import { useState } from "react";
import InputField from "./InputField.jsx";
import Toggle from "./Toggle.jsx";
import Button from "./Button.jsx";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ja", label: "日本語" },
  { value: "hi", label: "हिन्दी" },
  { value: "pt", label: "Português" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_VALUES = {
  fullName: "",
  email: "",
  language: "en",
};

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

function SettingsForm({ isDarkMode, onDarkModeChange }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  function handleChange(field) {
    return (event) => {
      const nextValues = { ...values, [field]: event.target.value };
      setValues(nextValues);
      setSaveStatus(null);

      if (touched[field]) {
        setErrors(validate(nextValues));
      }
    };
  }

  function handleBlur(field) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors(validate(values));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ fullName: true, email: true });

    if (Object.keys(validationErrors).length > 0) {
      setSaveStatus(null);
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsSaving(false);
    setSaveStatus("success");
  }

  const isFormValid = Object.keys(validate(values)).length === 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="glass-card flex flex-col gap-6 p-6 sm:p-8">
      <fieldset className="flex flex-col gap-5">
        <legend className="sr-only">Profile information</legend>

        <InputField
          id="fullName"
          label="Full Name"
          value={values.fullName}
          onChange={handleChange("fullName")}
          onBlur={handleBlur("fullName")}
          error={touched.fullName ? errors.fullName : undefined}
          required
          placeholder="Jane Cooper"
          autoComplete="name"
        />

        <InputField
          id="email"
          label="Email Address"
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
          error={touched.email ? errors.email : undefined}
          required
          placeholder="jane@company.com"
          autoComplete="email"
        />

        <div>
          <label htmlFor="language" className="field-label">
            Preferred Language
          </label>
          <select
            id="language"
            name="language"
            value={values.language}
            onChange={handleChange("language")}
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm
              text-slate-900 transition-colors duration-150 focus-visible:border-brand-500
              dark:border-slate-700 dark:bg-slate-800/70 dark:text-white"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <hr className="border-slate-200/70 dark:border-slate-700/70" />

      <Toggle
        id="darkMode"
        label="Dark Mode"
        description="Switch the interface to a darker color scheme."
        checked={isDarkMode}
        onChange={onDarkModeChange}
      />

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="min-h-[1.5rem] text-sm">
          {saveStatus === "success" && (
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Settings saved successfully.
            </span>
          )}
        </div>

        <Button type="submit" isLoading={isSaving} disabled={!isFormValid && Object.keys(touched).length > 0}>
          {isSaving ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}

export default SettingsForm;
