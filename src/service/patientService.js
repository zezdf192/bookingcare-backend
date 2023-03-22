import db from '../models/index';
import { CRUD } from '../until/constant';
import { sendSimpleEmail } from './emailService';
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';

let buildURLEmail = (id, doctorId) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${id}&doctorId=${doctorId}`;

    return result;
};

export const createPatientService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.date ||
                !data.timeType ||
                !data.name ||
                !data.address ||
                !data.gender
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let id = uuidv4();
                let urlEmail = buildURLEmail(id, data.doctorId);

                await sendSimpleEmail({
                    reciverEmail: data.email,
                    subject: 'Bookingcare',
                    name: data.name,
                    date: data.timeString,
                    doctor: data.doctorName,
                    language: data.language,
                    link: urlEmail,
                });

                //create new patient
                const [user, created] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        firstName: data.name,
                        address: data.address,
                        gender: data.gender,
                    },
                    raw: true,
                });

                //cretare booking
                if (user.id) {
                    await db.Booking.create({
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user.id,
                        date: data.date,
                        token: id,
                        timeType: data.timeType,
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save patient success',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

export const verifyPatientService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let res = await db.Booking.findOne({
                    where: {
                        token: data.token,
                        doctorId: data.doctorId,
                        statusId: 'S1',
                    },
                    raw: false,
                });

                if (res) {
                    res.statusId = 'S2';
                    res.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Verify patient successfully',
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment confirmed or does not exist, please try again later!',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};
