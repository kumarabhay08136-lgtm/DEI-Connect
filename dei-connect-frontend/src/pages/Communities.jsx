import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import CommunityList from "../components/community/CommunityList";
import CreateCommunityModal from "../components/community/CreateCommunityModal";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { getCommunities, createCommunity, joinCommunity, leaveCommunity } from "../services/communityService";
import { useAuth } from "../hooks/useAuth";

export default function Communities() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getCommunities();
    setCommunities(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload) => {
    await createCommunity(payload);
    await load();
  };

  const handleToggleJoin = async (community) => {
    if (community.members.includes(user?.id)) {
      await leaveCommunity(community.id);
    } else {
      await joinCommunity(community.id);
    }
    await load();
  };

  const filtered = communities.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-lg">
        <div>
          <h1 className="font-heading text-headline-md text-primary">Discover Communities</h1>
          <p className="text-body-sm text-on-surface-variant">Find your people across departments and interests.</p>
        </div>
        <div className="flex items-center gap-sm w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search communities..."
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-full focus:ring-2 focus:ring-primary text-body-sm outline-none"
            />
          </div>
          <Button icon="add" onClick={() => setCreateOpen(true)} className="shrink-0">
            Create
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading communities..." />
      ) : (
        <CommunityList communities={filtered} onToggleJoin={handleToggleJoin} />
      )}

      <CreateCommunityModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
    </PageLayout>
  );
}
