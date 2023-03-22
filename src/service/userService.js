import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

export const handleLoginUser = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataUser = {};
            const check = await checkEmailuser(email);
            if (check) {
                const user = await db.User.findOne({
                    attributes: ['id', 'email', 'password', 'roleId', 'firstName', 'lastName'],
                    raw: true,
                    where: {
                        email: email,
                    },
                });
                const checkPassword = bcrypt.compareSync(password, user.password);
                if (checkPassword) {
                    dataUser.errCode = 0;
                    dataUser.message = 'Ok';
                    delete user.password;
                    dataUser.user = user;
                } else {
                    dataUser.errCode = 3;
                    dataUser.message = 'Password mismatch';
                }
            } else {
                dataUser.errCode = 2;
                dataUser.message = 'Email not found';
            }
            resolve(dataUser);
        } catch (error) {
            reject(error);
        }
    });
};

const checkEmailuser = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    email: email,
                },
            });

            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const handleGetUsersService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (id && id === 'ALL') {
                users = await db.User.findAll({ attributes: { exclude: ['password'] } });
            }
            if (id && id !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: id },
                    attributes: { exclude: ['password'] },
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

export const handleCreateNewUsersService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({ where: { email: data.email } });

            if (user) {
                resolve({
                    errCode: 2,
                    message: 'Email is already in use',
                });
            } else {
                const hashPassword = bcrypt.hashSync(data.password, salt);
                await db.User.create({
                    email: data.email,
                    password: hashPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    roleId: data.roleId,
                    phonenumber: data.phonenumber,
                    image: data.image,
                    positionId: data.positionId,
                });
            }
            resolve({
                errCode: 0,
                message: 'Create a new account successfully',
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const handleDeleteUsersService = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id: userId },
                raw: false,
            });
            if (user) {
                user.destroy();
            } else {
                resolve({
                    errCode: 2,
                    message: 'Delete user failed',
                });
            }
            resolve({
                errCode: 0,
                message: 'Delete user successfully',
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const handleEditUsersService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (!user) {
                resolve({
                    errCode: 3,
                    message: `User isn't found`,
                });
            } else {
                user.update(
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        phonenumber: data.phonenumber,
                        gender: data.gender,
                        positionId: data.position,
                        roleId: data.roleId,
                        image: data.image,
                    },
                    { where: { id: data.id } },
                );
            }
            resolve({
                errCode: 0,
                message: 'update user successfully',
            });
        } catch (error) {
            reject(error);
        }
    });
};

//Booking care

export const getAllCodeService = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!type) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter',
                });
            } else {
                let res = {};
                let typefix = type.toUpperCase();
                let data = await db.Allcodes.findAll({
                    where: { type: typefix },
                });
                res.errCode = 0;
                res.data = data;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    });
};
