import { useState, useRef, useEffect } from "react";
import { avatarFor } from "../../utils/constants";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ conversation, messages, onSend, onViewMembers, onBack }) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft("");
  };

  if (!conversation) {
    return (
      <div className="flex-1 hidden sm:flex flex-col items-center justify-center text-on-surface-variant gap-sm">
        <span className="material-symbols-outlined text-5xl text-outline-variant">forum</span>
        <p>Select a conversation to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      <div className="flex items-center gap-md p-md border-b border-outline-variant/20">
        <button
          type="button"
          onClick={onBack}
          className="sm:hidden -ml-1 p-2 rounded-full hover:bg-surface-container text-on-surface-variant shrink-0"
          aria-label="Back to conversations"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <img src={avatarFor(conversation.name)} alt={conversation.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className="font-label-md text-on-surface flex items-center gap-xs truncate">
            {conversation.name}
            {conversation.isGroup && (
              <span className="material-symbols-outlined text-sm text-secondary shrink-0">groups</span>
            )}
          </p>
          {conversation.isGroup ? (
            <button
              onClick={() => onViewMembers?.()}
              className="text-xs text-secondary hover:underline"
            >
              {conversation.memberCount} members
            </button>
          ) : (
            <p className="text-xs text-secondary">{conversation.online ? "Online" : "Offline"}</p>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-lg bg-surface-container-low/40">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} isOwn={m.isOwn} />
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-md border-t border-outline-variant/20 flex items-center gap-sm">
        <button type="button" className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant">
          <span className="material-symbols-outlined">attach_file</span>
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-surface-container-low rounded-full px-md py-sm outline-none focus:ring-2 focus:ring-primary text-body-sm"
        />
        <button type="submit" className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
}
