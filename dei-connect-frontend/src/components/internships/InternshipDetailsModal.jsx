import Modal from "../common/Modal";
import Button from "../common/Button";
import { avatarFor } from "../../utils/constants";
import { getUserById } from "../../services/userDirectory";
import { getCurrentUserId } from "../../utils/currentUser";
import { useAuth } from "../../hooks/useAuth";

export default function InternshipDetailsModal({ internship, open, onClose, onApply, applied, busy }) {
  const { user } = useAuth();
  if (!internship) return null;

  const poster =
    internship.postedBy === getCurrentUserId()
      ? { name: user?.name || "You" }
      : getUserById(internship.postedBy) || { name: "DEI Member" };

  return (
    <Modal open={open} onClose={onClose} title={internship.title}>
      <div className="space-y-md">
        <div className="flex items-center gap-sm">
          <img src={avatarFor(poster.name)} alt={poster.name} className="w-8 h-8 rounded-full object-cover" />
          <div>
            <p className="text-sm font-semibold text-on-surface">{internship.organization}</p>
            <p className="text-xs text-outline">Posted by {poster.name}</p>
          </div>
        </div>

        <p className="text-body-sm text-on-surface-variant leading-relaxed">{internship.description}</p>

        <div className="grid grid-cols-2 gap-md text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-0.5">Duration</p>
            <p className="text-on-surface">{internship.duration}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-0.5">Location</p>
            <p className="text-on-surface">{internship.remote ? "Remote" : internship.location}</p>
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Skills Required</p>
          <div className="flex flex-wrap gap-1.5">
            {internship.skills.map((skill) => (
              <span key={skill} className="px-2.5 py-0.5 bg-surface-container rounded-full text-[10px] font-semibold text-on-surface-variant border border-outline-variant/30">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-0.5">Eligibility</p>
          <p className="text-body-sm text-on-surface-variant">{internship.eligibility}</p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-0.5">How to Apply</p>
          <p className="text-body-sm text-on-surface-variant">{internship.applyDetails}</p>
        </div>

        <Button fullWidth disabled={applied || busy} onClick={() => onApply(internship.id)} className="!py-md">
          {applied ? "Application Submitted" : "Apply Now"}
        </Button>
      </div>
    </Modal>
  );
}
