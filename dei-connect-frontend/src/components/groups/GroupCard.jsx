import { useNavigate } from "react-router-dom";
import { avatarFor } from "../../utils/constants";
import { getCurrentUserId } from "../../utils/currentUser";

export default function GroupCard({ group, onJoin, onLeave, onViewMembers, busy }) {
  const navigate = useNavigate();
  const isMember = group.members.includes(getCurrentUserId());

  return (
    <div className="card-surface rounded-3xl overflow-hidden hover:shadow-glass transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="p-lg flex-1">
        <div className="flex items-start gap-md mb-md">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-container shrink-0">
            <img
              src={group.image || avatarFor(group.name)}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-title-lg text-primary truncate">{group.name}</h3>
            <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">
              {group.category}
            </span>
          </div>
        </div>
        <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-md">{group.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-md">
          {(group.tags || []).map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 bg-surface-container rounded-full text-[10px] font-semibold text-on-surface-variant border border-outline-variant/30">
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => onViewMembers(group)}
          className="flex items-center gap-xs text-xs text-outline hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-base">group</span>
          {group.members.length} members
        </button>
      </div>
      <div className="px-lg py-md border-t border-outline-variant/10 flex gap-sm">
        {isMember ? (
          <>
            <button
              onClick={() => navigate(`/chat?group=${group.id}`)}
              className="flex-1 py-2 rounded-lg text-label-sm font-semibold bg-primary-container text-white hover:bg-primary transition-all flex items-center justify-center gap-xs"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              Open Chat
            </button>
            <button
              onClick={() => onLeave(group.id)}
              disabled={busy}
              className="px-md py-2 rounded-lg text-label-sm font-semibold bg-surface-container text-on-surface-variant hover:bg-error-container/50 hover:text-on-error-container transition-all disabled:opacity-60"
            >
              Leave
            </button>
          </>
        ) : (
          <button
            onClick={() => onJoin(group.id)}
            disabled={busy}
            className="flex-1 py-2 rounded-lg text-label-sm font-semibold bg-primary-container text-white hover:bg-primary transition-all disabled:opacity-60"
          >
            Join Group
          </button>
        )}
      </div>
    </div>
  );
}
