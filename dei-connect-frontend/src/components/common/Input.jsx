import { useState } from "react";
import { classNames } from "../../utils/helpers";

// Shared text input styled to match the auth screens' icon-prefixed fields.
export default function Input({
  label,
  icon,
  type = "text",
  error,
  className = "",
  rightElement,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-sm">
      {label && (
        <label
          htmlFor={rest.id}
          className="text-sm font-semibold text-on-surface-variant block"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">
            {icon}
          </span>
        )}
        <input
          type={resolvedType}
          className={classNames(
            "w-full py-md bg-white border rounded-lg focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none",
            icon ? "pl-[48px]" : "pl-md",
            isPassword || rightElement ? "pr-[48px]" : "pr-md",
            error ? "border-error" : "border-outline-variant/30",
            className
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-md top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface-variant"
            tabIndex={-1}
          >
            <span className="material-symbols-outlined">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        )}
        {!isPassword && rightElement && (
          <div className="absolute right-md top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
