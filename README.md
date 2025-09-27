# MAD_PROJECT

1. **Project Title:**
   📱 Productivity App – All-in-One Notes, Tasks, and Weather Dashboard

2. **Your Name & Roll Number:**
   Nanduri Sai Sundara Gourav – 2024-B-03072007

3. **Problem Statement:**
   "In today's fast-paced world, users often juggle multiple tools to manage tasks, take notes, check weather updates, and stay organized. Constantly switching between apps leads to inefficiency and distraction. This project aims to centralize essential productivity tools into a single, user-friendly mobile application."

4. **Proposed Solution / Idea:**
   "A cross-platform React Native mobile application that combines task management, note-taking, real-time weather updates, and user profile features. The app includes light/dark theme support, persistent storage, and customizable settings. It is designed to be simple, modular, and efficient for everyday productivity needs."

5. **Key Features:**

   - 📝 To-Do List with task creation, deletion, and completion tracking  
   - 📒 Notes section with persistent storage (AsyncStorage)  
   - 🌤️ Live Weather Dashboard using OpenWeather API  
   - 👤 Login and Profile management (stored locally)  
   - 🎨 Theme toggle (light/dark mode) using Context API  
   - 🔒 Persistent login state using AsyncStorage  
   - 🔀 Seamless navigation using React Navigation (Tab + Stack)  
   - ♻️ Reusable UI components for cleaner, maintainable code  

6. **Target Users / Audience:**
   "Students, working professionals, and anyone who needs a lightweight but powerful productivity app to manage daily tasks, notes, and essential info like weather — all in one place."

7. **Technology Stack:**

   - **Frontend (Mobile App):** React Native, Expo  
   - **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)  
   - **Navigation:** React Navigation  
   - **API Integration:** OpenWeather API (for live weather updates)  
   - **Local Storage:** AsyncStorage  
   - **Global State:** Context API  
   - **UI Components:** Custom reusable components (Buttons, Cards, Inputs)  
   - **Styling:** React Native Stylesheets, Flexbox layout

8. **Expected Outcome:**
   "A fully functional mobile application that helps users stay productive by consolidating essential tools into one intuitive interface. The app will offer smooth navigation, modern design, persistent data, and useful real-time features — ready to be used or extended in real-world scenarios."

9. **Timeline:**

   - ✅ **Week 1:**  
     - Project setup using Expo  
     - Create navigation structure (Tab + Stack)  
     - Build To-Do List screen with state and reusable components  

   - ✅ **Week 2:**  
     - Integrate Weather API using `fetch` + `useEffect`  
     - Build Notes screen with AsyncStorage persistence  
     - Add reusable UI components for cards, inputs, buttons  

   - ✅ **Week 3:**  
     - Implement Login & Profile screen  
     - Use Context API for authentication state  
     - Persist login using AsyncStorage  
     - Setup protected routes/screens  

   - ✅ **Week 4:**  
     - Add Theme toggle using Context API  
     - Polish UI and fix layout issues  
     - Refactor and clean up codebase  
     - Test on multiple devices  
     - Finalize and prepare for deployment  

10. **Additional Notes:**

   - App is designed to run entirely offline (except Weather API)  
   - Can be extended to include calendar sync, reminders, or cloud backup  
   - Focus is on clean architecture, modular components, and scalability  
   - All features developed using open-source technologies  

