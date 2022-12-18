const express = require("express");
var cors = require("cors");
const app = express();
const helper = require('./helper')
const session = require("express-session");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const email = require('./email')

app.use(cors());
app.use(express.json());

email.sendEmail('akash1999patel@gmail.com','Test Email', 'This email was ent from app.js')
// app.use(express.urlencoded({extended: true}));
// app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');
// const static = express.static(__dirname + '/public');
// app.use('/public', static);

// app.use(session({
//     name: 'AuthCookie',
//     secret: 'This cookie is used to determine login info',
//     resave: false,
//     saveUninitialized: true
//   }));

// app.use('/login', (req,res, next) => {
//     if(req.session.user){
//         return res.redirect('/dashboard')
//     }
//     else{
//         req.method = 'POST';
//         next();
//     }
// })

// app.use('/register', (req,res, next) => {
//     if(req.session.user){
//         return res.redirect('/dashboard')
//     }
//     else{
//         next();
//     }
// })

// app.use('/dashboard', (req,res, next) => {
//     if(!req.session.user){
//         return res.redirect('/')
//     }
//     else{
//         next();
//     }
// })

app.use('/sendEmail', (req,res) => {
  try{
  const userEmail = req.body.userEmail;
  const subject = req.body.subject;
  const message = req.body.message;

  helper.checkEmail(userEmail);
  helper.checkString(subject);
  helper.checkString(message);

  console.log(userEmail,subject,message)
  email.sendEmail(userEmail,subject,message);
  return res.status(200).send('Email Sent Successfully!')
  // if(emailSent){
  //   return res.status(200).send('Email sent successfully!')
  // }
  // return res.status(400).send(emailSent)
  }
  catch(e){
    return res.status(400).send('Email Send Failed!')
  }
})

configRoutes(app);

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log("Server will be running on http://localhost:4000");
});
