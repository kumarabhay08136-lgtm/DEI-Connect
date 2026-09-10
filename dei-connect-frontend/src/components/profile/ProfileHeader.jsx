import { useRef, useState } from "react";
import { PLACEHOLDER_IMAGES, avatarForUser } from "../../utils/constants";
import Button from "../common/Button";
import Modal from "../common/Modal";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfileHeader({
  user,
  onEdit,
  onAvatarChange,
  onAvatarRemove,
  onCoverChange,
  onCoverRemove,
}) {
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  // Holds a freshly-picked image awaiting confirmation:
  // { kind: "avatar" | "cover", dataUrl (preview only), file (raw File to upload) }
  const [pending, setPending] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handlePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setPending({ kind: "avatar", dataUrl, file });
    e.target.value = "";
  };

  const handleCoverPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setPending({ kind: "cover", dataUrl, file });
    e.target.value = "";
  };

  const handleConfirm = async () => {
    if (!pending) return;
    setConfirming(true);
    try {
      if (pending.kind === "avatar") await onAvatarChange?.(pending.file);
      else await onCoverChange?.(pending.file);
      setPending(null);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = () => setPending(null);

  return (
    <div className="card-surface rounded-3xl overflow-hidden mb-lg">
      <div
        className="h-40 md:h-56 w-full bg-cover bg-center relative group"
        style={{ backgroundImage: `url(${user.coverUrl || PLACEHOLDER_IMAGES.campusSecondary})` }}
      >
        <div className="absolute inset-0 bg-primary/30" />

        {/* Hover overlay: change cover photo */}
        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white"
          title="Change cover photo"
        >
          <span className="material-symbols-outlined text-2xl">photo_camera</span>
          <span className="text-xs font-label-md">Change cover photo</span>
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverPick}
          className="hidden"
        />

        {/* Remove button, only when a custom cover is set */}
        {user.coverUrl && (
          <button
            type="button"
            onClick={onCoverRemove}
            className="absolute top-3 right-3 flex items-center gap-1 bg-primary/70 hover:bg-error text-white rounded-full pl-2 pr-3 py-1 text-xs shadow-sm transition-colors"
            title="Remove cover photo"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            Remove
          </button>
        )}
      </div>
      <div className="px-lg pb-lg">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 gap-md">
          <div className="flex items-end gap-md">
            <div className="relative group shrink-0 w-24 h-24">
              <img
                src={avatarForUser(user)}
                alt={user.name}
                className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-soft"
              />
              {/* Hover overlay: change photo */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-primary/60 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5 text-white"
                title="Change profile picture"
              >
                <span className="material-symbols-outlined text-xl">photo_camera</span>
                <span className="text-[10px] font-label-md">Change</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePick}
                className="hidden"
              />
              {/* Remove button, only when a custom picture is set */}
              {user.avatarUrl && (
                <button
                  type="button"
                  onClick={onAvatarRemove}
                  className="absolute -top-1.5 -right-1.5 bg-error text-white rounded-full p-1 shadow-sm hover:bg-error/90 transition-colors"
                  title="Remove profile picture"
                >
                  <span className="material-symbols-outlined text-sm block">close</span>
                </button>
              )}
            </div>
            <div className="pb-1">
              <h1 className="font-heading text-headline-md text-primary">{user.name}</h1>
              <p className="text-body-sm text-on-surface-variant">{user.tagline}</p>
            </div>
          </div>
          <Button variant="outline" icon="edit" size="sm" onClick={onEdit}>
            Edit Profile
          </Button>
        </div>

        <div className="flex flex-wrap gap-lg mt-lg pt-lg border-t border-outline-variant/20">
          <Stat label="Connections" value={user.connections} />
          <Stat label="Posts" value={user.posts} />
          <Stat label="Communities" value={user.communities} />
        </div>
      </div>

      {/* Confirm step for a freshly-picked avatar/cover photo */}
      <Modal
        open={!!pending}
        onClose={handleCancel}
        title={pending?.kind === "avatar" ? "Update Profile Picture" : "Update Cover Photo"}
      >
        {pending && (
          <div className="space-y-lg">
            <div
              className={
                pending.kind === "avatar"
                  ? "w-40 h-40 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-soft"
                  : "w-full h-40 rounded-2xl overflow-hidden"
              }
            >
              <img src={pending.dataUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-sm">
              <Button variant="outline" fullWidth onClick={handleCancel} disabled={confirming}>
                Cancel
              </Button>
              <Button fullWidth onClick={handleConfirm} loading={confirming}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="font-heading text-title-lg text-primary">{value}</p>
      <p className="text-label-sm text-on-surface-variant uppercase tracking-wide">{label}</p>
    </div>
  );
}
