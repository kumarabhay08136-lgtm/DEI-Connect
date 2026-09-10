# 🎓 DEI Connect

### One Campus • One Community • One Platform

> A unified digital platform designed to connect students, faculty, resources, opportunities, and campus communities in one place.

---

## 📌 About The Project

**DEI Connect** is a full-stack MERN web application developed to create a centralized digital ecosystem for students and faculty of **Dayalbagh Educational Institute (DEI)**.

The platform brings important campus activities such as communication, educational resources, communities, groups, internships, posts, and notifications together in one place.

The goal of DEI Connect is to make the digital campus experience **simpler, more organized, accessible, and connected**.

---

# 💡 Why I Built DEI Connect

In a college environment, important information is often distributed across different platforms such as messaging groups, notice boards, websites, personal messages, and social media.

Because of this, students may sometimes miss important information such as:

* Important campus announcements
* Study materials and educational resources
* Internship opportunities
* Events and activities
* Messages and updates
* Useful communities and groups

Faculty members can also face difficulties when information needs to be shared with a large number of students through different communication channels.

### The idea behind DEI Connect is simple:

**Instead of using multiple disconnected platforms, provide one centralized digital platform for the campus community.**

DEI Connect aims to bring students, faculty, resources, opportunities, and communities together in one connected environment.

---

# 🎯 Problem Statement

Traditional campus communication can become fragmented.

Students and teachers may have to depend on multiple platforms for:

* Communication
* Announcements
* Resources
* Internships
* Groups
* Communities
* Campus updates

This can make information difficult to find and can increase the chances of missing important updates.

### DEI Connect addresses this problem by providing a centralized platform where these activities can be organized and accessed from one place.

---

# 💡 Our Solution

DEI Connect combines different campus-related activities into one digital ecosystem.

### Discover → Connect → Communicate → Collaborate

Students can discover resources and opportunities, connect with other members, communicate through groups and messaging, and collaborate within campus communities.

Faculty members can share information, communicate with students, and contribute to the academic and campus community through the same platform.

---

# 👨‍🎓 Benefits For Students

## 📚 Educational Resources

Students can access useful educational resources from a centralized location instead of searching through multiple groups or conversations.

## 💼 Internship Opportunities

A dedicated internship section helps students discover internship and career opportunities more easily.

## 📰 Campus Feed

Students can view posts, updates, announcements, and useful information through a centralized campus feed.

## 💬 Communication

Students can communicate with other members of the campus community using messaging and group features.

## 👥 Groups & Communities

Students can participate in different groups and communities based on their interests, departments, activities, or areas of study.

## 🔔 Notifications

Important updates can be delivered through notifications, helping students stay informed.

## 👤 Personal Profiles

Students can create and manage their profiles to represent their presence within the campus community.

---

# 👨‍🏫 Benefits For Teachers & Faculty

## 📢 Centralized Information Sharing

Faculty members can share important information and updates through one centralized platform.

## 📚 Resource Sharing

Teachers can provide students with educational resources and useful learning material digitally.

## 👥 Better Student Interaction

Groups and communities provide an organized environment for interaction between students and faculty.

## 🔔 Important Updates

Academic and campus-related information can be communicated more efficiently.

## 🌐 One Common Platform

Faculty and students can use the same digital environment instead of depending completely on multiple disconnected communication channels.

---

# 🏫 Before vs After DEI Connect

| Traditional Approach                         | With DEI Connect             |
| -------------------------------------------- | ---------------------------- |
| Information spread across multiple platforms | Centralized campus platform  |
| Resources shared in different groups         | Organized resource section   |
| Internship opportunities can get buried      | Dedicated internship section |
| Multiple communication channels              | Unified communication        |
| Difficult to discover communities            | Groups & communities         |
| Important updates can be missed              | Feed & notifications         |
| Students use different sources               | One connected platform       |

---

# ✨ Key Features

* 🔐 User Registration & Authentication
* 👤 Student & Faculty Profiles
* 📰 Campus Feed
* 📝 Posts
* ❤️ Likes
* 💬 Comments
* 💬 Chat & Messaging
* 👥 Groups
* 🌐 Communities
* 📚 Educational Resources
* 💼 Internship Opportunities
* 🔔 Notifications
* 📢 Campus Updates
* 📱 Responsive User Interface

---

# 🛠️ Technology Stack

## Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Responsive Web Design

## Backend

* Node.js
* Express.js
* REST APIs

## Database

* MongoDB
* Mongoose

## Development Tools

* Git
* GitHub
* VS Code
* MongoDB Atlas

---

# 🚀 How To Use

Follow the steps below to run **DEI Connect** on your local computer.

## 1. Download the Project

Download the project ZIP file from the GitHub repository and extract/unzip it on your computer.

Then open the extracted project folder in **VS Code**.

---

# 💻 Terminal Commands

## 🖥️ Frontend

