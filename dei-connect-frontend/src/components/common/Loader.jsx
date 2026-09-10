import { classNames } from "../../utils/helpers";

const SIZE_MAP = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-12 h-12 border-4",
};

// Reusable spinner used for auth, dashboard, chat, resources, community loads.
export default function Loader({ size = "md", inline = false, label }) {
  const spinner = (
    <span
      className={classNames(
        "inline-block rounded-full border-primary-container/20 border-t-primary-container animate-spin-slow",
        SIZE_MAP[size]
      )}
      role="status"
      aria-label="Loading"
    />
  );

  if (inline) return spinner;

  return (
    <div className="flex flex-col items-center justify-center gap-sm py-2xl w-full">
      {spinner}
      {label && (
        <p className="text-body-sm text-on-surface-variant">{label}</p>
      )}
    </div>
  );
}
