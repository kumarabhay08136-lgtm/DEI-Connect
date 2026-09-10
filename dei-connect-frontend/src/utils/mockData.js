// -----------------------------------------------------------------------
// Seed data for the frontend-only demo features (Feed, Groups, Internships,
// Notifications, Messages, Help). Every service module reads/writes these
// shapes to/from localStorage so the UI has something to render on first
// load. Swap the service functions for real API calls once the backend
// exists — the shapes here already match what those endpoints should return.
// -----------------------------------------------------------------------

export const CURRENT_USER_ID = "me";

export const MOCK_USERS = [
  { id: "u1", name: "Vikram Mehta", role: "Student", bio: "Final year Telecom Engineering • Robotics enthusiast", department: "Telecom Engineering" },
  { id: "u2", name: "Priya Nair", role: "Student", bio: "B.Sc Science, Sem 8 • Loves astrophysics and outreach", department: "Science" },
  { id: "u3", name: "Dr. Rajesh Kumar", role: "Faculty", bio: "Professor, Telecom Engineering • Wireless Communication researcher", department: "Telecom Engineering" },
  { id: "u4", name: "Ananya Sharma", role: "Student", bio: "B.Voc Telecom • Fiber optics and networking", department: "Telecom Engineering" },
  { id: "u5", name: "Arjun Rao", role: "Alumni", bio: "DEI '21 • Software Engineer at a fintech startup", department: "Computer Science" },
  { id: "u6", name: "Meera Iyer", role: "Student", bio: "Robotics & AI Club lead • Loves hackathons", department: "Computer Science" },
  { id: "u7", name: "Kabir Singh", role: "Alumni", bio: "DEI '19 • Product Manager, enjoys mentoring juniors", department: "Electronics" },
  { id: "u8", name: "Sunita Rao", role: "Faculty", bio: "Associate Professor, Career Services • Placement coordinator", department: "Career Services" },
  { id: "u9", name: "Rohan Das", role: "Student", bio: "Science undergrad • Journal club organizer", department: "Science" },
  { id: "u10", name: "Neha Verma", role: "Student", bio: "Electronics Engineering • Circuit design hobbyist", department: "Electronics" },
];

export const GROUP_CATEGORIES = [
  "Academics",
  "Technology",
  "Career",
  "Sports",
  "Arts & Culture",
  "Alumni",
];

export const MOCK_GROUPS = [
  {
    id: "g1",
    name: "Telecom Engineering Hub",
    description: "A space for telecom students and alumni to share projects, internships, and lab resources.",
    category: "Academics",
    tags: ["Telecom", "Networking"],
    creatorId: "u3",
    members: ["u3", "u1", "u4", CURRENT_USER_ID],
  },
  {
    id: "g2",
    name: "Robotics & AI Club",
    description: "Interdisciplinary group building robotics and AI projects across departments.",
    category: "Technology",
    tags: ["AI", "Robotics"],
    creatorId: "u6",
    members: ["u6", "u5", "u9"],
  },
  {
    id: "g3",
    name: "DEI Alumni Network",
    description: "Connect with successful graduates for mentorship, referrals, and career guidance.",
    category: "Alumni",
    tags: ["Mentorship", "Careers"],
    creatorId: "u7",
    members: ["u7", "u5", "u8"],
  },
];

export const MOCK_GROUP_MESSAGES = {
  g1: [
    { id: 1, senderId: "u3", text: "Reminder: lab report submissions close Friday.", time: "9:00 AM" },
    { id: 2, senderId: "u1", text: "Got it, thank you sir!", time: "9:05 AM" },
  ],
  g2: [{ id: 1, senderId: "u6", text: "Team meeting shifted to 5 PM today.", time: "2:00 PM" }],
  g3: [{ id: 1, senderId: "u7", text: "New mentorship applications are open!", time: "Yesterday" }],
};

export const COMMUNITY_CATEGORIES = [
  "Academics",
  "Technology",
  "Career",
  "Sports",
  "Arts & Culture",
  "Alumni",
  "Wellness",
];

