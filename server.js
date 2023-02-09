require('dotenv').config() //allows us to use .env file, keep at top

const express =  require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser')

//set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static('public'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/js'));

// Middleware

var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser);
app.use(urlencodedParser);

// Routes
const videoBoard = require('./routes/video-board');

app.get('/', (req, res) => {
    res.render('index');
});

const logger = (req, res, next) => {
    console.log(req);
    next();
};

app.use('/video-board', logger, videoBoard);

//Database
const db = require('./models');

(async () => {
    await db.sequelize.sync();
})();

//Port
const port = 3000;
app.listen(port);