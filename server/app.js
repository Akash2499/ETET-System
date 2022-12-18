const express = require("express");
var cors = require("cors");
const app = express();
<<<<<<< HEAD
const session = require('express-session');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
require("dotenv/config"); //

var corsOptions = {
  origin: 'http://localhost:3000',
  methods: "GET,POST,PUT,DELETE,OPTIONS",
}

app.use(cors(corsOptions))
app.use(express.json());
=======
const session = require("express-session");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use(cors());
app.use(express.json());
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
>>>>>>> 4a3bb2af69f832fa85eaac8b11254bf00765c69e

configRoutes(app);

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log("Server will be running on http://localhost:4000");
});
