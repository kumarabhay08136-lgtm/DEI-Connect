import { useRef, useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { GROUP_CATEGORIES } from "../../utils/mockData";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CreateGroupModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", description: "", category: GROUP_CATEGORIES[0], tags: "" });
  const [image, setImage] = useState(null); // data URL, preview only
  const [imageFile, setImageFile] = useState(null); // raw File, sent to the server
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setImageFile(file);
    setImage(dataUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.description.trim()) {
      setError("Group name and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      await onCreate({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        image: imageFile,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setForm({ name: "", description: "", category: GROUP_CATEGORIES[0], tags: "" });
      setImage(null);
      setImageFile(null);
      onClose();
    } catch (err) {
      setError(err.message || "Unable to create group. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create a Group">
      <form className="space-y-md" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="bg-error-container/60 text-on-error-container text-body-sm px-md py-sm rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Group Icon</label>
          <div className="flex items-center gap-md">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-16 h-16 rounded-2xl overflow-hidden bg-surface-container border border-dashed border-outline-variant/50 shrink-0 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
              title="Upload group icon"
            >
              {image ? (
                <img src={image} alt="Group icon preview" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-2xl">add_a_photo</span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImagePick}
              className="hidden"
            />
            <div className="flex-1">
              <p className="text-xs text-on-surface-variant">Optional. Square images work best.</p>
              {image && (
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImageFile(null);
                  }}
                  className="text-xs text-error hover:underline mt-1"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
        </div>

        <Input
          id="group-name"
          name="name"
          label="Group Name"
          icon="groups"
          placeholder="e.g. Photography Society"
          value={form.name}
          onChange={handleChange}
        />
        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="What is this group about?"
            className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary resize-none"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary bg-white"
          >
            {GROUP_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Input
          id="group-tags"
          name="tags"
          label="Tags (comma separated)"
          icon="sell"
          placeholder="e.g. Photography, Editing"
          value={form.tags}
          onChange={handleChange}
        />
        <Button type="submit" fullWidth loading={submitting} className="!py-md">
          Create Group
        </Button>
      </form>
    </Modal>
  );
}
