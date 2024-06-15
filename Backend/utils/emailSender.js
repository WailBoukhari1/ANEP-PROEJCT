const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your preferred service
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};