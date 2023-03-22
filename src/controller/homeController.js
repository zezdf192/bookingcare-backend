import db from '../models/index';

export const getHomePage = async (req, res) => {
    const data = await db.User.findAll({ raw: true });
    return res.render('index.ejs', { data: JSON.stringify(data) });
};
