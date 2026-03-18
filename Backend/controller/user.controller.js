import usermodel from '../model/user.model.js';

export const createUser = async (req, res) => {
    try {
        const user = await usermodel.create(req.body);
        console.log("✅ User created:", user.toJSON());
        res.status(201).json(user);
    } catch (error) {
        console.error("❌ Error creating user:", error);
        res.status(500).json({ error: error.message });
    }
}

export const getUser = async (req, res) => {
    try {
        const users = await usermodel.findAll();
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
}