import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import InternshipCard from "../components/internships/InternshipCard";
import CreateInternshipModal from "../components/internships/CreateInternshipModal";
import InternshipDetailsModal from "../components/internships/InternshipDetailsModal";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import {
  getInternships,
  createInternship,
  applyToInternship,
  getAppliedInternshipIds,
} from "../services/internshipService";

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [applied, setApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [query, setQuery] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsInternship, setDetailsInternship] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const [list, appliedIds] = await Promise.all([getInternships(), getAppliedInternshipIds()]);
    setInternships(list);
    setApplied(appliedIds);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (data) => {
    await createInternship(data);
    await loadData();
  };

  const handleApply = async (id) => {
    setBusyId(id);
    await applyToInternship(id);
    setApplied((prev) => [...prev, id]);
    setBusyId(null);
  };

  const filtered = internships.filter((i) => {
    const matchesQuery =
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.organization.toLowerCase().includes(query.toLowerCase());
    const matchesRemote = !remoteOnly || i.remote;
    return matchesQuery && matchesRemote;
  });

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-lg">
        <div>
          <h1 className="font-heading text-headline-md text-primary">Internships</h1>
          <p className="text-body-sm text-on-surface-variant">
            Discover opportunities posted by faculty, alumni, and peers — or post your own.
          </p>
        </div>
        <div className="flex gap-sm w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search internships..."
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-full focus:ring-2 focus:ring-primary text-body-sm outline-none"
            />
          </div>
          <Button icon="add" onClick={() => setCreateOpen(true)}>
            Post
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-sm mb-lg">
        <button
          onClick={() => setRemoteOnly((prev) => !prev)}
          className={`px-md py-1.5 rounded-full text-label-sm font-semibold transition-all flex items-center gap-xs ${
            remoteOnly ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-base">home_work</span>
          Remote Only
        </button>
      </div>

      {loading ? (
        <Loader label="Loading internships..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-3xl text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-sm">work_off</span>
          <p>No internships found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-lg">
          {filtered.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              applied={applied.includes(internship.id)}
              busy={busyId === internship.id}
              onApply={handleApply}
              onViewDetails={setDetailsInternship}
            />
          ))}
        </div>
      )}

      <CreateInternshipModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <InternshipDetailsModal
        internship={detailsInternship}
        open={Boolean(detailsInternship)}
        onClose={() => setDetailsInternship(null)}
        onApply={handleApply}
        applied={detailsInternship ? applied.includes(detailsInternship.id) : false}
        busy={detailsInternship ? busyId === detailsInternship.id : false}
      />
    </PageLayout>
  );
}
