import * as userService from '../services/admin.service.js';

// Create User
export const createUser = async (req, res) => {
    try {
        const user = await userService.createUserService(req.body);
        res.status(201).json({
            message: "User created successfully",
            user: user.toJSON()
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = {};
            error.errors.forEach((err) => {
                errors[err.path] = err.message;
            });
            return res.status(400).json({ errors });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Get All Users
export const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsersService();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
}

// Update User
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.updateUserService(id, req.body);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = {};
            error.errors.forEach((err) => {
                errors[err.path] = err.message;
            });
            return res.status(400).json({ errors });
        }
        res.status(500).json({ error: "Error updating user" });
    }
}

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.deleteUserService(id);
        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
}