import db from '../models';

const createClinic = (data) => {
    return new Promise((resolve, reject) => {
        try {
            if (!data.name || !data.imgBase64 || !data.address || !data.descriptionMarkdown || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                db.Clinic.create({
                    name: data.name,
                    image: data.imgBase64,
                    address: data.address,
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

const getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();

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

const getDetailClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: id,
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'name', 'address'],
                });

                if (data) {
                    let doctorClinic = await db.Doctor_infor.findAll({
                        where: {
                            clinicId: id,
                        },
                        attributes: ['doctorId', 'provinceId'],
                    });
                    data.doctorClinic = doctorClinic;
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
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinic: getDetailClinic,
};
