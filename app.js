const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require ('express-validator');
const ejs = require ('ejs');
const layouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const port = process.env.PORT || 3000;
const config = require('./config/database');
const socketIO = require('./config/io');
const mongoose = require('mongoose');
const { auth, restControllers, webControllers, errors } = require('../sendMoneyApi/apis/routes');

mongoose.connect(config.database, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  
let db = mongoose.connection;
db.once('open', function(){
    console.log('Connected to MongoDB');
});

db.on('error', function(err){
    console.log(err);
});

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin:['http://localhost:8100','http://127.0.0.1:8100'],
    credentials:true
}));

//View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejs.renderFile/*exphbs({
  defaultLayout:'layout',
  partialsDir: __dirname + '/views/partials/'
})*/);
app.use(layouts);
app.set('layout', 'layouts/layout');

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//Express session
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  saveUnitialized: true,
  resave: true
}));

//Passport Initializing
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//Express validator
app.use(express.json());

app.use('/',webControllers);
app.use('/auth',auth);
app.use('/api',restControllers);
app.use('/errors',errors);

let httpServer = http.createServer(app);
httpServer.listen(port);

socketIO(server)
server.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${port}`);
});