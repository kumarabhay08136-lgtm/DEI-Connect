import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-gutter text-center">
      <span className="material-symbols-outlined text-7xl text-primary-container mb-lg">travel_explore</span>
      <h1 className="font-heading text-6xl font-bold text-primary mb-sm">404</h1>
      <h2 className="font-heading text-headline-md text-primary mb-sm">Page Not Found</h2>
      <p className="text-body-md text-on-surface-variant max-w-md mb-xl">
        The page you're looking for doesn't exist or may have been moved.
        Let's get you back on campus.
      </p>
      <Link
        to="/"
        className="font-label-md bg-primary-container text-on-primary hover:bg-primary transition-colors px-xl py-md rounded-lg shadow-soft"
      >
        Back to Home
      </Link>
    </div>
  );
}
