if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require("express");
const exphbs = require("express-handlebars");
const passport = require("./config/passport_config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require('method-override')


const app = express();
const PORT = process.env.PORT || 8080;
const db = require("./models");

//setup handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//setup static files
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());

app.use(passport.session());
app.use(methodOverride('_method'));
// app.use(flash());

//use routes
require("./routes/html-routes")(app);
require("./routes/api-routes")(app);

db.sequelize.sync().then(()=>{
    app.listen(PORT, ()=>{
        console.log("server started\nhttp://localhost:%s",PORT);
    })
})
