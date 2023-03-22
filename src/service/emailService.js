import nodemailer from 'nodemailer';
require('dotenv').config();

const infoHTML = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.name}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch online trên Bookingcare</p>
        <P>Thông tin khám bệnh</P>
        <div><b>Thời gian: ${dataSend.date}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctor}</b></div>
        <p>Nếu các thông tin là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận</p>
        <a href=${dataSend.link} targer="_blank">Click here</a>
        <div>Xin chân thành cảm ơn</div>
    `;
    } else {
        result = `
        <h3>Dear ${dataSend.name}</h3>
        <p>You received this email because you booked your appointment online on Bookingcare</p>
        <P>Medical examination information</P>
        <div><b>Time: ${dataSend.date}</b></div>
        <div><b>Doctor: ${dataSend.doctor}</b></div>
        <p>If the information is true, please click the link below to confirm</p>
        <a href=${dataSend.link} targer="_blank">Click here</a>
        <div>Sincerely thank</div>
    `;
    }

    return result;
};

export const sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Duy Nguyen 👻" <duy1922003@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: dataSend.subject, // Subject line
        html: infoHTML(dataSend), // html body
    });
};

let infoRemedyHTML = (dataSend) => {
    let result = 'hello';

    return result;
};

export const sendRemedyEmail = async (dataSend) => {
    //console.log(dataSend);
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Duy Nguyen 👻" <duy1922003@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: dataSend.subject, // Subject line
        html: infoRemedyHTML(dataSend), // html body
        attachments: [
            {
                // encoded string as an attachment
                filename: 'cat.jpg',
                content: dataSend.imgBase64.split('base64,')[1],
                encoding: 'base64',
            },
        ],
    });
};
