import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero";
import FeatureCard from "../components/home/FeatureCard";
import Footer from "../components/layout/Footer";
import { INSTITUTE_NAME, INSTITUTE_SUBTITLE } from "../utils/constants";

export default function Landing() {
  // Header starts transparent so it blends into the hero photo, then
  // switches to the solid glass style once the user scrolls past the
  // hero (where the background turns light and needs dark text again).
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <header
        className={`sticky md:fixed top-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-outline-variant/30 ${
          !scrolled
            ? "md:bg-gradient-to-b md:from-black/55 md:via-black/20 md:to-transparent md:border-transparent md:backdrop-blur-none"
            : ""
        }`}
      >
        <div className="max-w-container-max mx-auto px-gutter py-md flex items-center justify-between">
          <div className="flex flex-col leading-tight">
            <span
              className={`font-heading text-label-md tracking-wide uppercase transition-colors duration-300 text-primary ${
                !scrolled ? "md:text-white" : ""
              }`}
            >
              {INSTITUTE_NAME}
            </span>
            <span
              className={`font-heading text-label-sm opacity-80 transition-colors duration-300 text-primary ${
                !scrolled ? "md:text-white" : ""
              }`}
            >
              {INSTITUTE_SUBTITLE}
            </span>
          </div>
          <div className="flex items-center gap-md">
            <Link
              to="/login"
              className={`font-label-md px-lg py-sm rounded-lg transition-colors backdrop-blur-md text-primary bg-primary/10 hover:bg-primary/20 ${
                !scrolled ? "md:text-white md:bg-white/10 md:hover:bg-white/20 md:border md:border-white/20" : ""
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="font-label-md bg-primary-container text-on-primary hover:bg-primary transition-colors px-lg py-sm rounded-lg shadow-soft"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Hero />

        <section className="py-3xl bg-background relative z-20 -mt-10 rounded-t-[3rem] px-gutter">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-2xl">
              <h2 className="font-heading text-headline-lg text-primary mb-sm">About DEI Connect</h2>
              <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
                An exclusive social networking and collaboration hub designed
                specifically for the Dayalbagh Educational Institute community,
                built on a foundation of trust, heritage, and academic excellence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              <FeatureCard
                icon="inventory_2"
                title="Knowledge Sharing"
                description="Access a vast repository of academic resources, lecture notes, and research papers curated by faculty and top-performing students."
                accent="primary"
              />
              <FeatureCard
                icon="group"
                title="Project Collaboration"
                description="Form interdisciplinary teams, manage workflows, and collaborate seamlessly on innovative projects across departments."
                accent="terracotta"
                lift
              />
              <FeatureCard
                icon="hub"
                title="Alumni Networking"
                description="Connect with successful graduates, find mentorship opportunities, and explore career pathways within our extensive global network."
                accent="secondary"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
