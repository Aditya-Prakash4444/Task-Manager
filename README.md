MERN Stack Task Management System.
A React-TypeScript-Node.js web full-stack app.

Tech used in Task Management System:

1. Frontend: React app developed using TypeScript, communicating through Axios API and using custom hooks to manage the state.

2. Backend: RESTful API, which is implemented on Express.js and Node.js, with CommonJS modules to ensure stability and compatibility.

3. Database: Built-in connection with MongoDB (through Mongoose) to work with intricate connections between Users, Projects, and Tasks.

4. Security: Installed JWT (JSON Web Tokens) to support secure-authentication and special middleware to secure confidential Admin routes.

Key Features:

1. Safe Authentication: JWT based log-in/sign-up and hashing passwords.

2. Team Management: Admin Module: User-invitation to specific projects.

3. Task Lifecycle: A complete CRUD operation with status (Pending, In Progress, Completed).

4. Responsive Workspace: A mobile-first workspace to keep track of tasks.

5. Error Resilience: Frontend error and backend API error comprehensive error handling.

Installation Guide:

Note: You should have frontend and backend folder in the same directory.

1. For Frontend
    cd frontend
    npm run dev

2. For Backend
   cd backend
   npm start


Enviromental Variables:

Create `.env` file in backend directory with:

MONGO_URI=your_mongodb_connection_string // eg. mongodb://localhost:27017/
JWT_SECRET=your_jwt_secret_key // eg. "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjRjMzExNzRlNWIwZjk3MWJhOTg5ZiIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc3NzY1NDQ0OCwiZXhwIjoxNzc3NjU4MDQ4fQ.rvU-Kzarwjr-0Us2uist_F5GcCOiSLuD-nATlaJVh2E"
PORT=5000

   
   
