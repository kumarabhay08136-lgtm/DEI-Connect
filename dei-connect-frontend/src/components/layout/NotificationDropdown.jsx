import { useState, useEffect, useRef } from "react";
import { avatarFor } from "../../utils/constants";
import { getUserById } from "../../services/userDirectory";
import { getCurrentUserId } from "../../utils/currentUser";
import { useAuth } from "../../hooks/useAuth";
import { getNotifications, markAsRead, markAllAsRead } from "../../services/notificationService";
import { timeAgo } from "../../utils/helpers";
import { classNames } from "../../utils/helpers";

const TYPE_ICON = {
  follow: "person_add",
  like: "favorite",
  group_invite: "groups",
  mention: "alternate_email",
  message: "mail",
};

export default function NotificationDropdown({ open, onClose }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
      setLoading(false);
    })();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const handleRead = async (id) => {
    const next = await markAsRead(id);
    setNotifications(next.sort((a, b) => b.time - a.time));
  };

  const handleReadAll = async () => {
    const next = await markAllAsRead();
    setNotifications(next.sort((a, b) => b.time - a.time));
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-sm w-80 max-h-[420px] bg-white rounded-2xl shadow-glass border border-outline-variant/20 z-50 animate-fade-in overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between px-md py-sm border-b border-outline-variant/20">
        <h3 className="font-heading text-title-lg text-primary">Notifications</h3>
        <button onClick={handleReadAll} className="text-xs font-semibold text-primary hover:underline">
          Mark all read
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-lg text-center text-on-surface-variant text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-lg text-center text-on-surface-variant text-sm">No notifications yet.</div>
        ) : (
          notifications.map((n) => {
            const actor =
              n.actorId === getCurrentUserId()
                ? { name: user?.name || "You" }
                : getUserById(n.actorId) || { name: "DEI Member" };
            return (
              <button
                key={n.id}
                onClick={() => handleRead(n.id)}
                className={classNames(
                  "w-full flex items-start gap-sm px-md py-sm text-left border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors",
                  !n.read && "bg-primary/5"
                )}
              >
                <div className="relative shrink-0">
                  <img src={avatarFor(actor.name)} alt={actor.name} className="w-9 h-9 rounded-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-outline-variant/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[12px] text-primary">
                      {TYPE_ICON[n.type] || "notifications"}
                    </span>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm text-on-surface">
                    <span className="font-semibold">{actor.name}</span> {n.message}
                  </p>
                  <p className="text-[10px] text-outline mt-0.5">{timeAgo(n.time)}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
