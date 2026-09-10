import { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

const EMPTY_FORM = {
  title: "",
  organization: "",
  description: "",
  skills: "",
  duration: "",
  location: "",
  eligibility: "",
  applyDetails: "",
};

export default function CreateInternshipModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.organization.trim() || !form.description.trim()) {
      setError("Title, organization, and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      await onCreate({
        title: form.title.trim(),
        organization: form.organization.trim(),
        description: form.description.trim(),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        duration: form.duration.trim() || "Flexible",
        location: form.location.trim() || "On-campus",
        eligibility: form.eligibility.trim() || "Open to all eligible members",
        applyDetails: form.applyDetails.trim() || "Contact the poster directly to apply.",
      });
      setForm(EMPTY_FORM);
      onClose();
    } catch (err) {
      setError(err.message || "Unable to post internship. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Post an Internship">
      <form className="space-y-md" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="bg-error-container/60 text-on-error-container text-body-sm px-md py-sm rounded-lg">
            {error}
          </div>
        )}
        <Input id="i-title" name="title" label="Internship Title" icon="work" placeholder="e.g. Research Intern — Wireless Networks" value={form.title} onChange={handleChange} />
        <Input id="i-org" name="organization" label="Organization / Person" icon="apartment" placeholder="e.g. DEI Telecom Research Lab" value={form.organization} onChange={handleChange} />
        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="What will the intern work on?"
            className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary resize-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          <Input id="i-duration" name="duration" label="Duration" icon="schedule" placeholder="e.g. 8 weeks" value={form.duration} onChange={handleChange} />
          <Input id="i-location" name="location" label="Location" icon="location_on" placeholder="e.g. Remote / On-campus" value={form.location} onChange={handleChange} />
        </div>
        <Input id="i-skills" name="skills" label="Skills Required (comma separated)" icon="psychology" placeholder="e.g. Python, MATLAB" value={form.skills} onChange={handleChange} />
        <Input id="i-eligibility" name="eligibility" label="Eligibility" icon="fact_check" placeholder="e.g. 3rd/4th year students" value={form.eligibility} onChange={handleChange} />
        <div>
          <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Application Details</label>
          <textarea
            name="applyDetails"
            value={form.applyDetails}
            onChange={handleChange}
            rows={2}
            placeholder="How should applicants apply?"
            className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary resize-none"
          />
        </div>
        <Button type="submit" fullWidth loading={submitting} className="!py-md">
          Post Internship
        </Button>
      </form>
    </Modal>
  );
}
