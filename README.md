# Professional Learning Platform

A full-stack learning platform (similar to Udemy/Coursera) built with React.js, Node.js, Express, and MongoDB.

## Features
- **Public Pages**: Home, About, Course Listing, Contact.
- **Authentication**: Secure JWT-based registration and login.
- **Roles**: Student and Admin roles.
- **Dashboard**: User dashboard showing enrolled courses.
- **Course Management**: Admin panel to Add/Delete courses.
- **Course Consumption**: Detailed curriculum view for courses.
- **Code Practice**: Interactive HTML/CSS/JS playground.

## Tech Stack
- **Frontend**: React (Vite), Bootstrap 5, React Router, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.

## Prerequisites
- Node.js (v14+)
- MongoDB (Local instance running on default port or update .env)

## Setup & Installation

1. **Install Dependencies**
   Run the following command in the root directory to install dependencies for both User Interface (client) and API (server):
   ```bash
   npm run install-all
   ```
   *Alternatively, run `npm install` in root, server, and client folders individually.*

2. **Environment Variables**
   The `server/.env` file is pre-configured for local development:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/learning_platform
   JWT_SECRET=learning_platform_secret_key_2024
   ```

3. **Seed Database**
   Populate the database with dummy courses and users:
   ```bash
   cd server
   node seeder.js
   cd ..
   ```
   *(This has already been run during setup, but you can run it again to reset data)*

## Running the Application

To run both the frontend and backend concurrently:

```bash
npm start
```

- **Frontend**: http://localhost:5173 (Vite default)
- **Backend**: http://localhost:5000

## Login Credentials (Dummy Data)

**Admin User:**
- Email: `admin@example.com`
- Password: `password123`

**Student User:**
- Email: `student@example.com`
- Password: `password123`
