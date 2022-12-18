const express = require("express");
var cors = require("cors");
const app = express();
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

configRoutes(app);

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log("Server will be running on http://localhost:4000");
});
