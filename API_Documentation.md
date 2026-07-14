# Full API Documentation (Merged & Updated)

This document outlines all the REST API endpoints available in the backend for integration with the mobile application or frontend clients. All API requests should be prefixed with your server's base URL (e.g., `https://api.yourdomain.com`).

---

## Authentication & Authorization
All secured endpoints require Bearer token authentication passed in the request header:
`Authorization: Bearer <adminToken>`

### 1. Admin Authentication
- **POST** `/api/admin/login` - Authenticates a user and returns access/refresh tokens.
- **POST** `/api/admin/refresh-token` - Refreshes an expired access token using the valid refresh token.
- **POST** `/api/admin/logout` - Invalidates the current user session.
- **GET** `/api/admin/me` - Retrieves the profile details of the currently authenticated user.

---

## User & Role Management (Permissions Module)
Endpoints used for managing administrative users, roles, and granular permissions.

### 1. User Management (`/api/admin/users`)
- **GET** `/api/admin/users` - Retrieves a list of all administrative users.
- **POST** `/api/admin/users` - Creates a new user account with a role assignment.
- **PUT** `/api/admin/users/:id` - Updates existing user details (name, email, role, optional password).
- **DELETE** `/api/admin/users/:id` - Deletes a user account from the system.

### 2. Role Management (`/api/roles`)
- **GET** `/api/roles/get` - Retrieves all roles defined in the system with their permissions.
- **POST** `/api/roles/create` - Creates a new role with assigned permissions.
- **PUT** `/api/roles/update/:id` - Updates a role name and/or its permissions.
- **DELETE** `/api/roles/delete/:id` - Deletes a role from the system (Ensure no users are assigned).

### 3. Permission Definitions (`/api/permissions/definitions`)
- **GET** `/api/permissions/definitions/get` - Retrieves all atomic permission definitions.
- **POST** `/api/permissions/definitions/create` - Creates a new permission definition.
- **PUT** `/api/permissions/definitions/update/:id` - Updates the name of an existing permission definition.
- **DELETE** `/api/permissions/definitions/delete/:id` - Deletes a permission definition.

---

## Core Entities (Departments, Students, Teachers)

### 1. Departments (`/api/departments`)
- **GET** `/api/departments` - Returns a list of all departments.
- **GET** `/api/departments/:id` - Returns details for a specific department.
- **POST** `/api/departments/add` - Creates a new department.
- **PUT** `/api/departments/:id` - Updates department details.
- **DELETE** `/api/departments/:id` - Deletes a department.

### 2. Students (`/api/students`)
- **GET** `/api/students` - Returns a list of all students.
- **GET** `/api/students/:id` - Returns details for a specific student.
- **POST** `/api/students/add` - Adds a new student record.
- **PUT** `/api/students/:id` - Updates an existing student.
- **DELETE** `/api/students/:id` - Removes a student.

### 3. Teachers (`/api/teachers`)
- **GET** `/api/teachers` - Returns a list of all teachers.
- **GET** `/api/teachers/:id` - Returns details for a specific teacher.
- **POST** `/api/teachers/add` - Adds a new teacher record.
- **PUT** `/api/teachers/:id` - Updates an existing teacher.
- **DELETE** `/api/teachers/:id` - Removes a teacher.

---

## Academic Structure (`/api/academic`)
Manages the curriculum, subjects, semesters, and teacher allocations.

- **GET** `/api/academic/overview` - Fetches high-level academic summary.
- **Subjects**: `GET`, `POST`, `PUT /:id`, `DELETE /:id` at `/api/academic/subjects`.
- **Courses**: `GET`, `POST`, `PUT /:id`, `DELETE /:id` at `/api/academic/courses`.
- **Semesters**: `GET`, `POST`, `PUT /:id`, `DELETE /:id` at `/api/academic/semesters`.
- **Curriculum**: `GET`, `POST`, `PUT /:id`, `DELETE /:id` at `/api/academic/curriculum`.
- **Allocations**: `GET`, `POST`, `PUT /:id`, `DELETE /:id` at `/api/academic/allocations`.
- **Credits**: `GET`, `POST`, `PUT /:id` at `/api/academic/credits`.

---

## Timetable Management (`/api/timetable`)
Manages the generation and manual scheduling of timetables.

- **GET** `/api/timetable/overview` - Fetches the timetable overview.
- **POST** `/api/timetable/generate` - Automatically generates a timetable schedule.
- **POST** `/api/timetable/publish` - Publishes the draft timetable.
- **POST** `/api/timetable/resolve` - Auto-resolves timetable conflicts.
- **POST** `/api/timetable/classrooms` - Creates a new classroom entity.
- **GET** `/api/timetable/slots` - Retrieves specific scheduled lecture slots.
- **POST** `/api/timetable/slots` - Creates a specific lecture slot.
- **PUT** `/api/timetable/slots/:id` - Updates a lecture slot.
- **DELETE** `/api/timetable/slots/:id` - Deletes a lecture slot.
- **PUT** `/api/timetable/entries/:id` - Updates a timetable entry.
- **DELETE** `/api/timetable/entries/:id` - Deletes a timetable entry.

---

## Attendance Management (`/api/attendance`)
- **GET** `/api/attendance/report` - Retrieves attendance reports based on query parameters (`?studentId=...&startDate=...`).
- *(Note: Mobile App Check-in endpoint like `POST /api/attendance/mark` to be implemented if not already present)*

---

## Notifications (`/api/notifications`)
- **POST** `/api/notifications/token` - Registers a mobile device's push notification token (FCM/APNS).
  - *Body:* `{ "userId": "123", "deviceToken": "abc...", "platform": "android" }`
- **POST** `/api/notifications/send` - Triggers a notification to be sent to a specific user or group.

---

## Activity Logs (`/api/activity-logs`)
- **GET** `/api/activity-logs/get` - Retrieves audit/activity logs of user actions.

---

## Error Handling Standards
The APIs return standard HTTP status codes:
- `200 OK` / `201 Created` - Success
- `400 Bad Request` - Validation errors or missing parameters
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User lacks necessary permissions for this endpoint
- `404 Not Found` - Resource does not exist
- `500 Internal Server Error` - Backend/Database failure

*Example Error Response:*
```json
{
  "error": "Validation Failed",
  "errors": {
    "email": "Email already exists"
  }
}
```