Open the VS Code terminal and go to the frontend folder:

```bash
cd dei-connect-frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The frontend will start in development mode.

---

## ⚙️ Backend

Open another terminal in VS Code and go to the backend folder:

```bash
cd dei-connect-backend
```

### Install Dependencies

```bash
npm install
```

### Start Backend Server

```bash
npm run dev
```

The backend server will start in development mode.

> **Note:** Folder names and available `npm` commands depend on the project structure and `package.json` files.

---

# 🔧 Useful Git Commands

### Check Project Status

```bash
git status
```

### Add All Changes

```bash
git add .
```

### Create a Commit

```bash
git commit -m "Update project"
```

### Push Changes to GitHub

```bash
git push
```

### Pull Latest Changes

```bash
git pull
```

---

# 🏗️ Application Architecture

DEI Connect follows a **MERN Stack architecture**.

```text
                         DEI CONNECT
                              │
                              ▼
                    ┌──────────────────┐
                    │     React.js     │
                    │     Frontend     │
                    └────────┬─────────┘
                             │
                         REST APIs
                             │
                             ▼
                    ┌──────────────────┐
                    │ Node.js + Express│
                    │      Backend     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     MongoDB      │
                    │     Database     │
                    └──────────────────┘
```

### Architecture Flow

**React.js → REST APIs → Node.js/Express.js → MongoDB**

The frontend communicates with the backend through REST APIs. The backend handles application logic and communicates with MongoDB for storing and retrieving data.

---

# 📂 Project Structure

```text
DEI-Connect/
│
├── dei-connect-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── dei-connect-backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore
```

---

# 🎯 Project Goal

The main goal of **DEI Connect** is to create a centralized campus platform that makes communication, collaboration, resource sharing, and internship discovery easier for students and faculty.

---

# 🔮 Future Improvements

* Real-time chat using Socket.IO
* Advanced notification system
* Admin dashboard
* Better search and filtering
* Online event management
* Improved mobile experience
* More campus services and integrations

---

# 👨‍💻 Developer

**Abhay Kumar**

B.Voc Telecom & Software
**Dayalbagh Educational Institute**

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ **Star** on GitHub.

---

Project image 
<img width="1917" height="922" alt="Screenshot 2026-09-10 130544" src="https://github.com/user-attachments/assets/2ec0d463-c28d-4024-876a-d9be28417e59" />
<img width="1901" height="972" alt="Screenshot 2026-09-10 130616" src="https://github.com/user-attachments/assets/20387d2b-a2f2-49ca-a598-a033d5a29029" />
<img width="1912" height="917" alt="Screenshot 2026-09-10 130729" src="https://github.com/user-attachments/assets/51734326-fc54-43eb-bfae-c98cecbfdacd" />
<img width="1917" height="912" alt="Screenshot 2026-09-10 130739" src="https://github.com/user-attachments/assets/cc6828b0-b40a-4880-b3ee-c4b21c2ad144" />
<img width="1917" height="916" alt="Screenshot 2026-09-09 200333" src="https://github.com/user-attachments/assets/bafd3af3-c284-411a-8a48-e76415ae1558" />
<img width="1917" height="918" alt="Screenshot 2026-09-09 200352" src="https://github.com/user-attachments/assets/161f963e-b096-4ff9-ae54-c3adda1abf98" />
<img width="1917" height="918" alt="Screenshot 2026-09-09 200455" src="https://github.com/user-attachments/assets/dd3c99dc-717d-4082-a74a-ce2fa38584da" />
<img width="1917" height="913" alt="Screenshot 2026-09-09 200527" src="https://github.com/user-attachments/assets/f0107562-1f37-49b6-a1e0-6322c600453f" />
<img width="1915" height="915" alt="Screenshot 2026-09-09 200624" src="https://github.com/user-attachments/assets/d9dfa0cf-bf48-4943-b459-66563f0ac543" />
<img width="1916" height="908" alt="Screenshot 2026-09-09 200805" src="https://github.com/user-attachments/assets/39f09f4e-d6c4-4058-bed8-20f5ef35d38f" />
<img width="1917" height="912" alt="Screenshot 2026-09-09 200817" src="https://github.com/user-attachments/assets/c1528b8d-b2f8-4ad7-ba7a-15c349297aa0" />
<img width="1917" height="912" alt="Screenshot 2026-09-09 200827" src="https://github.com/user-attachments/assets/293b2141-4a69-4061-953e-9386f6d7ee75" />
<img width="1917" height="912" alt="Screenshot 2026-09-09 200827" src="https://github.com/user-attachments/assets/0b159d47-09e1-4428-91f9-674e39297255" />
<img width="1917" height="913" alt="Screenshot 2026-09-09 200839" src="https://github.com/user-attachments/assets/e4bcece2-ef66-4dea-9d90-a83ea2c7316f" />















