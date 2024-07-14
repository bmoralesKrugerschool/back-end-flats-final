import nodemail from 'nodemailer';

const transporter = nodemail.createTransport({ 
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  /* service: 'gmail', */
  auth: {
    user: 'upsdocentesapp@gmail.com',
    pass: 'iopj mdpn bvup eazt'
  }
});

export const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
      from: 'bmoralest84@gmail.com',
      to: email,
      subject: 'Verification Code for Password Reset',
      text: `Your verification code is: ${code}`,
  };

  return transporter.sendMail(mailOptions,(error,info) => {
    if(error){
      console.log(error);
    }else{
      console.log('Email sent: ' + info.response);
    }
  }
  );
};