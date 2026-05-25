import bcrypt from 'bcryptjs';
import user from '../model/admin.model.js';
import Role from '../model/role.model.js';
import Permission from '../model/permission.model.js';

export const createUserService = async (data) => {
    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
    }
    return user.create(data);
};

export const getUsersService = () => {
    return user.findAll({
        include: [{
            model: Role,
            as: 'role',
            include: [{ model: Permission, as: 'permissions', through: { attributes: [] } }]
        }]
    });
};

export const updateUserService = async (id, data) => {
    const record = await user.findByPk(id);
    if (!record) return null;

    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
    }

    return record.update(data);
};

export const deleteUserService = async (id) => {
    const record = await user.findByPk(id);
    if (!record) return null;
    return record.destroy();
};
