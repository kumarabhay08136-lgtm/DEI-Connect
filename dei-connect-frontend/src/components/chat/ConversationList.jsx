import { useState } from "react";
import { avatarFor } from "../../utils/constants";
import { classNames, timeAgo } from "../../utils/helpers";

export default function ConversationList({ conversations, activeId, onSelect }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? conversations.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
    : conversations;

  return (
    <div className="flex flex-col h-full">
      <div className="p-lg border-b border-outline-variant/20">
        <h2 className="font-heading text-headline-md text-primary mb-md">Messages</h2>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-9 py-2 bg-surface-container-low border-none rounded-full w-full focus:ring-2 focus:ring-primary text-body-sm outline-none"
            placeholder="Search conversations..."
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-lg text-center text-on-surface-variant text-sm">
            No conversations match "{query}".
          </div>
        ) : (
          filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={classNames(
              "w-full flex items-center gap-md p-md border-b border-outline-variant/10 text-left transition-colors",
              activeId === c.id ? "bg-primary/5" : "hover:bg-surface-container-low"
            )}
          >
            <div className="relative shrink-0">
              <img src={avatarFor(c.name)} alt={c.name} className="w-12 h-12 rounded-full object-cover" />
              {c.isGroup ? (
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-secondary text-white border-2 border-white rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[11px]">groups</span>
                </span>
              ) : (
                c.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary-container border-2 border-white rounded-full" />
                )
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-label-md text-on-surface truncate">{c.name}</p>
                <span className="text-[10px] text-outline shrink-0">
                  {typeof c.time === "number" ? timeAgo(c.time) : c.time}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant truncate">{c.lastMessage}</p>
            </div>
            {c.unread > 0 && (
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold shrink-0">
                {c.unread}
              </span>
            )}
          </button>
          ))
        )}
      </div>
    </div>
  );
}
