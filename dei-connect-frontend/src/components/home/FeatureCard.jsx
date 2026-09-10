const ACCENT_MAP = {
  primary: "bg-primary-container/10 text-primary-container group-hover:bg-primary-container/20",
  terracotta: "bg-terracotta/10 text-terracotta group-hover:bg-terracotta/20",
  secondary: "bg-secondary/10 text-secondary group-hover:bg-secondary/20",
};

// Used on the Landing page "About DEI Connect" section.
export default function FeatureCard({ icon, title, description, accent = "primary", lift = false }) {
  return (
    <div
      className={`bg-surface-container-lowest p-2xl rounded-3xl shadow-soft border border-outline-variant/20 hover:shadow-glass transition-all duration-300 transform hover:-translate-y-1 group ${
        lift ? "md:-mt-8" : ""
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-lg transition-colors ${ACCENT_MAP[accent]}`}>
        <span className="material-symbols-outlined text-2xl icon-fill">{icon}</span>
      </div>
      <h3 className="font-heading text-headline-md text-primary mb-sm">{title}</h3>
      <p className="text-body-md text-on-surface-variant">{description}</p>
    </div>
  );
}
