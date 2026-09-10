import { INSTITUTE_NAME } from "../../utils/constants";

// Public footer used on the Landing page (and can be reused on legal pages).
export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 py-xl mt-auto">
      <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-md">
        <p className="text-body-sm text-on-surface-variant text-center md:text-left">
          © {new Date().getFullYear()} {INSTITUTE_NAME}. All rights reserved.
        </p>
        <div className="flex gap-lg">
          <a
            className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
