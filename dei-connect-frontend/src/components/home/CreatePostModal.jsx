import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { avatarForUser } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import { useApp } from "../../hooks/useApp";
import { createPost } from "../../services/postService";
import { formatFileSize } from "../../utils/helpers";

// Reads a File as a base64 data URL so it can be stored/previewed without a backend.
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CreatePostModal() {
  const { user } = useAuth();
  const { createPostOpen, closeCreatePost, bumpPostsVersion, pushToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null); // { name, size, dataUrl, type }
  const [posting, setPosting] = useState(false);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Reset form whenever the modal is (re)opened, and focus the textarea.
  useEffect(() => {
    if (createPostOpen) {
      setContent("");
      setImagePreview(null);
      setAttachedFile(null);
      setPosting(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [createPostOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!createPostOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeCreatePost();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [createPostOpen, closeCreatePost]);

  if (!createPostOpen) return null;

  const handleImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setImagePreview(dataUrl);
  };

  const handleFilePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setAttachedFile({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || "application/octet-stream",
      dataUrl,
    });
  };

  const handlePublish = async () => {
    if (!content.trim() && !imagePreview && !attachedFile) return;
    setPosting(true);
    try {
      await createPost({
        content: content.trim(),
        image: imagePreview,
        file: attachedFile,
      });
      bumpPostsVersion();
      pushToast?.("Post published", "success");
      closeCreatePost();
      if (location.pathname !== "/" && location.pathname !== "/home") {
        navigate("/");
      }
    } finally {
      setPosting(false);
    }
  };

  const canPost = (content.trim().length > 0 || imagePreview || attachedFile) && !posting;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center bg-primary/40 backdrop-blur-sm p-md overflow-y-auto"
      onClick={closeCreatePost}
    >
      <div
        className="card-surface w-full max-w-xl rounded-3xl overflow-hidden shadow-glass mt-16 sm:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant/20">
          <h2 className="font-heading text-lg font-bold text-primary">Create Post</h2>
          <button
            onClick={closeCreatePost}
            className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-lg">
          <div className="flex gap-md">
            <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-surface-container">
              <img
                alt={user?.name}
                className="w-full h-full object-cover"
                src={avatarForUser(user)}
              />
            </div>
            <div className="flex-1">
              <p className="font-label-md text-on-surface">{user?.name || "You"}</p>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 resize-none text-body-md py-2 min-h-[120px] outline-none"
                placeholder="Write anything — an update, a question, notes, or paste text from a document..."
              />
            </div>
          </div>

          {imagePreview && (
            <div className="relative mt-sm ml-[52px] rounded-xl overflow-hidden border border-outline-variant/30 w-fit">
              <img src={imagePreview} alt="Attachment preview" className="max-h-56 object-cover" />
              <button
                onClick={() => {
                  setImagePreview(null);
                  if (imageInputRef.current) imageInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 bg-primary/80 text-white rounded-full p-1 hover:bg-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm block">close</span>
              </button>
            </div>
          )}

          {attachedFile && (
            <div className="flex items-center gap-md mt-sm ml-[52px] p-md bg-surface-container-low rounded-xl border border-outline-variant/30">
              <div className="w-12 h-12 bg-terracotta/10 rounded-lg flex items-center justify-center text-terracotta shrink-0">
                <span className="material-symbols-outlined text-3xl">description</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-label-md text-on-surface tracking-wide truncate">{attachedFile.name}</h4>
                <p className="text-xs text-outline">{attachedFile.size}</p>
              </div>
              <button
                onClick={() => {
                  setAttachedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-lg py-md bg-surface-container-lowest/50 border-t border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-surface-container text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">image</span>
              <span className="text-xs font-label-md">Image</span>
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImagePick}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-surface-container text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">attach_file</span>
              <span className="text-xs font-label-md">Document</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFilePick}
              className="hidden"
            />
          </div>
          <button
            onClick={handlePublish}
            disabled={!canPost}
            className="bg-primary-container text-white px-xl py-2 rounded-xl font-label-md hover:bg-primary/90 active:scale-95 transition-all shadow-sm disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
