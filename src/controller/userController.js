import {
    handleLoginUser,
    handleGetUsersService,
    handleCreateNewUsersService,
    handleDeleteUsersService,
    handleEditUsersService,
    getAllCodeService,
} from '../service/userService';

export const handleLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing input parameters',
        });
    }

    const dataUser = await handleLoginUser(email, password);

    return res.status(200).json({
        errCode: dataUser.errCode,
        message: dataUser.message,
        user: dataUser.user,
    });
};

export const handleGetAllUsers = async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(404).json({
            errCode: 1,
            message: 'Missing input parameters',
        });
    }

    // id = 'ALL' -> get all users
    // id != 'ALL' -> get user by id
    const users = await handleGetUsersService(id);

    return res.status(200).json({
        errCode: 0,
        message: 'Success',
        users,
    });
};

export const handleCreateNewUsers = async (req, res) => {
    try {
        const data = req.body;
        if (!data.email) {
            return res.status(500).json({
                errCode: 1,
                message: 'Missing input parameters',
            });
        }
        const resultService = await handleCreateNewUsersService(data);

        return res.status(200).json(resultService);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handleDeleteUsers = async (req, res) => {
    const userId = req.body.id;
    if (!userId) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameters',
        });
    }
    const message = await handleDeleteUsersService(userId);

    return res.status(200).json(message);
};

export const handleEditUsers = async (req, res) => {
    const data = req.body;

    if (!data.id) {
        return res.status(500).json({
            errCode: 2,
            message: 'Missing id parameters',
        });
    }

    const message = await handleEditUsersService(data);

    return res.status(200).json(message);
};

//Booking care
export const handleGetAllCode = async (req, res) => {
    try {
        const data = await getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log('Error: ', error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};
