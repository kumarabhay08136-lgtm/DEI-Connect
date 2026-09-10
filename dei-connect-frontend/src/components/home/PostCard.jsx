import { useState } from "react";
import { Link } from "react-router-dom";
import { avatarFor } from "../../utils/constants";
import { getUserById } from "../../services/userDirectory";
import { getCurrentUserId } from "../../utils/currentUser";
import { useAuth } from "../../hooks/useAuth";
import { timeAgo } from "../../utils/helpers";

// Resolves a display identity for either the logged-in user or someone
// else's cached directory entry (so avatar + a link to their profile show
// up correctly for every post, not just your own).
function resolveIdentity(id, currentUser) {
  if (id === getCurrentUserId()) {
    return { id, name: currentUser?.name || "You", role: "You", avatarUrl: currentUser?.avatarUrl || null, isSelf: true };
  }
  const user = getUserById(id);
  return user
    ? { id, name: user.name, role: `${user.role} • ${user.department}`, avatarUrl: user.avatarUrl || null, isSelf: false }
    : { id, name: "DEI Member", role: "Member", avatarUrl: null, isSelf: false };
}

export default function PostCard({ post, onToggleLike, onAddComment }) {
  const { user } = useAuth();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const author = resolveIdentity(post.authorId, user);
  const liked = post.likedBy.includes(getCurrentUserId());

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setSubmitting(true);
    await onAddComment(post.id, draft.trim());
    setDraft("");
    setSubmitting(false);
  };

  return (
    <article className="card-surface rounded-3xl overflow-hidden">
      <div className="p-lg">
        <div className="flex justify-between items-start mb-md">
          <div className="flex gap-md">
            <div className={`h-12 w-12 rounded-full overflow-hidden ${post.official ? "border-2 border-terracotta/20" : ""}`}>
              {author.isSelf ? (
                <img alt={author.name} className="w-full h-full object-cover" src={author.avatarUrl || avatarFor(author.name)} />
              ) : (
                <Link to={`/profile/${author.id}`}>
                  <img alt={author.name} className="w-full h-full object-cover" src={author.avatarUrl || avatarFor(author.name)} />
                </Link>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {author.isSelf ? (
                  <h3 className="font-label-md text-on-surface tracking-wide">{author.name}</h3>
                ) : (
                  <Link to={`/profile/${author.id}`} className="font-label-md text-on-surface tracking-wide hover:text-primary hover:underline">
                    {author.name}
                  </Link>
                )}
                {post.verified && (
                  <span className="material-symbols-outlined text-gold text-[18px] icon-fill">verified</span>
                )}
              </div>
              <p className="text-xs text-outline">{author.role}</p>
              <p className="text-[10px] text-outline-variant mt-0.5">{timeAgo(post.postedAt)}</p>
            </div>
          </div>
          {post.official ? (
            <span className="px-3 py-1 bg-terracotta text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">
              Official Announcement
            </span>
          ) : (
            <button className="material-symbols-outlined text-outline hover:text-primary">more_horiz</button>
          )}
        </div>
        <p className="text-body-md text-on-surface mb-md whitespace-pre-line">{post.content}</p>

        {post.file && (
          <div className="flex items-center gap-md p-md bg-surface-container-low rounded-xl border border-outline-variant/30 hover:bg-surface-container-high transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-terracotta/10 rounded-lg flex items-center justify-center text-terracotta shrink-0">
              <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-label-md text-on-surface tracking-wide truncate">{post.file.name}</h4>
              <p className="text-xs text-outline">{post.file.size}</p>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">
              download
            </span>
          </div>
        )}
      </div>

      {post.image && (
        <div className="relative w-full aspect-video bg-surface-container overflow-hidden">
          <img alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" src={post.image} />
        </div>
      )}

      <div className="px-lg py-md flex items-center justify-between border-t border-outline-variant/10">
        <div className="flex gap-lg">
          <button
            onClick={() => onToggleLike(post.id)}
            className={`flex items-center gap-1.5 transition-colors ${liked ? "text-error" : "text-on-surface-variant hover:text-error"}`}
          >
            <span className={`material-symbols-outlined text-lg ${liked ? "icon-fill" : ""}`}>favorite</span>
            <span className="text-xs font-label-md tracking-wide">{post.likedBy.length}</span>
          </button>
          <button
            onClick={() => setCommentsOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 transition-colors ${commentsOpen ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}
          >
            <span className="material-symbols-outlined text-lg">chat_bubble</span>
            <span className="text-xs font-label-md tracking-wide">{post.comments.length}</span>
          </button>
          <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">share</span>
          </button>
        </div>
        <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">bookmark</button>
      </div>

      {commentsOpen && (
        <div className="px-lg pb-lg border-t border-outline-variant/10 pt-md space-y-md">
          {post.comments.length > 0 && (
            <div className="space-y-sm">
              {post.comments.map((c) => {
                const commenter = resolveIdentity(c.authorId, user);
                return (
                  <div key={c.id} className="flex items-start gap-sm">
                    <img src={commenter.avatarUrl || avatarFor(commenter.name)} alt={commenter.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    <div className="bg-surface-container-low rounded-xl px-md py-sm flex-1">
                      <p className="text-xs font-semibold text-on-surface">{commenter.name}</p>
                      <p className="text-body-sm text-on-surface-variant">{c.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <form onSubmit={handleSubmitComment} className="flex items-center gap-sm">
            <img src={avatarForUser(user)} alt="You" className="w-8 h-8 rounded-full object-cover shrink-0" />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-surface-container-low rounded-full px-md py-sm outline-none focus:ring-2 focus:ring-primary text-body-sm"
            />
            <button
              type="submit"
              disabled={!draft.trim() || submitting}
              className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
