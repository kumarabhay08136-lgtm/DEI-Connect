import Modal from "../common/Modal";
import { avatarFor } from "../../utils/constants";
import { getUserById } from "../../services/userDirectory";
import { getCurrentUserId } from "../../utils/currentUser";
import { useAuth } from "../../hooks/useAuth";

export default function GroupMembersList({ group, open, onClose }) {
  const { user } = useAuth();
  if (!group) return null;

  const members = group.members.map((id) =>
    id === getCurrentUserId()
      ? { id, name: user?.name || "You", role: "You", isYou: true }
      : { ...getUserById(id), isYou: false }
  );

  return (
    <Modal open={open} onClose={onClose} title={`${group.name} — Members`}>
      <div className="space-y-sm max-h-96 overflow-y-auto">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-md py-sm border-b border-outline-variant/10 last:border-none">
            <img src={avatarFor(m.name)} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
              <p className="font-label-md text-on-surface flex items-center gap-xs">
                {m.name}
                {m.id === group.creatorId && (
                  <span className="text-[10px] uppercase tracking-widest font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
                {m.isYou && (
                  <span className="text-[10px] uppercase tracking-widest font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </p>
              <p className="text-xs text-on-surface-variant">{m.role || "Member"}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
