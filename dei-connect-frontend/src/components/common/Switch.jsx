import { classNames } from "../../utils/helpers";

// Accessible, design-system-matched toggle switch used throughout Settings.
export default function Switch({ checked, onChange, label, description }) {
  return (
    <label className="flex items-center justify-between gap-lg py-sm cursor-pointer select-none">
      <div className="min-w-0">
        <p className="text-body-sm font-semibold text-on-surface">{label}</p>
        {description && <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={classNames(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200",
          checked ? "bg-primary" : "bg-outline-variant/50"
        )}
      >
        <span
          className={classNames(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}
