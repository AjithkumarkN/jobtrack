# JobTrack – Job Application & Interview Management System

A full-stack web application for tracking job applications, scheduling interviews, managing job-search tasks, and maintaining a professional profile — built to bring order to the job hunt itself.

## Features

- **Authentication** — JWT-based signup/login, protected routes, account deletion
- **Applications** — full CRUD (create, view, edit, delete), status tracking (Wishlist → Applied → Interview → Offer/Rejected), resume upload per application
- **Interviews** — scheduling linked to specific applications, interview type and status tracking
- **Tasks** — a simple checklist for job-search follow-ups, optionally linked to an application
- **Dashboard** — aggregated stats (total applications, upcoming interviews, pending tasks, status breakdown) computed via Django ORM aggregation
- **Profile** — editable profile with photo upload, phone/location/title, skills, experience, education, social links, and resume, with view/edit modes and validation

## Tech Stack

**Backend:** Python, Django, Django REST Framework, MySQL, JWT (SimpleJWT)
**Frontend:** React (Vite), React Router, Axios, Context API
**Tools:** Git, GitHub, Postman/Thunder Client

## Architecture

```
React (Vite) ⇄ Django REST Framework ⇄ MySQL
                     ↓
              Media storage (resumes, profile photos)
```

- Every API endpoint enforces per-user data isolation — users can only ever access their own applications, interviews, tasks, and profile.
- JWT access/refresh tokens handle authentication; an Axios interceptor automatically attaches the token to every request.
- File uploads (resume, profile photo) use `multipart/form-data` with server-side validation (file size, type).

## Setup

### Backend
```bash
cd jobtrack_backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
# Create a MySQL database named jobtrack_db
# Update DATABASES in jobtrack/settings.py with your credentials
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd jobtrack_frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`, backend API at `http://127.0.0.1:8000`.

## Screenshots

*(Add screenshots here: Dashboard, Applications list, Profile page)*

## What I learned building this

- Debugging real environment issues (Python/Django/MySQL version compatibility)
- Designing secure, per-user REST APIs with Django REST Framework
- Managing authentication state and protected routing in React
- Handling file uploads across both backend validation and frontend previews

## Author

**Ajith Kumar K**
[GitHub](https://github.com/AjithkumarkN) · [LinkedIn](https://linkedin.com/in/ajithkumar-k669397238)
