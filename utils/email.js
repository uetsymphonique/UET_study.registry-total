const nodemailer = require('nodemailer');
const AppError = require('./appError')

const sendEmail = async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'RegistryTotal <registrytotal@vr.com.vn>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.text // plain text body
        //html:
    };
    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;