import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import PostCard from "../components/home/PostCard";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";
import { useApp } from "../hooks/useApp";
import { avatarFor, avatarForUser } from "../utils/constants";
import { getPosts, createPost, toggleLike, addComment } from "../services/postService";
import { getAllUsers, getFollowing, followUser } from "../services/socialService";

const TABS = ["For You", "Following", "Trending"];

export default function Home() {
  const { user } = useAuth();
  const { postsVersion } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("For You");
  const [draft, setDraft] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const [followingIds, setFollowingIds] = useState([]);
  const [suggestedPeers, setSuggestedPeers] = useState([]);
  const [followBusyId, setFollowBusyId] = useState(null);
  const fileInputRef = useRef(null);

  const loadPosts = async () => {
    setLoading(true);
    const data = await getPosts();
    setPosts(data);
    setLoading(false);
  };

  const loadSocial = async () => {
    const [allUsers, followedIds] = await Promise.all([getAllUsers(), getFollowing()]);
    setFollowingIds(followedIds);
    setSuggestedPeers(allUsers.filter((u) => !followedIds.includes(u.id) && u.id !== user?.id).slice(0, 4));
  };

  useEffect(() => {
    loadPosts();
  }, [postsVersion]);

  useEffect(() => {
    loadSocial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFollow = async (peerId) => {
    setFollowBusyId(peerId);
    const next = await followUser(peerId);
    setFollowingIds(next);
    setSuggestedPeers((prev) => prev.filter((p) => p.id !== peerId));
    setFollowBusyId(null);
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!draft.trim()) return;
    setPosting(true);
    const imageFile = fileInputRef.current?.files?.[0] || null;
    await createPost({ content: draft.trim(), image: imageFile });
    setDraft("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    await loadPosts();
    setPosting(false);
  };

  const handleToggleLike = async (postId) => {
    const updated = await toggleLike(postId);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
  };

  const handleAddComment = async (postId, text) => {
    const updated = await addComment(postId, text);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
  };

  const visiblePosts =
    activeTab === "Trending"
      ? [...posts].sort((a, b) => b.likedBy.length - a.likedBy.length)
      : activeTab === "Following"
      ? posts.filter((p) => p.authorId === user?.id || followingIds.includes(p.authorId))
      : posts;

  return (
    <PageLayout>
    <div className="flex gap-lg items-start">
    <div className="flex-1 min-w-0">
      {/* Welcome banner */}
      <div className="mb-lg rounded-3xl bg-gradient-to-r from-primary to-primary-container p-xl text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <h1 className="text-3xl font-heading font-bold mb-1">
            Welcome back, {user?.name?.split(" ")[0] || "Member"}!
          </h1>
          <div className="h-[2px] w-12 bg-gold mb-4" />
          <p className="text-white/90 max-w-xl">
            Stay updated with your cohort. Explore the latest resources, faculty
            announcements, and peer insights for your current semester.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mb-20 blur-3xl" />
      </div>

      {/* Create post */}
      <section className="card-surface rounded-3xl mb-lg overflow-hidden">
        <div className="p-lg">
          <div className="flex gap-md">
            <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-surface-container">
              <img alt={user?.name} className="w-full h-full object-cover" src={avatarForUser(user)} />
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-body-md py-2 min-h-[60px] outline-none"
              placeholder="Share a resource or ask your cohort a question..."
              rows={2}
            />
          </div>
          {imagePreview && (
            <div className="relative mt-sm ml-[52px] rounded-xl overflow-hidden border border-outline-variant/30 w-fit">
              <img src={imagePreview} alt="Attachment preview" className="max-h-48 object-cover" />
              <button
                onClick={() => {
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 bg-primary/80 text-white rounded-full p-1 hover:bg-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm block">close</span>
              </button>
            </div>
          )}
        </div>
        <div className="px-lg py-md bg-surface-container-lowest/50 border-t border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-surface-container text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">image</span>
              <span className="text-xs font-label-md">Image</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
          </div>
          <button
            onClick={handlePublish}
            disabled={!draft.trim() || posting}
            className="bg-primary-container text-white px-xl py-2 rounded-xl font-label-md hover:bg-primary/90 active:scale-95 transition-all shadow-sm disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-xl border-b border-outline-variant/30 mb-lg">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 font-label-md relative transition-colors ${
              activeTab === tab ? "text-primary" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading your feed..." />
      ) : visiblePosts.length === 0 ? (
        <div className="text-center py-3xl text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-sm">
            {activeTab === "Following" ? "person_search" : "forum"}
          </span>
          {activeTab === "Following" ? (
            <>
              <p className="mb-md">You're not following anyone with posts yet.</p>
              <Link
                to="/feed"
                className="inline-flex items-center gap-1.5 bg-primary-container text-white px-lg py-2 rounded-xl font-label-md hover:bg-primary/90 transition-all"
              >
                <span className="material-symbols-outlined text-lg">person_add</span>
                Find people to follow
              </Link>
            </>
          ) : (
            <p>Nothing here yet.</p>
          )}
        </div>
      ) : (
        <div className="space-y-lg">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} onAddComment={handleAddComment} />
          ))}
        </div>
      )}
    </div>

    {/* Right sidebar */}
    <aside className="hidden xl:block w-80 space-y-lg sticky top-16 shrink-0">
      <section className="card-surface rounded-3xl p-lg">
        <h2 className="font-heading text-lg font-bold text-primary mb-1 flex items-center justify-between">
          Suggested Peers
          <Link className="text-[10px] text-primary font-bold uppercase hover:underline" to="/feed">
            View All
          </Link>
        </h2>
        <div className="h-[2px] w-12 bg-gold mb-4" />
        {suggestedPeers.length === 0 ? (
          <p className="text-xs text-on-surface-variant">You're following everyone suggested so far.</p>
        ) : (
          <div className="space-y-md">
            {suggestedPeers.map((peer) => (
              <div key={peer.id} className="flex items-center gap-md group cursor-pointer">
                <img src={avatarFor(peer.name)} alt={peer.name} className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-on-surface group-hover:text-primary transition-colors truncate">
                    {peer.name}
                  </p>
                  <p className="text-[10px] text-outline truncate">
                    {peer.role} • {peer.department}
                  </p>
                </div>
                <button
                  onClick={() => handleFollow(peer.id)}
                  disabled={followBusyId === peer.id}
                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                  aria-label={`Follow ${peer.name}`}
                >
                  <span className="material-symbols-outlined text-lg">person_add</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card-surface rounded-3xl p-lg">
        <h2 className="font-heading text-lg font-bold text-primary mb-1">Upcoming Events</h2>
        <div className="h-[2px] w-12 bg-gold mb-4" />
        <div className="flex gap-md group cursor-pointer">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-primary flex flex-col items-center justify-center text-white">
            <span className="text-xs font-bold">OCT</span>
            <span className="text-lg font-black leading-none">24</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Tech-Symposium 2026</p>
            <p className="text-[10px] text-outline">9:00 AM • Convocation Hall</p>
          </div>
        </div>
        <button className="w-full mt-lg py-2 border border-primary text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all">
          Register for Events
        </button>
      </section>
    </aside>
    </div>
    </PageLayout>
  );
}
