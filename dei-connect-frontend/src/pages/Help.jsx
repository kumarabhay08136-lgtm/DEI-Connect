import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import HelpChat from "../components/help/HelpChat";
import Loader from "../components/common/Loader";
import { getHelpMessages, sendHelpMessage } from "../services/helpService";

export default function Help() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getHelpMessages();
      setMessages(data);
      setLoading(false);
    })();
  }, []);

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { id: `local-${Date.now()}`, sender: "user", text }]);
    setSending(true);
    const next = await sendHelpMessage(text);
    setMessages(next);
    setSending(false);
  };

  return (
    <PageLayout>
      <div className="mb-lg">
        <h1 className="font-heading text-headline-md text-primary">Help & Support</h1>
        <p className="text-body-sm text-on-surface-variant">
          We're here to help with anything related to using DEI Connect.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="card-surface rounded-3xl p-lg h-fit space-y-lg">
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-2xl">call</span>
            </div>
            <h2 className="font-heading text-title-lg text-primary mb-xs">Call Support</h2>
            <p className="text-body-sm text-on-surface-variant mb-sm">
              Available Monday – Saturday, 9 AM – 6 PM.
            </p>
            <a href="tel:+911814567890" className="text-primary font-semibold hover:underline">
              +91 181 456 7890
            </a>
          </div>
          <div className="pt-lg border-t border-outline-variant/20">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <h2 className="font-heading text-title-lg text-primary mb-xs">Email Us</h2>
            <a href="mailto:support@deiconnect.edu" className="text-primary font-semibold hover:underline">
              support@deiconnect.edu
            </a>
          </div>
        </div>

        <div className="lg:col-span-2 card-surface rounded-3xl overflow-hidden h-[500px] flex flex-col">
          {loading ? <Loader label="Loading support chat..." /> : <HelpChat messages={messages} onSend={handleSend} sending={sending} />}
        </div>
      </div>
    </PageLayout>
  );
}
