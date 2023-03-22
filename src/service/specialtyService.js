import db from '../models';

const createSpecialty = (data) => {
    return new Promise((resolve, reject) => {
        try {
            if (!data.name || !data.imgBase64 || !data.descriptionMarkdown || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                db.Specialty.create({
                    name: data.name,
                    image: data.imgBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });

                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();

            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                });
            }
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getDetailSpecialty = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: id,
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                });

                if (data) {
                    if (location === 'ALL') {
                        let doctorSpecialty = await db.Doctor_infor.findAll({
                            where: {
                                specialtyId: id,
                            },
                            attributes: ['doctorId', 'provinceId'],
                        });
                        data.doctorSpecialty = doctorSpecialty;
                    } else {
                        let doctorSpecialty = await db.Doctor_infor.findAll({
                            where: {
                                specialtyId: id,
                                provinceId: location,
                            },
                            attributes: ['doctorId', 'provinceId'],
                        });
                        data.doctorSpecialty = doctorSpecialty;
                    }
                } else {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialty: getDetailSpecialty,
};
