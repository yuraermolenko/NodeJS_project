const express  = require('express');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const port = process.env.port || 1337;

const pool = require('./js/connectionPool');

const sessionStore = require('./js/sessionStore');
const contentHandler = require('./js/contentHandler');
const editHandler = require('./js/editHandler');
const addHandler = require('./js/addHandler');
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    store: sessionStore
}));
var jsonParser = bodyParser.json();
var textParser = bodyParser.text();
var upload = multer({ dest: 'pages/uploads' });
var type = upload.single('addFile'); 
app.use(jsonParser);
app.use(textParser); 
app.use(cookieParser());
app.set('views', path.join(__dirname, './pages'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, './pages')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.redirect('/home');
});

app.get('/home', contentHandler.displayItems);
app.get('/home/:id', contentHandler.displayCategory);


app.get('/contact', function(req, res) {
    res.render('contact');
});


app.post('/login', function(req, res) {
    if (req.body.username === 'admin' && req.body.password === '12345') {
        sessionStore.clear(function (err) {

            if (err) console.log(err);

            console.log('store is cleared');

        });
        req.session.isLoggedIn = true;
         req.session.username = req.body.username;
         console.log(req.session.isLoggedIn);
         sessionStore.set(req.sessionID, req.session, function (err) {
             if (err) {
                 console.log(err)
                 return;
             } else {
                 console.log('session saved!');
             }
         })
    }
    res.redirect('/home');
    res.end();
    console.log(req.session.isLoggedIn);
});

app.get('/edit/:id',function (req,res) {
    if(req.session.isLoggedIn==true){editHandler.showEditPage(req,res)}
    else {
        console.log('not autorised')
        res.redirect('/')}
});

app.put('/upload/:id', editHandler.uploadItem);

app.get('/new', function (req, res)  {
    if(req.session.isLoggedIn==true){res.render(path.join(__dirname, 'pages/add.ejs'))}
    else {
        console.log('not autorised')
        res.redirect('/')};
});

app.delete('/delete/:id',function (req,res) {
    if(req.session.isLoggedIn==true){editHandler.removeItem(req,res)}
    else {
        console.log('not autorised')
        res.redirect('/')}
});

app.get('/view/:id', editHandler.showInfo);

app.post('/upload', type, function (req, res) {
    console.log(req.body);
    
    console.log(req.file);

 
    var tmp_path = req.file.path;

   
    var target_path = path.join(req.file.destination, req.file.originalname);

    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);

    src.pipe(dest);

   
    src.on('end', function () {


        fs.unlink(tmp_path);
    });
    src.on('error', function (err) {

      
        fs.unlink(tmp_path);
    });
    addHandler.addItem(req, res);
});

var nodemailer = require('nodemailer');
app.post('/send-mail', (req, res) => {
    if(!req.body.length) return;

var formData = req.body.split('\r\n');

var postData = [];
for(var i=0;i < formData.length;i++) {
    var tmpArr = formData[i].split('=');
    postData.push({[tmpArr[0]]:tmpArr[1]});
}
// Create a SMTP transporter object
var transporter = nodemailer.createTransport(
    {
        service: 'Gmail',
        auth: {
            user: 'some@gmail.com',
            pass: 'somepass'
        },
        logger: true, // log to console
        debug: true // include SMTP traffic in the logs
    },
    {
        // default message fields

        // sender info
        from: '' + postData[0].name + ' ' + postData[1].email + '<' + postData[1].email + '>',
        headers: {
            'X-Laziness-level': 1000 // just an example header, no need to use this
        }
    });

console.log('SMTP Configured');

// Message object
var message = {

    // Comma separated list of recipients
    to: '"Yura" <yura14ermolenko@mail.ru>',

    // Subject of the message
    subject: postData[2].subject, //

    // plaintext body
    text: postData[3].message,

    // HTML body
    html: '<p>' + postData[3].message + '</p>',

};

console.log('Sending Mail');
transporter.sendMail(message, function (error, info) {
    if (error) {
        console.log('Error occurred');
        console.log(error.message);
        return;
    }
    console.log('Message sent successfully!');
    console.log('Server responded with "%s"', info.response);
});

var date = new Date();
var hh = date.getHours();
if (hh < 10) hh = '0' + hh;
var min = date.getMinutes();
if (min < 10) min = '0' + min;
var sec = date.getSeconds();
if (sec < 10) sec = '0' + sec;
var dd = date.getDate();
if (dd < 10) dd = '0' + dd;
var mm = date.getMonth() + 1;
if (mm < 10) mm = '0' + mm;
var yyyy = date.getFullYear();

date = yyyy + '-' + mm + '-' + dd + '-' + hh + '-' + min + '-' + sec;
fs.writeFile(`form_${date}.txt`, req.body, (err) => {
    if (err) { console.log(err) }
    console.log('file form created');
})
res.redirect('/home');


});


app.use(function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Page not found!');
});

app.use(function(err, req, res, next) {
    res.status(500).send('oops...something went wrong');
    next(err.stack);
});

app.listen(port, function() {
    console.log('app listening on port ' + port);
});




