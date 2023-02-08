require('dotenv').config() //allows us to use .env file, keep at top

const express =  require('express');
const app = express();
const path = require('path');

//set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static('public'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/js'));

// Middleware
app.use(express.json()); //allows us to use json
app.use(express.urlencoded({ extended: true }));

// Routes
const users = require('./routes/users');
const login = require('./routes/login')
const videoBoard = require('./routes/video-board');

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/video-board', videoBoard);
app.use('/users', users);
app.use('/login', login);

//Database
const db = require('./models');

(async () => {
    await db.sequelize.sync();
})();

//Port
const port = 3000;
app.listen(port);