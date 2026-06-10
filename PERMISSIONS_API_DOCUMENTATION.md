# Permissions Section - REST API Documentation

This document provides a comprehensive list of all REST API endpoints used in the **Permissions** section of the attendance management system.

---

## Overview

The Permissions section manages:
- **Users** - Create, read, update, delete user accounts and assign roles
- **Roles** - Create, read, update, delete roles and manage role-specific permissions
- **Permission Definitions** - Create, read, update, delete granular permission types
- **User Permissions** - Assign specific permissions to individual users

All endpoints use the `axiosInstance` HTTP client with Bearer token authentication.

---

## API Endpoints by Category

### 1. USER MANAGEMENT

#### 1.1 Get All Users
- **Method:** `GET`
- **Endpoint:** `/users/get`
- **Used In:** `UserManager`, `AdminManager`, `PermissionList`, `EditUserPermissions`
- **Description:** Retrieves a list of all users in the system
- **Response:** Array of user objects with fields: `id`, `name`, `email`, `phone`, `roleId`, `permissions`
- **Example:**
  ```javascript
  axiosInstance.get('/users/get')
  ```

#### 1.2 Create User
- **Method:** `POST`
- **Endpoint:** `/users/create`
- **Used In:** `AdminManager`
- **Description:** Creates a new user account with role assignment
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "roleId": 2,
    "password": "securePassword123"
  }
  ```
- **Example:**
  ```javascript
  await axiosInstance.post('/users/create', userData)
  ```

#### 1.3 Update User
- **Method:** `PUT`
- **Endpoint:** `/users/update/:id`
- **Used In:** `AdminManager`, `EditUserPermissions`
- **Description:** Updates existing user details (name, email, phone, role, optional password)
- **URL Parameter:** `:id` - User ID
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "9876543211",
    "roleId": 3,
    "password": "newPassword123" // Optional - only when updating password
  }
  ```
- **Example:**
  ```javascript
  await axiosInstance.put(`/users/update/${userId}`, userData)
  ```

#### 1.4 Delete User
- **Method:** `DELETE`
- **Endpoint:** `/users/delete/:id`
- **Used In:** `AdminManager`
- **Description:** Deletes a user account from the system
- **URL Parameter:** `:id` - User ID
- **Notes:** Primary admin user (id=1) is protected from deletion
- **Example:**
  ```javascript
  await axiosInstance.delete(`/users/delete/${userId}`)
  ```

---

### 2. ROLE MANAGEMENT

#### 2.1 Get All Roles
- **Method:** `GET`
- **Endpoint:** `/roles/get`
- **Used In:** `RoleManager`, `AdminManager`, `PermissionList`, `EditUserPermissions`, `EditRolePermissions`
- **Description:** Retrieves all roles defined in the system with their permissions
- **Response:** Array of role objects with fields: `id`, `name`, `permissions` (array of permission IDs)
- **Example:**
  ```javascript
  axiosInstance.get('/roles/get')
  ```

#### 2.2 Create Role
- **Method:** `POST`
- **Endpoint:** `/roles/create`
- **Used In:** `RoleManager`
- **Description:** Creates a new role with assigned permissions
- **Request Body:**
  ```json
  {
    "name": "Teacher",
    "permissions": [1, 2, 5, 7]
  }
  ```
- **Example:**
  ```javascript
  await axiosInstance.post('/roles/create', roleData)
  ```

#### 2.3 Update Role
- **Method:** `PUT`
- **Endpoint:** `/roles/update/:id`
- **Used In:** `RoleManager`, `EditRolePermissions`
- **Description:** Updates role name and/or permissions
- **URL Parameter:** `:id` - Role ID
- **Request Body:**
  ```json
  {
    "name": "Senior Teacher",
    "permissions": [1, 2, 3, 5, 7, 9]
  }
  ```
- **Example:**
  ```javascript
  await axiosInstance.put(`/roles/update/${roleId}`, roleData)
  ```

#### 2.4 Delete Role
- **Method:** `DELETE`
- **Endpoint:** `/roles/delete/:id`
- **Used In:** `RoleManager`
- **Description:** Deletes a role from the system
- **URL Parameter:** `:id` - Role ID
- **Notes:** Ensure no users are assigned to this role before deletion
- **Example:**
  ```javascript
  await axiosInstance.delete(`/roles/delete/${roleId}`)
  ```

---

