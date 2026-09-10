import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import GroupCard from "../components/groups/GroupCard";
import CreateGroupModal from "../components/groups/CreateGroupModal";
import GroupMembersList from "../components/groups/GroupMembersList";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { getGroups, createGroup, joinGroup, leaveGroup } from "../services/groupService";
import { GROUP_CATEGORIES } from "../utils/mockData";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [membersGroup, setMembersGroup] = useState(null);

  const loadGroups = async () => {
    setLoading(true);
    const data = await getGroups();
    setGroups(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreate = async (data) => {
    await createGroup(data);
    await loadGroups();
  };

  const handleJoin = async (groupId) => {
    setBusyId(groupId);
    await joinGroup(groupId);
    await loadGroups();
    setBusyId(null);
  };

  const handleLeave = async (groupId) => {
    setBusyId(groupId);
    await leaveGroup(groupId);
    await loadGroups();
    setBusyId(null);
  };

  const filtered = groups.filter((g) => {
    const matchesQuery = g.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || g.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-lg">
        <div>
          <h1 className="font-heading text-headline-md text-primary">Groups</h1>
          <p className="text-body-sm text-on-surface-variant">Create or join groups around your interests.</p>
        </div>
        <div className="flex gap-sm w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search groups..."
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-full focus:ring-2 focus:ring-primary text-body-sm outline-none"
            />
          </div>
          <Button icon="add" onClick={() => setCreateOpen(true)}>
            Create
          </Button>
        </div>
      </div>

      <div className="flex gap-sm flex-wrap mb-lg">
        {["All", ...GROUP_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-md py-1.5 rounded-full text-label-sm font-semibold transition-all ${
              category === c ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading groups..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-3xl text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-sm">hub</span>
          <p>No groups found. Try creating one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-lg">
          {filtered.map((g) => (
            <GroupCard
              key={g.id}
              group={g}
              busy={busyId === g.id}
              onJoin={handleJoin}
              onLeave={handleLeave}
              onViewMembers={setMembersGroup}
            />
          ))}
        </div>
      )}

      <CreateGroupModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <GroupMembersList group={membersGroup} open={Boolean(membersGroup)} onClose={() => setMembersGroup(null)} />
    </PageLayout>
  );
}
