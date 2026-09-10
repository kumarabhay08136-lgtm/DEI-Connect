import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileCard from "../components/profile/ProfileCard";
import EditProfileModal from "../components/profile/EditProfileModal";
import PostCard from "../components/home/PostCard";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  uploadCover,
  removeCover,
} from "../services/profileService";
import { getPostsByAuthor, toggleLike, addComment } from "../services/postService";
import { getFollowing } from "../services/socialService";
import { getGroups } from "../services/groupService";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ connections: 0, posts: 0, communities: 0 });
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const loadAll = async () => {
    if (!user?.id) return;
    setLoading(true);
    const [profileData, myPosts, following, groups] = await Promise.all([
      getProfile(),
      getPostsByAuthor(user.id),
      getFollowing(),
      getGroups(),
    ]);
    setProfile(profileData);
    setPosts(myPosts);
    setStats({
      connections: following.length,
      posts: myPosts.length,
      communities: groups.filter((g) => g.members.includes(user.id)).length,
    });
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleSaveProfile = async (values) => {
    const { name, ...profileFields } = values;
    const updated = await updateProfile({ name, ...profileFields });
    updateUser({ name });
    setProfile(updated);
  };

  const handleToggleLike = async (postId) => {
    const updated = await toggleLike(postId);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
  };

  const handleAddComment = async (postId, text) => {
    const updated = await addComment(postId, text);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
  };

  if (loading || !profile) {
    return (
      <PageLayout>
        <Loader label="Loading your profile..." />
      </PageLayout>
    );
  }

  const headerUser = {
    name: user?.name || "DEI Member",
    tagline: profile.tagline,
    connections: stats.connections,
    posts: stats.posts,
    communities: stats.communities,
    avatarUrl: user?.avatarUrl || null,
    coverUrl: user?.coverUrl || null,
  };

  const handleAvatarChange = async (file) => {
    const { avatarUrl } = await uploadAvatar(file);
    updateUser({ avatarUrl });
  };

  const handleAvatarRemove = async () => {
    await removeAvatar();
    updateUser({ avatarUrl: null });
  };

  const handleCoverChange = async (file) => {
    const { coverUrl } = await uploadCover(file);
    updateUser({ coverUrl });
  };

  const handleCoverRemove = async () => {
    await removeCover();
    updateUser({ coverUrl: null });
  };

  return (
    <PageLayout>
      <ProfileHeader
        user={headerUser}
        onEdit={() => setEditOpen(true)}
        onAvatarChange={handleAvatarChange}
        onAvatarRemove={handleAvatarRemove}
        onCoverChange={handleCoverChange}
        onCoverRemove={handleCoverRemove}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-1 space-y-lg">
          <ProfileCard title="About" icon="info" onEdit={() => setEditOpen(true)}>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              {profile.about || "Add a short bio to tell others about yourself."}
            </p>
          </ProfileCard>

          <ProfileCard title="Education" icon="school" onEdit={() => setEditOpen(true)}>
            <div className="space-y-sm">
              <p className="font-label-md text-on-surface">{profile.education.institution}</p>
              <p className="text-body-sm text-on-surface-variant">
                {profile.education.degree}
                {profile.education.years ? ` • ${profile.education.years}` : ""}
              </p>
            </div>
          </ProfileCard>

          <ProfileCard title="Skills" icon="workspace_premium" onEdit={() => setEditOpen(true)}>
            {profile.skills.length === 0 ? (
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

        <div className="lg:col-span-2 space-y-lg">
          <h2 className="font-heading text-title-lg text-primary">Recent Activity</h2>
          {posts.length === 0 ? (
            <div className="card-surface rounded-3xl p-xl text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-sm">post_add</span>
              <p>You haven't posted anything yet. Share something from the Home feed!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} onAddComment={handleAddComment} />
            ))
          )}
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialValues={{
          name: user?.name || "",
          tagline: profile.tagline,
          about: profile.about,
          education: profile.education,
          skills: profile.skills.join(", "),
        }}
        onSave={handleSaveProfile}
      />
    </PageLayout>
  );
}