### 3. PERMISSION DEFINITIONS

#### 3.1 Get All Permission Definitions
- **Method:** `GET`
- **Endpoint:** `/permissions/definitions/get`
- **Used In:** `RoleManager`, `PermissionDefinitionList`, `PermissionList`, `EditRolePermissions`
- **Description:** Retrieves all permission definitions (granular permissions that can be assigned to roles)
- **Response:** Array of permission definition objects with fields: `id`, `name`
- **Example:**
  ```javascript
  axiosInstance.get('/permissions/definitions/get')
  ```

#### 3.2 Create Permission Definition
- **Method:** `POST`
- **Endpoint:** `/permissions/definitions/create`
- **Used In:** `PermissionDefinitionList`
- **Description:** Creates a new permission definition
- **Request Body:**
  ```json
  {
    "name": "Manage_Attendance"
  }
  ```
- **Example:**
  ```javascript
  await axiosInstance.post('/permissions/definitions/create', { name: 'Edit_Reports' })
  ```

#### 3.3 Update Permission Definition
- **Method:** `PUT`
- **Endpoint:** `/permissions/definitions/update/:id`
- **Used In:** `PermissionDefinitionList`
- **Description:** Updates the name of an existing permission definition
- **URL Parameter:** `:id` - Permission Definition ID
- **Request Body:**
  ```json
  {
    "name": "Manage_Attendance_Records"
  }
  ```
- **Example:**
  ```javascript
  await axiosInstance.put(`/permissions/definitions/update/${permId}`, { name: newName })
  ```

#### 3.4 Delete Permission Definition
- **Method:** `DELETE`
- **Endpoint:** `/permissions/definitions/delete/:id`
- **Used In:** `PermissionDefinitionList`
- **Description:** Deletes a permission definition
- **URL Parameter:** `:id` - Permission Definition ID
- **Notes:** Ensure no roles use this permission before deletion
- **Example:**
  ```javascript
  await axiosInstance.delete(`/permissions/definitions/delete/${permId}`)
  ```

---

## Components Using These APIs

| Component | GET | POST | PUT | DELETE |
|-----------|-----|------|-----|--------|
| **AdminManager** | /users/get, /roles/get | /users/create | /users/update/{id} | /users/delete/{id} |
| **RoleManager** | /roles/get, /permissions/definitions/get | /roles/create | /roles/update/{id} | /roles/delete/{id} |
| **PermissionDefinitionList** | /permissions/definitions/get | /permissions/definitions/create | /permissions/definitions/update/{id} | /permissions/definitions/delete/{id} |
| **PermissionList** | /users/get, /roles/get, /permissions/definitions/get | - | - | - |
| **EditUserPermissions** | /users/get, /roles/get | - | /users/update/{id} | - |
| **EditRolePermissions** | /roles/get, /permissions/definitions/get | - | /roles/update/{id} | - |

---

## Authentication

All endpoints require Bearer token authentication passed in the request header:
```javascript
Authorization: Bearer <adminToken>
```

The token is typically stored in `localStorage.getItem('adminToken')` and automatically included by `axiosInstance`.

---

## Error Handling

Errors are returned with appropriate HTTP status codes and messages:
- **400:** Bad Request (validation errors)
- **401:** Unauthorized (missing or invalid token)
- **403:** Forbidden (insufficient permissions)
- **404:** Not Found (resource doesn't exist)
- **500:** Server Error

Example error response:
```json
{
  "error": "User not found",
  "errors": {
    "email": "Email already exists",
    "phone": "Invalid phone format"
  }
}
```

---

## Request/Response Flow

### User Creation/Update Flow
1. Form validates input on client side
2. User submits form
3. Frontend sends POST/PUT request to `/users/create` or `/users/update/{id}`
4. Backend validates and saves user
5. Frontend refreshes user list via `GET /users/get`
6. Updated list displayed to admin

### Role Permission Change Flow
1. Admin selects role and toggles permissions
2. Frontend sends PUT request to `/roles/update/{id}` with updated permissions array
3. Backend updates role and its associations
4. Frontend refreshes role list

---

## Summary

**Total Endpoints Used:** 14
- **GET:** 5 unique endpoints
- **POST:** 3 unique endpoints
- **PUT:** 4 unique endpoints
- **DELETE:** 4 unique endpoints

All endpoints follow RESTful conventions and are designed for resource-based operations on users, roles, and permissions.
