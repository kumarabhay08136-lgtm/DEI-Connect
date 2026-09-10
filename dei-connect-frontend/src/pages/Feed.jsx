import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import UserCard from "../components/feed/UserCard";
import Loader from "../components/common/Loader";
import { getAllUsers, getFollowing, followUser, unfollowUser } from "../services/socialService";

const ROLE_FILTERS = ["All", "Student", "Faculty", "Alumni"];

export default function Feed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    (async () => {
      const [allUsers, followedIds] = await Promise.all([getAllUsers(), getFollowing()]);
      setUsers(allUsers);
      setFollowing(followedIds);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  const handleToggleFollow = async (userId) => {
    setBusyId(userId);
    if (following.includes(userId)) {
      const next = await unfollowUser(userId);
      setFollowing(next);
    } else {
      const next = await followUser(userId);
      setFollowing(next);
    }
    setBusyId(null);
  };

  const filtered = users.filter((u) => {
    const matchesQuery = u.name.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-lg">
        <div>
          <h1 className="font-heading text-headline-md text-primary">Feed</h1>
          <p className="text-body-sm text-on-surface-variant">
            Discover and connect with students, faculty, and alumni across DEI.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchParams(e.target.value ? { q: e.target.value } : {});
            }}
            placeholder="Search people..."
            className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-full focus:ring-2 focus:ring-primary text-body-sm outline-none"
          />
        </div>
      </div>

      <div className="flex gap-sm flex-wrap mb-lg">
        {ROLE_FILTERS.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-md py-1.5 rounded-full text-label-sm font-semibold transition-all ${
              roleFilter === r ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading members..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-3xl text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-sm">group_off</span>
          <p>No members found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
          {filtered.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              isFollowing={following.includes(u.id)}
              onToggleFollow={handleToggleFollow}
              busy={busyId === u.id}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
