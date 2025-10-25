# AI Interview Copilot

An advanced AI-powered platform designed to help you practice for interviews, build confidence, and receive detailed feedback to land your dream job.

![AI Interview Copilot Dashboard](https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Gemini_logo_2023.png) 

---

## ✨ Key Features

-   **🤖 AI-Powered Interviews**: Get hyper-relevant questions tailored to your specific CV and the job description you're targeting. No more generic scripts!
-   **🚀 Dual Interview Modes**:
    -   **Official Mode**: Simulate a real interview process, from CV submission to a formal briefing room.
    -   **Practice Mode**: Jump into quick practice sessions or targeted skill drills (e.g., STAR Method, Clarity).
-   **📊 In-Depth Feedback**: Receive instant, actionable feedback reports after each session, including:
    -   Overall score and competency breakdown (Radar Chart).
    -   Specific "Glows" (what went well) and "Grows" (areas for improvement).
    -   Doughnut charts visualizing scores for individual feedback points.
-   **📈 Progress Tracking**: Monitor your improvement over time with a historical log of all interviews and a line chart visualizing skill progression.
-   **👔 CV & Job Description Analysis**: The AI parses your documents to extract key skills, ensuring the interview is perfectly aligned with your goals.
-   **🖥️ Immersive Interview UI**: A beautiful, distraction-free interface with a dynamic AI avatar that visualizes its state (thinking, listening, speaking).
-   **🔧 System & Device Checks**: A pre-interview wizard ensures your camera and microphone are configured correctly for a seamless experience.
-   **🎨 Light & Dark Modes**: A stunning, theme-able UI that adapts to your preference.
-   **🗓️ Schedule Management**: A calendar view to keep track of upcoming interviews and manage integrations.

---

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS (via CDN) with a custom CSS Variable system for robust theming.
-   **Charting**: Chart.js
-   **AI Integration**: (Simulated) Google Gemini API for generating questions and feedback.

---

## 📂 Project Structure

The project is organized into a modular and scalable structure:

```
.
├── components/
│   ├── charts/         # Reusable Chart.js components
│   ├── layout/         # Layout components (Sidebar, TopBar, etc.)
│   ├── screens/        # Components for each screen/view of the app
│   └── ui/             # General-purpose UI components (Buttons, Modals, etc.)
├── App.tsx             # Main app component, handles state and screen navigation
├── constants.ts        # Mock data and constants
├── index.html          # HTML entry point
├── index.tsx           # React root renderer
├── metadata.json       # Application metadata
├── types.ts            # Core TypeScript type definitions
└── README.md           # This file
```

---

## 🚀 Getting Started

This is a self-contained web application that runs directly in the browser without a build step.

### Prerequisites

-   A modern web browser (Chrome, Firefox, Safari, Edge).
-   A local web server to serve the files.

### Running Locally

1.  Clone or download the repository.
2.  Navigate to the project's root directory in your terminal.
3.  Start a simple local web server. Here are a few options:

    **Using `npx serve` (requires Node.js):**
    ```bash
    npx serve
    ```

    **Using Python 3:**
    ```bash
    python -m http.server
    ```

4.  Open your browser and navigate to the local address provided by the server (e.g., `http://localhost:3000` or `http://localhost:8000`).

---

## 📝 How It Works (User Flow)

1.  **Onboarding**: The user lands on a marketing page, signs up, and goes through a brief onboarding process.
2.  **Dashboard**: The user is directed to their main dashboard, which provides an overview of their latest score, key stats, and interview history.
3.  **Initiate Interview**:
    -   For a **Custom/Official Interview**, the user uploads their CV and a job description. The app "parses" these, verifies the extracted skills, and then proceeds.
    -   For a **Quick Practice**, the user can skip the setup and use their saved profile.
4.  **Pre-flight Checks**: The user selects an AI persona and completes a system check to ensure their hardware is working.
5.  **The Interview**: The user enters the immersive interview screen.
    -   An AI avatar asks questions, with its state (idle, speaking, thinking) visually represented.
    -   The user's video feed is shown in a draggable picture-in-picture window.
    -   Live captions display the AI's questions.
6.  **Completion**: Once the interview is finished, a completion screen is shown while the results are processed.
7.  **Feedback**: The user is navigated to a detailed feedback screen, where they can review their overall score, competency breakdown, and specific feedback on their answers.
8.  **Iteration**: The user can review their full history, track progress over time, and start new practice drills from the Practice Center to improve specific skills.
