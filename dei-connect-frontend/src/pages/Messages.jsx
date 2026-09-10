import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import MessageList from "../components/messages/MessageList";
import MessageThread from "../components/messages/MessageThread";
import ComposeModal from "../components/messages/ComposeModal";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { getInbox, getSent, sendMessage, markMessageRead } from "../services/messageService";

const TABS = [
  { id: "inbox", label: "Inbox", icon: "inbox" },
  { id: "sent", label: "Sent", icon: "send" },
];

export default function Messages() {
  const [tab, setTab] = useState("inbox");
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [inboxData, sentData] = await Promise.all([getInbox(), getSent()]);
    setInbox(inboxData);
    setSent(sentData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Live update polling for incoming messages
    const interval = setInterval(() => {
      Promise.all([getInbox(), getSent()]).then(([inboxData, sentData]) => {
        setInbox(inboxData);
        setSent(sentData);
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentList = tab === "inbox" ? inbox : sent;

  const handleSelect = async (message) => {
    setActive(message);
    if (tab === "inbox" && !message.read) {
      await markMessageRead(message.id);
      setInbox((prev) => prev.map((m) => (m.id === message.id ? { ...m, read: true } : m)));
    }
  };

  const handleBack = () => {
    setActive(null);
  };

  const handleSend = async ({ toId, subject, body }) => {
    await sendMessage({ toId, subject, body });
    await loadData();
  };

  const handleReply = async (toId, body, originalSubject) => {
    const subject = originalSubject.startsWith("Re:") ? originalSubject : `Re: ${originalSubject}`;
    await sendMessage({ toId, subject, body });
    await loadData();
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-heading text-headline-md text-primary">Messages</h1>
          <p className="text-body-sm text-on-surface-variant">Send and receive messages with any DEI member.</p>
        </div>
        <Button icon="edit" onClick={() => setComposeOpen(true)}>
          Compose
        </Button>
      </div>

      <div className="card-surface rounded-3xl overflow-hidden flex h-[calc(100vh-180px)] min-h-[500px]">
        {loading ? (
          <Loader label="Loading messages..." />
        ) : (
          <>
            <div
              className={`w-full sm:w-80 border-r border-outline-variant/20 shrink-0 flex-col ${
                active ? "hidden sm:flex" : "flex"
              }`}
            >
              <div className="flex border-b border-outline-variant/20">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTab(t.id);
                      setActive(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-xs py-md text-label-sm font-semibold transition-colors ${
                      tab === t.id ? "text-primary border-b-2 border-primary" : "text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto">
                <MessageList messages={currentList} activeId={active?.id} onSelect={handleSelect} folder={tab} />
              </div>
            </div>
            <div className={`flex-1 min-w-0 ${active ? "flex" : "hidden sm:flex"}`}>
              <MessageThread message={active} onReply={handleReply} onBack={handleBack} />
            </div>
          </>
        )}
      </div>

      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} onSend={handleSend} />
    </PageLayout>
  );
}
