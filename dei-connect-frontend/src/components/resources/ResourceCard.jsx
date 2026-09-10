const TYPE_ICON = {
  pdf: "picture_as_pdf",
  video: "play_circle",
  doc: "description",
  slides: "slideshow",
};

const TYPE_COLOR = {
  pdf: "text-terracotta bg-terracotta/10",
  video: "text-secondary bg-secondary/10",
  doc: "text-primary-container bg-primary-container/10",
  slides: "text-gold bg-gold/10",
};

export default function ResourceCard({ resource }) {
  const handleDownload = () => {
    if (!resource.fileData) return;
    const link = document.createElement("a");
    link.href = resource.fileData;
    link.download = resource.fileName || resource.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card-surface rounded-3xl p-lg hover:shadow-glass transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-md">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${TYPE_COLOR[resource.type]}`}>
          <span className="material-symbols-outlined text-2xl">{TYPE_ICON[resource.type]}</span>
        </div>
        <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">bookmark</button>
      </div>
      <h3 className="font-heading text-title-lg text-primary mb-xs">{resource.title}</h3>
      <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-md">{resource.description}</p>
      <div className="flex items-center justify-between text-xs text-outline">
        <span>{resource.department}</span>
        <span>{resource.size}</span>
      </div>
      <button
        onClick={handleDownload}
        disabled={!resource.fileData}
        className="w-full mt-md py-2 border border-primary/20 text-primary rounded-xl text-label-sm font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed"
        title={resource.fileData ? "Download" : "No file attached"}
      >
        <span className="material-symbols-outlined text-lg">download</span>
        Download
      </button>
    </div>
  );
}
