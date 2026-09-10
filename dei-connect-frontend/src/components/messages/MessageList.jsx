import { avatarFor } from "../../utils/constants";
import { getUserById } from "../../services/userDirectory";
import { getCurrentUserId } from "../../utils/currentUser";
import { useAuth } from "../../hooks/useAuth";
import { timeAgo, classNames, truncate } from "../../utils/helpers";

export default function MessageList({ messages, activeId, onSelect, folder }) {
  const { user } = useAuth();

  if (!messages.length) {
    return (
      <div className="p-xl text-center text-on-surface-variant text-sm">
        No messages in {folder}.
      </div>
    );
  }

  return (
    <div>
      {messages.map((m) => {
        const otherId = folder === "sent" ? m.toId : m.fromId;
        const other =
          otherId === getCurrentUserId()
            ? { name: user?.name || "You" }
            : getUserById(otherId) || { name: "DEI Member" };
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m)}
            className={classNames(
              "w-full flex items-start gap-md p-md border-b border-outline-variant/10 text-left transition-colors",
              activeId === m.id ? "bg-primary/5" : "hover:bg-surface-container-low",
              !m.read && folder === "inbox" && "bg-primary/5"
            )}
          >
            <img src={avatarFor(other.name)} alt={other.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-sm">
                <p className={classNames("text-sm truncate", !m.read && folder === "inbox" ? "font-bold text-on-surface" : "font-label-md text-on-surface")}>
                  {folder === "sent" ? `To: ${other.name}` : other.name}
                </p>
                <span className="text-[10px] text-outline shrink-0">{timeAgo(m.time)}</span>
              </div>
              <p className="text-xs text-on-surface font-medium truncate">{m.subject}</p>
              <p className="text-xs text-on-surface-variant truncate">{truncate(m.body, 60)}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
