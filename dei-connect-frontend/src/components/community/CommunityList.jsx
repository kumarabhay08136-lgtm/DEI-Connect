import CommunityCard from "./CommunityCard";

export default function CommunityList({ communities, onToggleJoin }) {
  if (!communities.length) {
    return (
      <div className="text-center py-3xl text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl text-outline-variant mb-sm">hub</span>
        <p>No communities found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-lg">
      {communities.map((c) => (
        <CommunityCard key={c.id} community={c} onToggleJoin={onToggleJoin} />
      ))}
    </div>
  );
}
