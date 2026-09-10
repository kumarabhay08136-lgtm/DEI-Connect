import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import ProfileCard from "../components/profile/ProfileCard";
import PostCard from "../components/home/PostCard";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { avatarForUser, PLACEHOLDER_IMAGES } from "../utils/constants";
import { getUserById, getFollowing, followUser, unfollowUser } from "../services/socialService";
import { getPostsByAuthor, toggleLike, addComment } from "../services/postService";

// Read-only view of ANOTHER user's profile: photo, cover, about, education,
// skills, and their public posts — plus Follow/Unfollow and a Message
// shortcut straight into the chat with them.
export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followBusy, setFollowBusy] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    (async () => {
      try {
        const [userData, myPosts, following] = await Promise.all([
          getUserById(id),
          getPostsByAuthor(id),
          getFollowing(),
        ]);
        if (cancelled) return;
        setProfile(userData);
        setPosts(myPosts);
        setIsFollowing(following.includes(id));
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Viewing your own id here just sends you to the editable version.
  if (me?.id && me.id === id) {
    return <Navigate to="/profile" replace />;
  }

  const handleToggleFollow = async () => {
    setFollowBusy(true);
    try {
      if (isFollowing) {
        await unfollowUser(id);
        setIsFollowing(false);
      } else {
        await followUser(id);
        setIsFollowing(true);
      }
    } finally {
      setFollowBusy(false);
    }
  };

  const handleMessage = () => {
    navigate(`/chat?user=${id}`);
  };

  const handleToggleLike = async (postId) => {
    const updated = await toggleLike(postId);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
  };

  const handleAddComment = async (postId, text) => {
    const updated = await addComment(postId, text);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
  };

  if (loading) {
    return (
      <PageLayout>
        <Loader label="Loading profile..." />
      </PageLayout>
    );
  }

  if (notFound || !profile) {
    return (
      <PageLayout>
        <div className="text-center py-3xl text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-sm">
            person_off
          </span>
          <p>This profile couldn't be found.</p>
        </div>
      </PageLayout>
    );
  }

  const hasExtendedInfo = "about" in profile;

  return (
    <PageLayout>
      <div className="card-surface rounded-3xl overflow-hidden mb-lg">
        <div
          className="h-40 md:h-56 w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${profile.coverUrl || PLACEHOLDER_IMAGES.campusSecondary})` }}
        >
          <div className="absolute inset-0 bg-primary/30" />
        </div>
        <div className="px-lg pb-lg">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 gap-md">
            <div className="flex items-end gap-md">
              <img
                src={avatarForUser(profile)}
                alt={profile.name}
                className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-soft shrink-0"
              />
              <div className="pb-1">
                <h1 className="font-heading text-headline-md text-primary">{profile.name}</h1>
                <p className="text-body-sm text-on-surface-variant">
                  {profile.tagline || `${profile.role}${profile.department ? ` • ${profile.department}` : ""}`}
                </p>
              </div>
            </div>
            <div className="flex gap-sm">
              <Button variant="outline" icon="chat" onClick={handleMessage}>
                Message
              </Button>
              <Button
                icon={isFollowing ? "person_remove" : "person_add"}
                onClick={handleToggleFollow}
                loading={followBusy}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {!hasExtendedInfo && (
        <div className="card-surface rounded-3xl p-lg mb-lg text-body-sm text-on-surface-variant flex items-center gap-sm">
          <span className="material-symbols-outlined text-outline">lock</span>
          {profile.name} limits their full profile to connections. Follow each other to see more.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {hasExtendedInfo && (
          <div className="lg:col-span-1 space-y-lg">
            <ProfileCard title="About" icon="info">
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                {profile.about || "No bio added yet."}
              </p>
            </ProfileCard>

            <ProfileCard title="Education" icon="school">
              <div className="space-y-sm">
                <p className="font-label-md text-on-surface">{profile.education?.institution}</p>
                <p className="text-body-sm text-on-surface-variant">
                  {profile.education?.degree}
                  {profile.education?.years ? ` • ${profile.education.years}` : ""}
                </p>
              </div>
            </ProfileCard>

            <ProfileCard title="Skills" icon="workspace_premium">
              {!profile.skills?.length ? (
                <p className="text-body-sm text-on-surface-variant">No skills added yet.</p>
              ) : (
                <div className="flex flex-wrap gap-sm">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-surface-container rounded-full text-xs font-label-md text-primary border border-outline-variant/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </ProfileCard>
          </div>
        )}

        <div className={hasExtendedInfo ? "lg:col-span-2 space-y-lg" : "lg:col-span-3 space-y-lg"}>
          <h2 className="font-heading text-title-lg text-primary">Posts</h2>
          {posts.length === 0 ? (
            <div className="card-surface rounded-3xl p-xl text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-sm">post_add</span>
              <p>{profile.name} hasn't posted anything yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} onAddComment={handleAddComment} />
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}
