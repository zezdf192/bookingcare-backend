import db from '../models/index';
import { CRUD } from '../until/constant';

import { sendRemedyEmail } from './emailService';

require('dotenv').config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

export const getTopDoctorDervice = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = [];
            doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: { exclude: ['password'] },
                limit: limit,
                order: [['updatedAt', 'DESC']],
                include: [
                    {
                        model: db.Allcodes,
                        as: 'positionData',
                        attributes: ['valueEn', 'valueVi'],
                    },
                    {
                        model: db.Allcodes,
                        as: 'genderData',
                        attributes: ['valueEn', 'valueVi'],
                    },
                ],
                raw: true,
                nest: true,
            });

            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getAllDoctorService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: { exclude: ['password', 'image'] },
            });

            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const postDetailDoctorsService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.doctorId ||
                !data.contentHTML ||
                !data.contentMarkdown ||
                !data.description ||
                !data.price ||
                !data.payment ||
                !data.province ||
                !data.nameClinic ||
                !data.addressClinic
            ) {
                console.log('check data', data);
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required fields',
                });
            } else {
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                    specialtyId: data.specialtyId,
                    clinicId: data.clinicId,
                });

                let doctorInfor = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: data.doctorId,
                    },
                    raw: false,
                });

                if (!doctorInfor) {
                    await db.Doctor_infor.create({
                        doctorId: data.doctorId,
                        priceId: data.price,
                        provinceId: data.province,
                        paymentId: data.payment,
                        addressClinic: data.addressClinic,
                        nameClinic: data.nameClinic,
                        specialtyId: data.specialty,
                        clinicId: data.clinic,
                        note: data.note,
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save info detail doctor successfully',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const getDetailDoctorByIDService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter',
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: id },
                    attributes: { exclude: ['password'] },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['contentHTML', 'contentMarkdown', 'description'],
                        },
                        {
                            model: db.Doctor_infor,
                            attributes: { exclude: ['id', 'doctorId'] },
                            include: [
                                {
                                    model: db.Allcodes,
                                    as: 'priceData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcodes,
                                    as: 'paymentData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcodes,
                                    as: 'provinceData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Specialty,
                                    as: 'specialtyData',
                                    attributes: ['name'],
                                },
                            ],
                        },
                        {
                            model: db.Allcodes,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],

                    raw: true,
                    nest: true,
                });
                if (data && data.image) {
                    let buffer = new Buffer(data.image, 'base64').toString('binary');
                    data.image = buffer;
                }

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const getMarkdownService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter',
                });
            } else {
                let markdown = await db.Markdown.findOne({
                    where: { doctorId: id },
                    attributes: ['contentHTML', 'contentMarkdown', 'description'],
                });

                resolve({
                    errCode: 0,
                    data: markdown ? markdown : {},
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let checkInputRequired = (inputData) => {
    let arrFields = [
        'doctorId',
        'contentHTML',
        'contentMarkdown',
        'description',
        'price',
        'payment',
        'province',
        'nameClinic',
        'addressClinic',
        'clinic',
        'specialty',
    ];
    let element = '';
    let isValid = true;
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }

    return {
        isValid,
        element,
    };
};

export const putMarkdownDoctorService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isCheck = checkInputRequired(data);

            if (!isCheck.isValid) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameter ${isCheck.element}`,
                });
            } else {
                let markdown = await db.Markdown.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false,
                });

                if (markdown) {
                    (markdown.description = data.description),
                        (markdown.contentHTML = data.contentHTML),
                        (markdown.contentMarkdown = data.contentMarkdown);
                    await markdown.save();
                } else {
                    await db.Markdown.create({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId,
                    });
                }

                let doctorInfor = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: data.doctorId,
                    },
                    raw: false,
                });

                if (doctorInfor) {
                    doctorInfor.doctorId = data.doctorId;
                    doctorInfor.priceId = data.price;
                    doctorInfor.provinceId = data.province;
                    doctorInfor.paymentId = data.payment;
                    doctorInfor.addressClinic = data.addressClinic;
                    doctorInfor.nameClinic = data.nameClinic;
                    doctorInfor.note = data.note;
                    doctorInfor.specialtyId = data.specialty;
                    doctorInfor.clinicId = data.clinic;
                    await doctorInfor.save();
                } else {
                    await db.Doctor_infor.create({
                        doctorId: data.doctorId,
                        priceId: data.price,
                        provinceId: data.province,
                        paymentId: data.payment,
                        addressClinic: data.addressClinic,
                        nameClinic: data.nameClinic,
                        note: data.note,
                        specialtyId: data.specialty,
                        clinicId: data.clinic,
                    });
                }
            }
            resolve({
                errCode: 0,
                errMessage: 'Update markdown success',
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const createBulkScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('cehck data', data);
            if (!data.schedule || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let schedule = data.schedule;
                let timestamp = new Date(data.time);

                if (schedule && schedule.length > 0) {
                    schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }

                await db.Schedule.destroy({
                    where: { doctorId: data.doctorId, date: timestamp },
                });

                await db.Schedule.bulkCreate(schedule);

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                });
            }
            resolve('');
        } catch (error) {
            reject(error);
        }
    });
};

export const getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter',
                });
            } else {
                let timestamp = new Date(+date);

                let schedule = await db.Schedule.findAll({
                    where: {
                        doctorId,
                        date: timestamp,
                    },
                    include: [
                        {
                            model: db.Allcodes,
                            as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.User,
                            as: 'doctorData',
                            attributes: ['firstName', 'lastName'],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                if (!schedule) schedule = [];

                resolve({
                    errCode: 0,
                    data: schedule,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const getExtraInforDoctorByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter',
                });
            } else {
                let data = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: id,
                    },
                    attributes: { exclude: ['id', 'doctorId'] },
                    include: [
                        {
                            model: db.Allcodes,
                            as: 'priceData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcodes,
                            as: 'paymentData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcodes,
                            as: 'provinceData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],
                    raw: true,
                    nest: true,
                });

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const getListPatientService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter',
                });
            } else {
                let timestamp = new Date(+date);
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: timestamp,
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {
                                    model: db.Allcodes,
                                    as: 'genderData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                            ],
                        },
                        {
                            model: db.Allcodes,
                            as: 'timeTypePatient',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],
                    raw: true,
                    nest: true,
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

export const sendRemedyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.imgBase64 || !data.name || !data.timeType || !data.patientId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter',
                });
            } else {
                //edit status
                await sendRemedyEmail({
                    imgBase64: data.imgBase64,
                    subject: 'Bookingcare',
                    name: data.name,
                    email: data.email,
                });

                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        statusId: 'S2',
                        timeType: data.timeType,
                    },
                    raw: false,
                });

                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save();
                }

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
