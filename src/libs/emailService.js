import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({ 
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'upsdocentesapp@gmail.com',
    pass: 'iopj mdpn bvup eazt'
  }
});

export const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: 'upsdocentesapp@gmail.com',
    to: email,
    subject: 'Verification Code for Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">Password Reset Verification Code</h2>
        <p style="color: #555;">Hello,</p>
        <p style="color: #555;">You have requested to reset your password. Please use the following verification code to proceed:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; font-size: 20px; border-radius: 5px;">${code}</span>
        </div>
        <p style="color: #555;">If you did not request a password reset, please ignore this email.</p>
        <p style="color: #555;">Thank you,</p>
        <p style="color: #555;">The Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
