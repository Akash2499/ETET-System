const nodemailer = require('nodemailer');
 
 
let mailTransporter = nodemailer.createTransport({
    service: 'in-v3.mailjet.com',
    auth: {
        user: 'etet.systems@gmail.com',
        pass: 'Akash@240199?'
    }
});
 
let mailDetails = {
    from: 'xyz@gmail.com',
    to: 'abc@gmail.com',
    subject: 'Test mail',
    text: 'Node.js testing mail for GeeksforGeeks'
};
 
mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log(err);
    } else {
        console.log('Email sent successfully');
    }
});