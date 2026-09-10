// Populates the database with the same cast of demo users/content the
// frontend used to ship as localStorage mock data, so the app isn't an
// empty shell the first time it's demoed.
//
// Usage:
//   npm run seed            seed the database
//   npm run seed:destroy    wipe every collection this script touches
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";

import User from "../src/models/User.js";
import Post from "../src/models/Post.js";
import Group from "../src/models/Group.js";
import Community from "../src/models/Community.js";
import Internship from "../src/models/Internship.js";
import Follow from "../src/models/Follow.js";

const DEMO_PASSWORD = "Password123!";

const PEOPLE = [
  { name: "Demo Student", email: "demo@dei.edu", role: "Student", department: "Telecom Engineering", bio: "B.Voc Telecom Engineering • Semester 4", tagline: "B.Voc Telecom Engineering • Semester 4" },
  { name: "Vikram Mehta", email: "vikram.mehta@dei.edu", role: "Student", department: "Telecom Engineering", bio: "Final year Telecom Engineering • Robotics enthusiast" },
  { name: "Priya Nair", email: "priya.nair@dei.edu", role: "Student", department: "Science", bio: "B.Sc Science, Sem 8 • Loves astrophysics and outreach" },
  { name: "Dr. Rajesh Kumar", email: "rajesh.kumar@dei.edu", role: "Faculty", department: "Telecom Engineering", bio: "Professor, Telecom Engineering • Wireless Communication researcher" },
  { name: "Ananya Sharma", email: "ananya.sharma@dei.edu", role: "Student", department: "Telecom Engineering", bio: "B.Voc Telecom • Fiber optics and networking" },
  { name: "Arjun Rao", email: "arjun.rao@dei.edu", role: "Alumni", department: "Computer Science", bio: "DEI '21 • Software Engineer at a fintech startup" },
  { name: "Meera Iyer", email: "meera.iyer@dei.edu", role: "Student", department: "Computer Science", bio: "Robotics & AI Club lead • Loves hackathons" },
  { name: "Kabir Singh", email: "kabir.singh@dei.edu", role: "Alumni", department: "Electronics", bio: "DEI '19 • Product Manager, enjoys mentoring juniors" },
  { name: "Sunita Rao", email: "sunita.rao@dei.edu", role: "Faculty", department: "Career Services", bio: "Associate Professor, Career Services • Placement coordinator" },
  { name: "Rohan Das", email: "rohan.das@dei.edu", role: "Student", department: "Science", bio: "Science undergrad • Journal club organizer" },
  { name: "Neha Verma", email: "neha.verma@dei.edu", role: "Student", department: "Electronics", bio: "Electronics Engineering • Circuit design hobbyist" },
];

async function destroy() {
  await Promise.all([
    User.deleteMany({ email: { $regex: "@dei\\.edu$" } }),
    Post.deleteMany({}),
    Group.deleteMany({}),
    Community.deleteMany({}),
    Internship.deleteMany({}),
    Follow.deleteMany({}),
  ]);
  console.log("Demo data removed.");
}

