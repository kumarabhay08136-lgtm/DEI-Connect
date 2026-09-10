import { useState } from "react";
import { avatarFor } from "../../utils/constants";
import { getUserById } from "../../services/userDirectory";
import { getCurrentUserId } from "../../utils/currentUser";
import { useAuth } from "../../hooks/useAuth";
import { timeAgo } from "../../utils/helpers";
import Button from "../common/Button";

export default function MessageThread({ message, onReply, onBack }) {
  const { user } = useAuth();
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  if (!message) {
    return (
      <div className="flex-1 hidden sm:flex flex-col items-center justify-center text-on-surface-variant gap-sm">
        <span className="material-symbols-outlined text-5xl text-outline-variant">mail</span>
        <p>Select a message to read.</p>
      </div>
    );
  }

  const otherId = message.fromId === getCurrentUserId() ? message.toId : message.fromId;
  const other =
    otherId === getCurrentUserId()
      ? { name: user?.name || "You" }
      : getUserById(otherId) || { name: "DEI Member" };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    await onReply(other.id || otherId, replyText.trim(), message.subject);
    setReplyText("");
    setSending(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="p-lg border-b border-outline-variant/20">
        <button
          type="button"
          onClick={onBack}
          className="sm:hidden -ml-1 mb-sm p-2 rounded-full hover:bg-surface-container text-on-surface-variant"
          aria-label="Back to messages"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="font-heading text-title-lg text-primary mb-sm">{message.subject}</h2>
        <div className="flex items-center gap-sm">
          <img src={avatarFor(other.name)} alt={other.name} className="w-9 h-9 rounded-full object-cover" />
          <div>
            <p className="text-sm font-semibold text-on-surface">{other.name}</p>
            <p className="text-xs text-outline">{timeAgo(message.time)}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-lg">
        <p className="text-body-md text-on-surface whitespace-pre-line leading-relaxed">{message.body}</p>
      </div>
      <div className="p-md border-t border-outline-variant/20 flex items-end gap-sm">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={`Reply to ${other.name}...`}
          rows={2}
          className="flex-1 bg-surface-container-low rounded-xl px-md py-sm outline-none focus:ring-2 focus:ring-primary text-body-sm resize-none"
        />
        <Button onClick={handleReply} loading={sending} icon="send">
          Reply
        </Button>
      </div>
    </div>
  );
}
