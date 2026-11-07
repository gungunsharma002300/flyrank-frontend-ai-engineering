"use client";

import { useEffect, useState } from "react";
import { isStorageAvailable } from "../lib/storage";

export default function StorageWarning() {
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    setAvailable(isStorageAvailable());
  }, []);

  if (available) return null;

  return (
    <div
      role="alert"
      className="bg-danger/10 text-danger text-sm text-center px-4 py-2 border-b border-danger/20"
    >
      ⚠️ Local storage isn't available in this browser (common in private/incognito mode). Your
      data won't be saved after you close this tab.
    </div>
  );
}
