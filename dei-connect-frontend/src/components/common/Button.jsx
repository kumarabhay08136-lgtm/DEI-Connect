import { classNames } from "../../utils/helpers";
import Loader from "./Loader";

const VARIANTS = {
  primary:
    "bg-primary-container text-on-primary hover:bg-primary shadow-soft",
  secondary:
    "bg-primary/10 text-primary hover:bg-primary/20",
  outline:
    "bg-white text-primary border border-primary/20 hover:bg-primary/5",
  ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container",
  danger: "bg-error text-on-error hover:bg-error/90",
};

const SIZES = {
  sm: "px-md py-xs text-label-sm",
  md: "px-lg py-sm text-label-md",
  lg: "px-xl py-md text-label-md",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={loading || rest.disabled}
      className={classNames(
        "inline-flex items-center justify-center gap-sm rounded-lg font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader size="sm" inline />
      ) : (
        icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
      {children}
    </button>
  );
}
