# 🎓 Student Planner SaaS

A beginner-friendly student productivity dashboard built with **HTML, CSS, and vanilla JavaScript**. Organize your tasks, timetable, assignments, exams, and goals in one place.

## ✨ Features

- **Task management:** add, edit, delete, and mark tasks complete.
- **Study timetable:** add or remove study sessions.
- **Assignment tracker:** add assignment deadlines and priority levels, and mark assignments complete.
- **Exam reminders:** record exam dates and see how many days remain.
- **Progress dashboard:** see completed tasks and your overall completion percentage.
- **Goals:** create, complete, and delete study goals.
- **Browser storage:** planner data is saved with `localStorage`.
- **Responsive layout:** designed for desktop, tablet, and mobile.
- **No build tools required:** plain HTML, CSS, and JavaScript.

## 📁 Project structure

```text
student-planner-saas/
├── index.html
├── README.md
├── css/
│   └── styles.css
└── js/
    └── app.js
```

## 🚀 Run locally

1. Download or clone this repository.
2. Open the `student-planner-saas` folder.
3. Double-click `index.html` to open it in your browser.

For a smoother development experience, you can open the folder in Visual Studio Code and use the **Live Server** extension. No package installation is needed.

## 🌐 Publish with GitHub Pages

1. Sign in to GitHub and create a new **public** repository named `student-planner-saas`.
2. Upload `index.html`, `README.md`, and the `css` and `js` folders. Keep the folder structure unchanged.
3. Open the repository's **Settings**.
4. Select **Pages** from the sidebar.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`, then click **Save**.
7. Wait for GitHub Pages to publish the site. The URL will look like:

   `https://YOUR-USERNAME.github.io/student-planner-saas/`

Replace `YOUR-USERNAME` with your GitHub username. GitHub displays the published URL in Settings → Pages.

## 💾 How data is saved

Tasks, timetable entries, assignments, exams, and goals are stored in your browser using `localStorage`. Data normally remains available in the same browser on the same device. It does **not** automatically sync across devices or accounts. Clearing browser site data can remove it.

## 🧠 Beginner learning goals

- Semantic HTML and accessible form labels
- CSS Grid, Flexbox, responsive design, and reusable styles
- JavaScript events, arrays, objects, and rendering UI
- Form validation and safe text rendering
- Browser `localStorage`
- Publishing a static site using GitHub Pages

## 🔧 Ideas for future improvements

- User login and cloud database
- Notifications and calendar integration
- Weekly timetable view
- Search and filters
- Export tasks to CSV
- Dark mode

> **Note:** This is a front-end student project, not a production SaaS platform. Real user accounts, cloud synchronization, and server-based reminders require a backend and appropriate security.

## 📜 License

You may use, modify, and learn from this project for educational purposes.
