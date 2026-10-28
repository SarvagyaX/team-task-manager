# Team Task Manager

A full-stack starter project built with React, TypeScript, FastAPI, SQLite and Docker.

## Features
- Create, read, update and delete records through a REST API
- Search records
- Responsive dark-mode UI
- FastAPI interactive API docs# Team Task Manager

A full-stack web application for managing tasks through a React-based interface and a FastAPI backend. The application supports task creation, updates, deletion, and search, with SQLite for data persistence.

The project demonstrates frontend and backend integration, REST API development, database operations, and automated testing in a simple, locally runnable application.

## Features

- **Task Management:** Create, view, update, and delete task records.
- **Search:** Find tasks using the application's search functionality.
- **REST API:** Handle application operations through FastAPI endpoints.
- **Database Persistence:** Store task records in SQLite.
- **Interactive API Documentation:** Explore and test endpoints through Swagger UI.
- **Automated Testing:** Validate backend functionality using Pytest.
- **Containerization:** Includes a Dockerfile for the backend.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, CSS |
| Backend | Python, FastAPI |
| Database | SQLite |
| API | REST |
| Testing | Pytest |
| Development Tools | Git, GitHub, Docker |

## Project Structure

```text
team-task-manager/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── test_main.py
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the application:

- Python 3.10 or later
- Node.js and npm

### 1. Start the Backend

From the project root, open a terminal and run:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

The API will be available at:

- API base URL: http://127.0.0.1:8000
- Swagger UI: http://127.0.0.1:8000/docs

Keep this terminal running while using the application.

### 2. Start the Frontend

Open a second terminal from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

### 3. Run Backend Tests

Open another terminal from the project root:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pytest -v
```

The test results will show which backend tests passed or failed.

## Engineering Considerations

The project separates the frontend interface from the backend API, making each part easier to develop and test independently. The API provides the interface for data operations, while SQLite stores records locally.

The included automated tests provide a starting point for validating backend behavior. Further development could introduce broader test coverage, stronger input validation, authentication, and a production database.

## Future Improvements

- Add user authentication and role-based access control.
- Migrate from SQLite to PostgreSQL.
- Expand API and frontend integration test coverage.
- Improve request validation and error handling.
- Add a CI pipeline for automated testing.
- Deploy the application to a hosting environment.


- Pytest CRUD tests
- SQLite persistence; no paid services required

## Run the backend
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```
API docs: http://127.0.0.1:8000/docs

## Run the frontend
Open a second terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal.

## Run tests
```powershell
cd backend
pytest
```

## Tech stack
Python, FastAPI, REST APIs, SQLite/SQL, React, TypeScript, Vite, Pytest.

## Notes
This is an original portfolio starter, not a production-hardened system. Add authentication, PostgreSQL, stronger domain validation and deployment before using it as a production app. Update this README with screenshots and explain your own contributions.
