# Trending Posts & Blogs Platform

A modern and responsive web application that showcases trending posts and blogs based on engagement metrics such as likes and comments.

## 🚀 Features

- 🔥 **Trending Posts & Blogs** - Displays the most engaging content based on likes and comments.
- 📌 **User Authentication** - Supports authentication for personalized experience.
- 💬 **Commenting System** - Users can interact with posts and blogs via comments.
- ❤️ **Like System** - Allows users to like posts and blogs.
- 🏷️ **Profile System** - Displays author information with profile avatars.
- 🎨 **Modern UI/UX** - Clean and responsive UI built with React and Tailwind CSS.
- 🗂️ **Redux Store Management** - Efficient state management using Redux.

## 🛠️ Tech Stack

- **Frontend:** React.js, Redux, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Firebase/Auth (or JWT based auth)
- **Real-time Updates:** WebSockets (Optional)

## 📦 Installation

### Clone the Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### Install Dependencies
```bash
npm install
```

### Setup Environment Variables
Create a `.env` file in the root directory and add the following:
```
REACT_APP_API_URL=your_backend_api_url
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

### Run the Development Server
```bash
npm start
```

## 🏗️ Project Structure
```
📂 src
 ┣ 📂 components
 ┃ ┣ 📜 Avatar.jsx
 ┃ ┣ 📜 RightSidebar.jsx
 ┃ ┣ 📜 CommentDialog.jsx
 ┃ ┗ 📜 BlogCommentDialog.jsx
 ┣ 📂 pages
 ┃ ┗ 📜 Trending.jsx
 ┣ 📂 redux
 ┃ ┣ 📜 postSlice.js
 ┃ ┗ 📜 authSlice.js
 ┣ 📂 assets
 ┣ 📜 App.js
 ┣ 📜 index.js
 ┗ 📜 store.js
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Example)
```bash
vercel deploy
```

## 🐛 Troubleshooting

### Common Errors & Fixes
- **TypeError: Cannot read properties of null (reading 'likes')**
  - Ensure the `blog` object is not null before accessing its properties.
  - Use optional chaining (`blog?.likes?.length || 0`).

## 📌 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request.

## 📄 License
This project is licensed under me, Please contact me befor use.

---

🌟 **If you like this project, give it a star on GitHub!** ⭐

