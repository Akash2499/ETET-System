const nodemailer = require('nodemailer');
const helper = require('./helper')
 
let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "etet.systems@gmail.com",
      pass: "dozrqiduronfngxl",
    },
  });
 

const sendEmail = (userEmail, subject, message) => {
    helper.checkString(userEmail);
    helper.checkString(message);
    let mailDetails = {
        from: 'etet.systems@gmail.com',
        to: userEmail,
        subject: subject,
        text: message
    };
    
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = {
    sendEmail
}
