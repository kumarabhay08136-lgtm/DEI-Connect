import { useRef, useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { guessResourceType } from "../../services/resourceService";
import { formatFileSize } from "../../utils/helpers";

const TYPE_OPTIONS = [
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "Document" },
  { value: "slides", label: "Slides" },
  { value: "video", label: "Video" },
];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AddResourceModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({ title: "", description: "", department: "", type: "doc" });
  const [file, setFile] = useState(null); // { name, size, dataUrl }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setForm({ title: "", description: "", department: "", type: "doc" });
    setFile(null);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilePick = async (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    const dataUrl = await readFileAsDataUrl(picked);
    setFile({ name: picked.name, size: picked.size, dataUrl, raw: picked });
    setForm((prev) => ({ ...prev, type: guessResourceType(picked) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      await onCreate({
        title: form.title.trim(),
        description: form.description.trim(),
        department: form.department.trim() || "General",
        type: form.type,
        file: file?.raw,
      });
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || "Unable to add resource. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add a Resource">
      <form className="space-y-md" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="bg-error-container/60 text-on-error-container text-body-sm px-md py-sm rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">File</label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-md p-md border border-dashed border-outline-variant/50 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left"
          >
            <span className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">upload_file</span>
            </span>
            <div className="min-w-0">
              {file ? (
                <>
                  <p className="font-label-md text-on-surface truncate">{file.name}</p>
                  <p className="text-xs text-on-surface-variant">{formatFileSize(file.size)}</p>
                </>
              ) : (
                <>
                  <p className="font-label-md text-on-surface">Choose a file to upload</p>
                  <p className="text-xs text-on-surface-variant">PDF, Word, PowerPoint, video — any file type</p>
                </>
              )}
            </div>
          </button>
          <input ref={fileInputRef} type="file" onChange={handleFilePick} className="hidden" />
        </div>

        <Input
          id="r-title"
          name="title"
          label="Title"
          icon="title"
          placeholder="e.g. Data Structures Notes"
          value={form.title}
          onChange={handleChange}
        />

        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="What is this resource about?"
            className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          <Input
            id="r-department"
            name="department"
            label="Department"
            icon="apartment"
            placeholder="e.g. Telecom Engineering"
            value={form.department}
            onChange={handleChange}
          />
          <div>
            <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary bg-white"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button type="submit" fullWidth loading={submitting} className="!py-md">
          Add Resource
        </Button>
      </form>
    </Modal>
  );
}