export const MOCK_COMMUNITIES = [
  {
    id: "c1",
    name: "Telecom Engineering Hub",
    description: "A space for telecom students and alumni to share projects, internships, and lab resources.",
    category: "Academics",
    banner: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    icon: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    creatorId: "u3",
    members: ["u3", "u1", "u4"],
  },
  {
    id: "c2",
    name: "Robotics & AI Club",
    description: "Interdisciplinary group building robotics and AI projects across departments.",
    category: "Technology",
    banner: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    icon: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    creatorId: "u6",
    members: ["u6", "u5", "u9"],
  },
  {
    id: "c3",
    name: "DEI Alumni Network",
    description: "Connect with successful graduates for mentorship, referrals, and career guidance.",
    category: "Alumni",
    banner: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1974&auto=format&fit=crop",
    icon: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1974&auto=format&fit=crop",
    creatorId: "u7",
    members: ["u7", "u5", "u8"],
  },
  {
    id: "c4",
    name: "Science Society",
    description: "Weekly research talks, journal clubs and lab collaboration for science undergrads.",
    category: "Academics",
    banner: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1974&auto=format&fit=crop",
    icon: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1974&auto=format&fit=crop",
    creatorId: "u9",
    members: ["u9", "u10"],
  },
];

export const MOCK_INTERNSHIPS = [
  {
    id: "i1",
    title: "Summer Research Intern — Wireless Networks",
    organization: "DEI Telecom Research Lab",
    description: "Work alongside faculty on 5G signal propagation experiments and help prepare a publication.",
    skills: ["MATLAB", "Signal Processing", "Python"],
    duration: "8 weeks",
    location: "On-campus",
    remote: false,
    eligibility: "3rd/4th year Telecom or Electronics students",
    applyDetails: "Email a short CV and statement of interest to the posted contact.",
    postedBy: "u3",
    postedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: "i2",
    title: "Frontend Development Intern",
    organization: "Kabir Singh (Alumni Mentorship Program)",
    description: "Help build internal tools for a fintech startup; great exposure to production React codebases.",
    skills: ["React", "JavaScript", "CSS"],
    duration: "3 months",
    location: "Remote",
    remote: true,
    eligibility: "Any student with basic web development experience",
    applyDetails: "Apply with your GitHub profile and a short introduction.",
    postedBy: "u7",
    postedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: "i3",
    title: "Career Services Outreach Assistant",
    organization: "DEI Career Services",
    description: "Support the placement cell with alumni outreach, event coordination and resource creation.",
    skills: ["Communication", "Excel", "Event Planning"],
    duration: "1 semester",
    location: "On-campus",
    remote: false,
    eligibility: "Open to all departments, sophomore year and above",
    applyDetails: "Drop by the Career Services office or apply through this listing.",
    postedBy: "u8",
    postedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
  },
];

export const MOCK_NOTIFICATIONS = [
  { id: "n1", type: "follow", actorId: "u1", message: "started following you.", time: Date.now() - 30 * 60 * 1000, read: false },
  { id: "n2", type: "like", actorId: "u4", message: "liked your post.", time: Date.now() - 2 * 60 * 60 * 1000, read: false },
  { id: "n3", type: "group_invite", actorId: "u6", message: "invited you to join Robotics & AI Club.", time: Date.now() - 5 * 60 * 60 * 1000, read: true },
  { id: "n4", type: "mention", actorId: "u3", message: "mentioned you in a comment.", time: Date.now() - 26 * 60 * 60 * 1000, read: true },
];

export const MOCK_MESSAGES = [
  {
    id: "m1",
    fromId: "u3",
    toId: CURRENT_USER_ID,
    subject: "Curriculum feedback needed",
    body: "Hi, could you please review the updated Semester 4 curriculum and share your feedback by Friday?",
    time: Date.now() - 4 * 60 * 60 * 1000,
    read: false,
    folder: "inbox",
  },
  {
    id: "m2",
    fromId: "u7",
    toId: CURRENT_USER_ID,
    subject: "Mentorship opportunity",
    body: "I'd love to mentor a few juniors interested in product management. Let me know if you're interested!",
    time: Date.now() - 30 * 60 * 60 * 1000,
    read: true,
    folder: "inbox",
  },
];

export function getUserById(id) {
  return MOCK_USERS.find((u) => u.id === id) || null;
}

export const MOCK_HELP_MESSAGES = [
  {
    id: "h1",
    sender: "support",
    text: "Hi! Welcome to DEI Connect Support. How can we help you today?",
    time: Date.now() - 60 * 60 * 1000,
  },
];
