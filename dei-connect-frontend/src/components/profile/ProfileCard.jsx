// Small side-panel card used on the Profile page (About / Education / Skills).
export default function ProfileCard({ title, icon, children, onEdit }) {
  return (
    <div className="card-surface rounded-3xl p-lg">
      <div className="flex items-center justify-between mb-md">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">{icon}</span>
          <h2 className="font-heading text-title-lg text-primary">{title}</h2>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1.5 rounded-full text-outline hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label={`Edit ${title}`}
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
