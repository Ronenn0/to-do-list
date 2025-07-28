# 📝 To-Do List App

A clean, interactive, and responsive To-Do List web app that allows users to add, complete, activate, delete, and filter their tasks. Tasks persist using the browser's `localStorage`.

## 🚀 Features

- ✅ Add new tasks
- 🔁 Toggle task completion status
- 🗑️ Delete tasks
- 🧠 Filters:
  - **All** tasks
  - **Activated** (incomplete) tasks
  - **Completed** tasks
- 💾 Persistent storage using `localStorage`
- 💡 Live updates with no page reload
- 📱 Fully responsive design

## 🧱 Technologies Used

- **HTML5** – Semantic layout
- **CSS3** – Responsive design with custom properties (CSS variables)
- **JavaScript (ES6)** – OOP with class-based logic and DOM manipulation
- **localStorage** – Data persistence in the browser

## 📂 Project Structure

```
📁 your-project/
├── index.html       # Main HTML structure
├── style.css        # Styling and responsive layout
└── script.js        # App logic and functionality
```

## 🧠 How It Works

1. The user adds a task via the input field and submits the form.
2. The task is added to an in-memory array and stored in `localStorage`.
3. Tasks are displayed with buttons to complete, activate, or delete.
4. Filter buttons change the visible task set based on completion status.
5. All changes update both the UI and `localStorage`.

## 🖥️ Live Preview

To run locally:
1. Clone or download this repo.
2. Open `index.html` in a browser.

No server needed — it's 100% front-end.

## 📸 Screenshot

![To-Do App UI](preview.png) <!-- Optional: Add a screenshot here if available -->

## ✍️ Author

**Ronen Azam**  
Built as a clean and modern web development project with an OOP-based JavaScript approach.

---

> Built with ❤️ to stay organized and productive.
