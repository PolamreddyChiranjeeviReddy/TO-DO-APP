# To-Do Application

A full-stack task management application with a React Native mobile client and a Node.js (Express + TypeScript) REST API backed by MongoDB.

## What is included

- **`mobile/`** — React Native (0.86) Android app
  - Authentication: register, login, logout, persisted session (JWT stored in AsyncStorage)
  - Task management: create, edit, view details, complete, and delete tasks
  - Task fields: title, description, due date/time, deadline, priority (Low/Medium/High), category (Personal/Work/Study/Other), and tags
  - Home dashboard with stats (total / completed / pending / overdue), search, status filters (All/Active/Completed/Overdue/High Priority), and sorting (Smart/Deadline/Priority/Newest/Oldest)
  - Profile screen
  - State management with Redux Toolkit (auth + task slices)
  - React Navigation (native stack) with deep-link config
  - Native date/time picker via `@react-native-community/datetimepicker`

- **`backend/`** — Express + TypeScript REST API
  - JWT-based authentication (`bcryptjs` password hashing)
  - Task CRUD routes (create, list, get, update, delete, toggle complete)
  - MongoDB persistence via Mongoose
  - `/api/health` endpoint and 404 catch-all

## Tech stack

| Layer | Technology |
| ----- | ---------- |
| Mobile | React Native 0.86, React 19, Redux Toolkit, React Navigation 7, Axios |
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB |
| Auth | JWT (JSON Web Tokens) |

## Project structure

```
To-Do application/
├── backend/                  # Express + TypeScript API
│   └── src/
│       ├── config/           # Environment + database config
│       ├── controllers/      # auth + task controllers
│       ├── middleware/       # JWT auth middleware
│       ├── models/           # User + Task Mongoose models
│       ├── routes/           # /api/auth, /api/tasks
│       └── utils/            # Token generation
└── mobile/                   # React Native Android app
    └── src/
        ├── components/       # Reusable UI components
        ├── navigation/       # Navigators + linking config
        ├── screens/          # Login, Register, Home, Add/Edit Task, Details, Profile
        ├── services/         # Axios API + auth/task service wrappers
        ├── store/            # Redux slices (auth, task)
        ├── theme/            # Colors and shared styles
        ├── types/            # TypeScript types
        └── utils/            # Validation, filtering, sorting, sections, stats
```

## Getting started

### Prerequisites

- Node.js >= 22
- MongoDB (local or Atlas)
- Android SDK with NDK 27.1.12297006 and a physical Android device (USB debugging enabled) or an emulator

### Backend

```bash
cd backend
npm install
cp .env.example .env   # set PORT, MONGO_URI, JWT_SECRET
npm run dev            # start the API (default port 5000)
```

### Mobile

```bash
cd mobile
npm install
npm start              # start Metro on port 8081
npm run android        # build and install the debug APK
```

For a physical device over USB, the device needs to reach the Metro bundler and the backend running on your computer:

```
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5000 tcp:5000
```

(These rules can be dropped when the USB connection renegotiates — re-run them if the app shows "Unable to load script" or network errors.)

### Notes

- `mobile/android/local.properties` points `ndk.dir` to a space-free path (`C:\ndk\27.1.12297006`) — required because the default NDK location under a user folder with a space in the path breaks the C++ (libc++) link step on Windows.
- The app's API base URL is `http://localhost:5000/api` and relies on `adb reverse tcp:5000` when running on a USB-connected device.
