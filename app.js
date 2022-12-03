const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
const static = express.static(__dirname + '/public');
app.use('/public', static);

app.use('/login', (req,res, next) => {
    if(req.session.user){
        return res.redirect('/dashboard')
    }
    else{
        req.method = 'POST';
        next();
    }
})

app.use('/register', (req,res, next) => {
    if(req.session.user){
        return res.redirect('/dashboard')
    }
    else{
        next();
    }
})

app.use('/dashboard', (req,res, next) => {
    if(!req.session.user){
        return res.redirect('/')
    }
    else{
        next();
    }
})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Application will be running on http://localhost:3000');
});
