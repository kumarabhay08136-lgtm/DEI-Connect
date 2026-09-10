import { useRef, useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { COMMUNITY_CATEGORIES } from "../../utils/mockData";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CreateCommunityModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", description: "", category: COMMUNITY_CATEGORIES[0] });
  const [icon, setIcon] = useState(null); // data URL, preview only
  const [banner, setBanner] = useState(null); // data URL, preview only
  const [iconFile, setIconFile] = useState(null); // raw File, sent to the server
  const [bannerFile, setBannerFile] = useState(null); // raw File, sent to the server
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const iconInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const resetForm = () => {
    setForm({ name: "", description: "", category: COMMUNITY_CATEGORIES[0] });
    setIcon(null);
    setBanner(null);
    setIconFile(null);
    setBannerFile(null);
    setError("");
  };

  const handleIconPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    setIcon(await readFileAsDataUrl(file));
  };

  const handleBannerPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBanner(await readFileAsDataUrl(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.description.trim()) {
      setError("Community name and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      await onCreate({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        icon: iconFile,
        banner: bannerFile,
      });
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || "Unable to create community. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create a Community">
      <form className="space-y-md" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="bg-error-container/60 text-on-error-container text-body-sm px-md py-sm rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Cover Banner</label>
          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="relative w-full h-28 rounded-2xl overflow-hidden bg-surface-container border border-dashed border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
            title="Upload cover banner"
          >
            {banner ? (
              <img src={banner} alt="Banner preview" className="w-full h-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                <span className="text-xs">Upload a wide cover image</span>
              </span>
            )}
          </button>
          <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerPick} className="hidden" />
          {banner && (
            <button
              type="button"
              onClick={() => {
                setBanner(null);
                setBannerFile(null);
              }}
              className="text-xs text-error hover:underline mt-1"
            >
              Remove banner
            </button>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Community Icon</label>
          <div className="flex items-center gap-md">
            <button
              type="button"
              onClick={() => iconInputRef.current?.click()}
              className="relative w-16 h-16 rounded-2xl overflow-hidden bg-surface-container border border-dashed border-outline-variant/50 shrink-0 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
              title="Upload community icon"
            >
              {icon ? (
                <img src={icon} alt="Icon preview" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-2xl">add_a_photo</span>
              )}
            </button>
            <input ref={iconInputRef} type="file" accept="image/*" onChange={handleIconPick} className="hidden" />
            <div className="flex-1">
              <p className="text-xs text-on-surface-variant">Optional. Square images work best.</p>
              {icon && (
                <button
                  type="button"
                  onClick={() => {
                    setIcon(null);
                    setIconFile(null);
                  }}
                  className="text-xs text-error hover:underline mt-1"
                >
                  Remove icon
                </button>
              )}
            </div>
          </div>
        </div>

        <Input
          id="c-name"
          name="name"
          label="Community Name"
          icon="hub"
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
            placeholder="What is this community about?"
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
            {COMMUNITY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" fullWidth loading={submitting} className="!py-md">
          Create Community
        </Button>
      </form>
    </Modal>
  );
}
