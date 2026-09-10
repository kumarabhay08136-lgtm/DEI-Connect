import { Link, useNavigate } from "react-router-dom";
import { avatarForUser } from "../../utils/constants";
import { classNames } from "../../utils/helpers";

export default function UserCard({ user, isFollowing, onToggleFollow, busy }) {
  const navigate = useNavigate();

  const handleMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/chat?user=${user.id}`);
  };

  return (
    <Link
      to={`/profile/${user.id}`}
      className="card-surface rounded-3xl p-lg flex flex-col items-center text-center hover:shadow-glass transition-all duration-300 hover:-translate-y-1"
    >
      <img
        src={avatarForUser(user)}
        alt={user.name}
        className="w-20 h-20 rounded-full object-cover mb-md border-2 border-outline-variant/20"
      />
      <h3 className="font-heading text-title-lg text-primary">{user.name}</h3>
      <span className="text-[10px] uppercase tracking-widest font-bold text-secondary mb-sm">
        {user.role} • {user.department}
      </span>
      <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-lg min-h-[40px]">{user.bio}</p>
      <div className="w-full flex gap-sm">
        <button
          onClick={handleMessage}
          className="flex-1 py-2 rounded-lg text-label-sm font-semibold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          Message
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFollow(user.id);
          }}
          disabled={busy}
          className={classNames(
            "flex-1 py-2 rounded-lg text-label-sm font-semibold transition-all disabled:opacity-60",
            isFollowing
              ? "bg-surface-container text-on-surface-variant hover:bg-error-container/50 hover:text-on-error-container"
              : "bg-primary-container text-white hover:bg-primary"
          )}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    </Link>
  );
}
