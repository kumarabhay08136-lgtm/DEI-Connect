import { Link } from "react-router-dom";
import { PLACEHOLDER_IMAGES } from "../../utils/constants";

// Shared split-screen shell for Login / Register / Forgot Password,
// matching the "campus branding left, form right" reference design.
export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-background flex items-stretch">
      {/* Left: Branding & value proposition */}
      <section className="hidden lg:flex lg:w-1/2 flex-col justify-between p-2xl relative overflow-hidden text-white bg-primary">
        <div className="absolute inset-0 z-0">
          <img
            alt="DEI Campus"
            className="w-full h-full object-cover"
            src={PLACEHOLDER_IMAGES.campusHero}
          />
          <div className="absolute inset-0 campus-overlay" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-sm mb-lg">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
              <CrestIcon className="w-full h-full text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">DEI Connect</h1>
          </div>
          <div className="max-w-md">
            <h2 className="text-4xl xl:text-5xl font-bold mb-md leading-[1.1] font-heading">
              One Campus • One Community • One Platform
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Elevating the educational experience by bridging the gap between
              students, faculty, and alumni in a unified digital ecosystem.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center py-2xl h-full">
          <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden border border-white/20 shadow-2xl">
            <img
              alt="Campus"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              src={PLACEHOLDER_IMAGES.campusSecondary}
            />
            <div
              className="absolute top-6 right-6 glass-panel !bg-white/10 !shadow-none p-md rounded-xl border border-white/20 floating-element backdrop-blur-md"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-sm text-white">
                <span className="material-symbols-outlined text-secondary-container icon-fill">
                  stars
                </span>
                <span className="text-sm font-semibold">15k+ Students</span>
              </div>
            </div>
            <div
              className="absolute bottom-6 left-6 glass-panel !bg-white/10 !shadow-none p-md rounded-xl border border-white/20 floating-element backdrop-blur-md"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="flex items-center gap-sm text-white">
                <span className="material-symbols-outlined text-secondary-container icon-fill">
                  groups
                </span>
                <span className="text-sm font-semibold">Global Alumni Network</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-xl border-t border-white/10 pt-lg">
          <p className="text-sm text-white/70">Join thousands of members already connected.</p>
        </div>
      </section>

      {/* Right: form */}
      <main className="w-full lg:w-1/2 flex flex-col justify-center items-center p-gutter lg:p-3xl relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <CrestIcon className="w-[600px] h-[600px] text-primary opacity-5" />
        </div>

        <div className="w-full max-w-[480px] z-10">
          <Link to="/" className="flex items-center gap-sm mb-2xl lg:hidden">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center p-1.5">
              <CrestIcon className="w-full h-full text-white" />
            </div>
            <span className="text-2xl font-bold text-primary font-heading">DEI Connect</span>
          </Link>

          <div className="card-surface p-xl lg:p-2xl rounded-3xl relative bg-white">
            <div className="mb-xl text-center lg:text-left">
              {eyebrow && (
                <span className="text-label-sm uppercase tracking-widest text-secondary font-semibold">
                  {eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-bold text-primary mb-xs font-heading mt-xs">
                {title}
              </h2>
              <p className="text-on-surface-variant">{subtitle}</p>
            </div>
            {children}
          </div>

          <footer className="mt-2xl flex flex-col items-center gap-sm text-on-surface-variant/60 relative z-10">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm text-terracotta icon-fill">
                verified
              </span>
              <span className="text-xs font-semibold">Secured and Verified Educational Portal</span>
            </div>
            <div className="text-sm">© {new Date().getFullYear()} Dayalbagh Educational Institute</div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function CrestIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" opacity="0.2" />
      <path
        d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12.99H5V8.53l7-3.89v8.35z"
        fill="currentColor"
      />
    </svg>
  );
}
