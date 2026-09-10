import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { getAllUsers } from "../../services/socialService";
import { getCurrentUserId } from "../../utils/currentUser";

export default function ComposeModal({ open, onClose, onSend, defaultToId }) {
  const [users, setUsers] = useState([]);
  const [toId, setToId] = useState(defaultToId || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      getAllUsers().then((allUsers) => {
        const selectable = allUsers.filter((u) => u.id !== getCurrentUserId());
        setUsers(selectable);
        setToId(defaultToId || selectable[0]?.id || "");
      });
      setSubject("");
      setBody("");
      setError("");
    }
  }, [open, defaultToId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toId) {
      setError("Choose a recipient.");
      return;
    }
    if (!subject.trim() || !body.trim()) {
      setError("Subject and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      await onSend({ toId, subject: subject.trim(), body: body.trim() });
      onClose();
    } catch (err) {
      setError(err.message || "Unable to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Message">
      <form className="space-y-md" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="bg-error-container/60 text-on-error-container text-body-sm px-md py-sm rounded-lg">
            {error}
          </div>
        )}
        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">To</label>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary bg-white"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="Write your message..."
            className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary resize-none"
          />
        </div>
        <Button type="submit" fullWidth loading={submitting} className="!py-md">
          Send Message
        </Button>
      </form>
    </Modal>
  );
}
