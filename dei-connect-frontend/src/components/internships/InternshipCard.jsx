import { avatarFor } from "../../utils/constants";
import { getUserById } from "../../services/userDirectory";
import { getCurrentUserId } from "../../utils/currentUser";
import { useAuth } from "../../hooks/useAuth";
import { timeAgo } from "../../utils/helpers";

export default function InternshipCard({ internship, applied, onApply, onViewDetails, busy }) {
  const { user } = useAuth();
  const poster =
    internship.postedBy === getCurrentUserId()
      ? { name: user?.name || "You" }
      : getUserById(internship.postedBy) || { name: "DEI Member" };

  return (
    <div className="card-surface rounded-3xl p-lg hover:shadow-glass transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="flex items-start justify-between mb-md">
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${internship.remote ? "bg-secondary/10 text-secondary" : "bg-primary-container/10 text-primary-container"}`}>
          {internship.remote ? "Remote" : internship.location}
        </div>
        <span className="text-[10px] text-outline">{timeAgo(internship.postedAt)}</span>
      </div>

      <h3 className="font-heading text-title-lg text-primary mb-xs">{internship.title}</h3>
      <p className="text-xs font-semibold text-terracotta mb-sm">{internship.organization}</p>
      <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-md">{internship.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-md">
        {internship.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="px-2.5 py-0.5 bg-surface-container rounded-full text-[10px] font-semibold text-on-surface-variant border border-outline-variant/30">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-sm mb-md mt-auto pt-md border-t border-outline-variant/10">
        <img src={avatarFor(poster.name)} alt={poster.name} className="w-6 h-6 rounded-full object-cover" />
        <span className="text-xs text-outline">Posted by {poster.name}</span>
      </div>

      <div className="flex gap-sm">
        <button
          onClick={() => onViewDetails(internship)}
          className="flex-1 py-2 rounded-lg text-label-sm font-semibold border border-primary/20 text-primary hover:bg-primary/5 transition-all"
        >
          View Details
        </button>
        <button
          onClick={() => onApply(internship.id)}
          disabled={applied || busy}
          className="flex-1 py-2 rounded-lg text-label-sm font-semibold bg-primary-container text-white hover:bg-primary transition-all disabled:opacity-60"
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}
