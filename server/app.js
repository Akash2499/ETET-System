const express = require("express");
var cors = require("cors");
const app = express();
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

configRoutes(app);

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log("Server will be running on http://localhost:4000");
});
