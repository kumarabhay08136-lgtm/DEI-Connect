import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import ResourceCard from "../components/resources/ResourceCard";
import AddResourceModal from "../components/resources/AddResourceModal";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { getResources, addResource } from "../services/resourceService";

const FILTERS = ["All", "pdf", "video", "doc", "slides"];

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getResources();
    setResources(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload) => {
    await addResource(payload);
    await load();
  };

  const filtered = resources.filter((r) => filter === "All" || r.type === filter);

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-lg">
        <div>
          <h1 className="font-heading text-headline-md text-primary">Academic Resources</h1>
          <p className="text-body-sm text-on-surface-variant">Curated notes, papers, and recordings from faculty and peers.</p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="flex gap-sm flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-md py-1.5 rounded-full text-label-sm font-semibold capitalize transition-all ${
                  filter === f ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <Button icon="add" onClick={() => setAddOpen(true)} className="shrink-0">
            Add
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading resources..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-lg">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      <AddResourceModal open={addOpen} onClose={() => setAddOpen(false)} onCreate={handleCreate} />
    </PageLayout>
  );
}
