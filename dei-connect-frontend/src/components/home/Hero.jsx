import { Link } from "react-router-dom";
import { PLACEHOLDER_IMAGES } from "../../utils/constants";

// Public landing-page hero section. The hero photo already has the DEI
// Connect logo, title, and tagline designed into it.
//
// The photo is a wide "poster" composition (roughly 1741x903). Cropping it
// to fill a viewport (the usual full-bleed hero technique) cuts the
// baked-in title text off the sides on anything narrower than the photo's
// own ~1.93:1 ratio — which includes phones AND most tablets/laptops in
// portrait or squarer aspect ratios. So instead the container is locked to
// the photo's exact aspect ratio on every screen size: the image is never
// cropped, full stop. On md+ screens (where the resulting image is tall
// enough) the supporting copy overlays near its bottom; on small screens
// it sits below the image instead.
export default function Hero() {
  const cta = (
    <>
      <p
        className="text-body-lg text-surface-container-low mb-xl max-w-2xl mx-auto opacity-90"
        style={{ textShadow: "rgba(0,0,0,0.9) 0px 2px 8px" }}
      >
        Elevating the educational experience by bridging the gap between
        students, faculty, and alumni in a unified digital ecosystem.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-md">
        <Link
          to="/register"
          className="w-full sm:w-auto font-label-md bg-primary-container text-on-primary hover:bg-primary transition-colors px-xl py-md rounded-lg shadow-glass transform hover:-translate-y-1"
        >
          Register Now
        </Link>
        <Link
          to="/login"
          className="w-full sm:w-auto font-label-md bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors px-xl py-md rounded-lg backdrop-blur-md transform hover:-translate-y-1"
        >
          Login to Portal
        </Link>
      </div>
    </>
  );

  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Image block: always at the photo's own aspect ratio — never cropped. */}
      <div className="relative w-full aspect-[1741/903] md:flex md:flex-col md:justify-end">
        <img
          src={PLACEHOLDER_IMAGES.campusHero}
          alt="Dayalbagh Educational Institute campus — DEI Connect: One Campus, One Community, One Platform"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay hidden md:block" />

        {/* md+ : copy overlaid near the bottom of the photo */}
        <div className="relative z-10 max-w-4xl mx-auto px-gutter text-center text-white pb-3xl hidden md:block">
          {cta}
        </div>
      </div>

      {/* Small screens: copy sits below the (uncropped) image on a solid panel */}
      <div className="md:hidden px-gutter py-2xl text-center text-white">
        {cta}
      </div>
    </section>
  );
}
