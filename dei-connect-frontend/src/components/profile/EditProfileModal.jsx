import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

export default function EditProfileModal({ open, onClose, initialValues, onSave }) {
  const [form, setForm] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialValues);
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, education: { ...prev.education, [name]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    setSubmitting(true);
    try {
      await onSave({
        name: (form.name || "").trim(),
        tagline: (form.tagline || "").trim(),
        about: (form.about || "").trim(),
        education: {
          institution: (form.education?.institution || "").trim(),
          degree: (form.education?.degree || "").trim(),
          years: (form.education?.years || "").trim(),
        },
        skills: (typeof form.skills === "string" ? form.skills : (form.skills || []).join(","))
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      onClose();
    } catch (err) {
      setError(err.message || "Unable to save changes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <form className="space-y-md max-h-[65vh] overflow-y-auto pr-1" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="bg-error-container/60 text-on-error-container text-body-sm px-md py-sm rounded-lg">
            {error}
          </div>
        )}

        <Input id="edit-name" name="name" label="Full Name" icon="badge" value={form.name} onChange={handleChange} />
        <Input
          id="edit-tagline"
          name="tagline"
          label="Tagline"
          icon="short_text"
          placeholder="e.g. B.Voc Telecom Engineering • Semester 4"
          value={form.tagline}
          onChange={handleChange}
        />

        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">About</label>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={3}
            placeholder="Tell others a bit about yourself..."
            className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary resize-none"
          />
        </div>

        <div className="pt-sm border-t border-outline-variant/20">
          <p className="text-sm font-semibold text-on-surface-variant mb-sm">Education</p>
          <div className="space-y-md">
            <Input
              id="edit-institution"
              name="institution"
              label="Institution"
              icon="school"
              value={form.education.institution}
              onChange={handleEducationChange}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <Input
                id="edit-degree"
                name="degree"
                label="Degree / Program"
                icon="workspace_premium"
                value={form.education.degree}
                onChange={handleEducationChange}
              />
              <Input
                id="edit-years"
                name="years"
                label="Years"
                icon="calendar_month"
                placeholder="e.g. 2023 – 2027"
                value={form.education.years}
                onChange={handleEducationChange}
              />
            </div>
          </div>
        </div>

        <Input
          id="edit-skills"
          name="skills"
          label="Skills (comma separated)"
          icon="psychology"
          placeholder="e.g. Python, Networking, IoT"
          value={form.skills}
          onChange={handleChange}
        />

        <Button type="submit" fullWidth loading={submitting} className="!py-md">
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}
