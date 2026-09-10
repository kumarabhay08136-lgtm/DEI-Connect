import { useState } from "react";
import { avatarFor } from "../../utils/constants";
import { getCurrentUserId } from "../../utils/currentUser";

export default function CommunityCard({ community, onToggleJoin }) {
  const [busy, setBusy] = useState(false);
  const joined = community.members?.includes(getCurrentUserId());

  const handleClick = async () => {
    if (!onToggleJoin) return;
    setBusy(true);
    await onToggleJoin(community);
    setBusy(false);
  };

  return (
    <div className="card-surface rounded-3xl overflow-hidden hover:shadow-glass transition-all duration-300 hover:-translate-y-1">
      <div
        className="h-24 w-full bg-cover bg-center bg-surface-container"
        style={community.banner ? { backgroundImage: `url(${community.banner})` } : undefined}
      />
      <div className="p-lg -mt-8 relative">
        <div className="w-16 h-16 rounded-2xl border-4 border-white overflow-hidden bg-surface-container mb-md shadow-soft">
          <img src={community.icon || community.banner || avatarFor(community.name)} alt={community.name} className="w-full h-full object-cover" />
        </div>
        <h3 className="font-heading text-title-lg text-primary mb-xs">{community.name}</h3>
        <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-md">{community.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            {(community.members || []).slice(0, 3).map((m) => (
              <img key={m} src={avatarFor(m)} alt={m} className="w-7 h-7 rounded-full border-2 border-white object-cover" />
            ))}
            <span className="text-xs text-outline pl-3">{(community.members || []).length} members</span>
          </div>
          <button
            onClick={handleClick}
            disabled={busy}
            className={`px-md py-1.5 rounded-lg text-label-sm font-semibold transition-all disabled:opacity-60 ${
              joined
                ? "bg-surface-container text-on-surface-variant"
                : "bg-primary-container text-white hover:bg-primary"
            }`}
          >
            {joined ? "Joined" : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
}
