# Voice2Sign 🤟🤖

Voice2Sign is an advanced, AI-powered **Android & Web application** designed to bridge the communication gap between hearing and deaf individuals. It real-time translates spoken English into **Indian Sign Language (ISL)** using a library of professional GIFs and finger-spelled alphabets.

## ✨ Features
- **Real-time Voice Recognition**: Tap to speak and see instant sign language translation.
- **Smart Phrase Matching**: Recognizes 90+ common ISL phrases (e.g., "Good morning", "What is your name?").
- **Dynamic Finger Spelling**: If a specific word isn't in the library, the app automatically spells it out letter-by-letter (A-Z).
- **Premium UI/UX**: Built with React and Framer Motion for a smooth, glassmorphism-inspired experience.
- **Cross-Platform**: Optimized for both Android (Native App) and modern Web browsers.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Android Studio](https://developer.android.com/studio) (for Android App)

### 1. Installation
In the project root folder, run:
```bash
npm install
```

### 2. Run Locally (Web)
For fast testing in your browser:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in **Chrome** or **Edge**.

### 3. Run on Android Mobile
To install the app on your physical device:
1. Build the project:
   ```bash
   npm run build
   ```
2. Sync with Android:
   ```bash
   npx cap sync
   ```
3. Open in Android Studio:
   ```bash
   npx cap open android
   ```
4. Connect your phone via USB and click the **Run (Play)** button in Android Studio.

---

## 📂 Project Structure
- `/public/ISL_Gifs/`: Library of pre-recorded sign language GIFs.
- `/public/letters/`: Alphabet sign language images (A-Z).
- `/src/App.jsx`: Core translation logic and UI.
- `/android/`: Native Android project files (Capacitor wrapper).

---

## 🛠 Adding Further Signs (Suggestions)

To make your project even more powerful, you can expand it by adding more signs:

### 1. Adding New GIF Phrases
- **Step 1**: Find or record a GIF of the new sign.
- **Step 2**: Name the GIF exactly what the word/phrase is (e.g., `thank you.gif`).
- **Step 3**: Place it in `public/ISL_Gifs/`.
- **Step 4**: Open `src/App.jsx` and add the filename (without extension) to the `KNOWN_GIFS` array.

### 2. Integrating a Cloud Database
Instead of pre-loading all GIFs, you could move them to **Firebase Storage**. This will make your app size smaller and allow you to add new signs without updating the app on people's phones.

### 3. Deep Learning Integration
Currently, it uses a lookup system. Future updates could use a **pose-estimation model** (like MediaPipe) to generate 3D avatar animations automatically for any word, removing the need for GIFs entirely.

### 4. Categorization
Add categories like "Greetings", "Medical", "Emergency", and "Education" so users can manually browse signs if they don't want to use voice.

### 5. Multi-Language Support
Update the React code to support Hindi or regional language speech recognition using:
```javascript
recognition.lang = 'hi-IN'; // For Hindi
```

---

## 📜 License
This project is for educational and accessibility purposes.
