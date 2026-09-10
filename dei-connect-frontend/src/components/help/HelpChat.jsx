import { useState, useRef, useEffect } from "react";
import { classNames } from "../../utils/helpers";

export default function HelpChat({ messages, onSend, sending }) {
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-lg bg-surface-container-low/40 space-y-md">
        {messages.map((m) => (
          <div key={m.id} className={classNames("flex", m.sender === "user" ? "justify-end" : "justify-start")}>
            <div
              className={classNames(
                "max-w-[75%] px-md py-sm rounded-2xl text-body-sm",
                m.sender === "user"
                  ? "bg-primary text-white rounded-br-sm"
                  : "bg-white border border-outline-variant/20 text-on-surface rounded-bl-sm"
              )}
            >
              <p className="whitespace-pre-line">{m.text}</p>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-white border border-outline-variant/20 px-md py-sm rounded-2xl rounded-bl-sm">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-md border-t border-outline-variant/20 flex items-center gap-sm">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Describe your issue or question..."
          className="flex-1 bg-surface-container-low rounded-full px-md py-sm outline-none focus:ring-2 focus:ring-primary text-body-sm"
        />
        <button type="submit" className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
}
