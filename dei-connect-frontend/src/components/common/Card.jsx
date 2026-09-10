import { classNames } from "../../utils/helpers";

// Base "glass panel" surface reused across the whole app for consistency.
export default function Card({
  children,
  className = "",
  hoverLift = false,
  padding = "p-lg",
  as: Component = "div",
  ...rest
}) {
  return (
    <Component
      className={classNames(
        "card-surface rounded-3xl",
        padding,
        hoverLift &&
          "transition-all duration-300 hover:shadow-glass hover:-translate-y-1",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