async function seed() {
  const users = {};
  for (const person of PEOPLE) {
    const existing = await User.findOne({ email: person.email });
    users[person.name] = existing || (await User.create({ ...person, password: DEMO_PASSWORD }));
  }

  const byName = (name) => users[name];

  await Follow.updateOne(
    { follower: byName("Demo Student")._id, following: byName("Dr. Rajesh Kumar")._id },
    { $setOnInsert: { follower: byName("Demo Student")._id, following: byName("Dr. Rajesh Kumar")._id } },
    { upsert: true }
  );

  if ((await Post.countDocuments()) === 0) {
    await Post.create([
      {
        author: byName("Dr. Rajesh Kumar")._id,
        content:
          "Please find the updated curriculum for the Advanced Wireless Communication module (Semester 4). Note the change in Laboratory sessions scheduled for next Tuesday.",
        official: true,
        verified: true,
      },
      {
        author: byName("Ananya Sharma")._id,
        content:
          "Captured this during the Fiber Optics workshop today! The transition from theory to hands-on fusion splicing was amazing.",
      },
      {
        author: byName("Priya Nair")._id,
        content:
          "Our robotics team just wrapped up the interdisciplinary showcase — huge thanks to everyone from CS and Electronics who collaborated with us!",
      },
    ]);
  }

  if ((await Group.countDocuments()) === 0) {
    await Group.create([
      {
        name: "Telecom Engineering Hub",
        description: "A space for telecom students and alumni to share projects, internships, and lab resources.",
        category: "Academics",
        tags: ["Telecom", "Networking"],
        creator: byName("Dr. Rajesh Kumar")._id,
        members: [byName("Dr. Rajesh Kumar")._id, byName("Vikram Mehta")._id, byName("Ananya Sharma")._id, byName("Demo Student")._id],
      },
      {
        name: "Robotics & AI Club",
        description: "Interdisciplinary group building robotics and AI projects across departments.",
        category: "Technology",
        tags: ["AI", "Robotics"],
        creator: byName("Meera Iyer")._id,
        members: [byName("Meera Iyer")._id, byName("Arjun Rao")._id, byName("Rohan Das")._id],
      },
      {
        name: "DEI Alumni Network",
        description: "Connect with successful graduates for mentorship, referrals, and career guidance.",
        category: "Alumni",
        tags: ["Mentorship", "Careers"],
        creator: byName("Kabir Singh")._id,
        members: [byName("Kabir Singh")._id, byName("Arjun Rao")._id, byName("Sunita Rao")._id],
      },
    ]);
  }

  if ((await Community.countDocuments()) === 0) {
    await Community.create([
      {
        name: "Telecom Engineering Hub",
        description: "A space for telecom students and alumni to share projects, internships, and lab resources.",
        category: "Academics",
        banner: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
        icon: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
        creator: byName("Dr. Rajesh Kumar")._id,
        members: [byName("Dr. Rajesh Kumar")._id, byName("Vikram Mehta")._id, byName("Ananya Sharma")._id],
      },
      {
        name: "Robotics & AI Club",
        description: "Interdisciplinary group building robotics and AI projects across departments.",
        category: "Technology",
        banner: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
        icon: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
        creator: byName("Meera Iyer")._id,
        members: [byName("Meera Iyer")._id, byName("Arjun Rao")._id, byName("Rohan Das")._id],
      },
      {
        name: "DEI Alumni Network",
        description: "Connect with successful graduates for mentorship, referrals, and career guidance.",
        category: "Alumni",
        banner: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1974&auto=format&fit=crop",
        icon: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1974&auto=format&fit=crop",
        creator: byName("Kabir Singh")._id,
        members: [byName("Kabir Singh")._id, byName("Arjun Rao")._id, byName("Sunita Rao")._id],
      },
      {
        name: "Science Society",
        description: "Weekly research talks, journal clubs and lab collaboration for science undergrads.",
        category: "Academics",
        banner: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1974&auto=format&fit=crop",
        icon: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1974&auto=format&fit=crop",
        creator: byName("Rohan Das")._id,
        members: [byName("Rohan Das")._id, byName("Neha Verma")._id],
      },
    ]);
  }

  if ((await Internship.countDocuments()) === 0) {
    await Internship.create([
      {
        title: "Summer Research Intern — Wireless Networks",
        organization: "DEI Telecom Research Lab",
        description: "Work alongside faculty on 5G signal propagation experiments and help prepare a publication.",
        skills: ["MATLAB", "Signal Processing", "Python"],
        duration: "8 weeks",
        location: "On-campus",
        remote: false,
        eligibility: "3rd/4th year Telecom or Electronics students",
        applyDetails: "Email a short CV and statement of interest to the posted contact.",
        postedBy: byName("Dr. Rajesh Kumar")._id,
      },
      {
        title: "Frontend Development Intern",
        organization: "Kabir Singh (Alumni Mentorship Program)",
        description: "Help build internal tools for a fintech startup; great exposure to production React codebases.",
        skills: ["React", "JavaScript", "CSS"],
        duration: "3 months",
        location: "Remote",
        remote: true,
        eligibility: "Any student with basic web development experience",
        applyDetails: "Apply with your GitHub profile and a short introduction.",
        postedBy: byName("Kabir Singh")._id,
      },
      {
        title: "Career Services Outreach Assistant",
        organization: "DEI Career Services",
        description: "Support the placement cell with alumni outreach, event coordination and resource creation.",
        skills: ["Communication", "Excel", "Event Planning"],
        duration: "1 semester",
        location: "On-campus",
        remote: false,
        eligibility: "Open to all departments, sophomore year and above",
        applyDetails: "Drop by the Career Services office or apply through this listing.",
        postedBy: byName("Sunita Rao")._id,
      },
    ]);
  }

  console.log("\nSeed complete. Demo accounts (all share one password):");
  console.log(`  password: ${DEMO_PASSWORD}\n`);
  PEOPLE.forEach((p) => console.log(`  ${p.email.padEnd(28)} ${p.role}`));
  console.log("\nLog in as demo@dei.edu to explore the app as the primary demo account.");
}

async function run() {
  await connectDB();
  if (process.argv.includes("--destroy")) {
    await destroy();
  } else {
    await seed();
  }
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
