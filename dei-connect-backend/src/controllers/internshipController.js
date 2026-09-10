import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Internship from "../models/Internship.js";

// GET /api/internships?remote=true
export const getInternships = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.remote === "true") filter.remote = true;

  const internships = await Internship.find(filter).sort({ createdAt: -1 });
  res.json(internships.map((i) => i.toJSON()));
});

// POST /api/internships
export const createInternship = asyncHandler(async (req, res) => {
  const { title, organization, description, skills, duration, location, eligibility, applyDetails } =
    req.body;

  if (!title?.trim() || !organization?.trim() || !description?.trim()) {
    throw new AppError("Title, organization and description are required.", 400);
  }

  const internship = await Internship.create({
    title: title.trim(),
    organization: organization.trim(),
    description: description.trim(),
    skills: Array.isArray(skills)
      ? skills
      : (skills || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
    duration: duration || "",
    location: location || "",
    remote: (location || "").toLowerCase() === "remote",
    eligibility: eligibility || "",
    applyDetails: applyDetails || "",
    postedBy: req.user._id,
  });

  res.status(201).json(internship.toJSON());
});

// POST /api/internships/:id/apply
export const applyToInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) throw new AppError("Internship not found.", 404);

  if (!internship.applicants.some((id) => id.equals(req.user._id))) {
    internship.applicants.push(req.user._id);
    await internship.save();
  }
  res.json({ applied: true });
});

// GET /api/internships/applied — ids the current user has applied to.
export const getAppliedInternshipIds = asyncHandler(async (req, res) => {
  const internships = await Internship.find({ applicants: req.user._id }).select("_id");
  res.json(internships.map((i) => i._id.toString()));
});
