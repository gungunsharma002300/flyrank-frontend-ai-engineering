import { useEffect, useState } from "react";
import SettingsForm from "./components/SettingsForm.jsx";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="bg-mesh min-h-screen w-full bg-slate-50 px-4 py-10 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-16">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="text-center sm:text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
            Account
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Manage your profile details and how the app looks for you.
          </p>
        </header>

        <SettingsForm isDarkMode={isDarkMode} onDarkModeChange={setIsDarkMode} />
      </main>
    </div>
  );
}

export default App;
