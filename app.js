const express = require('express');
const fs = require('fs');
const path = require('path');
const User = require('./modules/user/router.js');
const Login = require('./modules/home/router.js');
const Kita = require('./modules/kita/router.js');
const Daily = require('./modules/daily_check/router.js');
const Group = require('./modules/group/router.js');
const Action = require('./modules/action/router.js');
const calendarEvent = require('./modules/calendar/router.js');
const Chat = require('./modules/chat/router.js');
const smsNotify = require('./modules/smsNotify/router');
const feedbackMsg = require('./modules/feedbackMsg/router');
var https = require('https');

var privateKey  = fs.readFileSync('./sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/server.crt', 'utf8');

require('./config/db_connection.js');
require('./config/passport.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer');
const app = express();
var cookieParser = require('cookie-parser');

var credentials = {key: privateKey, cert: certificate};

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/assets/img/profil_picture');
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null, req.params.username + " - " + Date.now());
        }
    }
});

var storageActions = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/assets/img/actions');
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null, req.params.name + " - " + Date.now());
        }
    }
});

var storageKitas = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/assets/img/kitas');
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null, req.params.name + " - " + Date.now());
        }
    }
});

var upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }
}).single('myFile');

var uploadAction = multer({
    storage: storageActions,
    limits: { fileSize: 10000000 }
}).single('myFileAction');

var uploadKita = multer({
    storage: storageKitas,
    limits: { fileSize: 10000000 }
}).single('myFileKita');

app.use(require('express-session')({
    secret: 'bAKVdqczerYAYKdMxsaBzbFUJU6ZvL2LwZuxhtpS',
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

//Routers
app.use('/user', User);

//Routers
app.use('/daily', Daily);

//Routers
app.use('/action', Action);

//Routers
app.use('/home', Login);

//Routers
app.use('/kita', Kita);

//Routers
app.use('/kita/group', Group);

//Routers
app.use('/calendar', calendarEvent);

//Routers
app.use('/chat', Chat);

//Routers
app.use('/smsnotify', smsNotify);

//Routers
app.use('/feedback', feedbackMsg);

// FileUpload
app.post('/upload/:username', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ success: false, message: 'Die Dateigrösse ist zu gross! Max. 10MB' });
            } else if (err.code === 'filetype') {
                res.json({ success: false, message: 'Die Datei entspricht nicht dem gewünschten Dateiformat! (JPG, JPEG, PNG)'});
            }else {
                console.log(err);
                res.json({success: false, message: 'Der Upload der Datei konnte nicht abgeschlossen werden.'});
            }
        }else{
            if(!req.file){
                res.json({success: false, message: 'Es wurde keine Datei für den Upload ausgewählt!'});
            }else{
                res.json({success: true, message: 'Die Datei wurde erfolgreich hochgeladen.', file: req.file});
            }
        }
    })
})
app.post('/uploadAction/:name', function (req, res) {
    uploadAction(req, res, function (err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ success: false, message: 'Die Dateigrösse ist zu gross! Max. 10MB' });
            } else if (err.code === 'filetype') {
                res.json({ success: false, message: 'Die Datei entspricht nicht dem gewünschten Dateiformat! (JPG, JPEG, PNG)'});
            }else {
                console.log(err);
                res.json({success: false, message: 'Der Upload der Datei konnte nicht abgeschlossen werden.'});
            }
        }else{
            if(!req.file){
                res.json({success: false, message: 'Es wurde keine Datei für den Upload ausgewählt!'});
            }else{
                res.json({success: true, message: 'Die Datei wurde erfolgreich hochgeladen.', file: req.file});
            }
        }
    })
})

app.post('/uploadKita/:name', function (req, res) {
    uploadKita(req, res, function (err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ success: false, message: 'Die Dateigrösse ist zu gross! Max. 10MB' });
            } else if (err.code === 'filetype') {
                res.json({ success: false, message: 'Die Datei entspricht nicht dem gewünschten Dateiformat! (JPG, JPEG, PNG)'});
            }else {
                console.log(err);
                res.json({success: false, message: 'Der Upload der Datei konnte nicht abgeschlossen werden.'});
            }
        }else{
            if(!req.file){
                res.json({success: false, message: 'Es wurde keine Datei für den Upload ausgewählt!'});
            }else{
                res.json({success: true, message: 'Die Datei wurde erfolgreich hochgeladen.', file: req.file});
            }
        }
    })
})

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401);
      res.json({"message" : err.name + ": " + err.message});
    }
  });

var httpsServer = https.createServer(credentials, app);
// web server 8080
httpsServer.listen(8080);


// Socket Server Engine
var server = https.createServer(credentials, app);
var io = require('socket.io')(server);
var port = 8082;

server.listen( port ,function () {
    console.log("\n\n---------------------------- SimpleVisor Chat Server Running ----------------------------\n");
});

var users = {};
var AdminSocket = {};
var connections = [];

io.on('connection', function(socket){

    connections.push(socket);

    console.log(" [ iKita Chat ] => =>  user connected, .... socket.io reported =>", socket.id);
    console.log(users);

    socket.on('send:message', function (data) {
        /*
            message : vm.writingMessage,
			senderid: vm.username,
			sendername: vm.myUserId,
			receiverid: AdminUserID,
			receivername: AdminUserName
        */
        console.log(data.sendername + " user send message to " + data.receivername + " user, message => " + data.message);
        //console.log(users);
        if (users[data.receiverid]){
            //console.log("receiver id=>", data.receiverid);
            var user = users[data.receiverid];
            user.socketData.emit('recive:message', data);
        }else{
            //console.log("sender id=>", data.senderid);
            //User is not online - need to push notification
            var user = users[data.senderid];
            user.socketData.emit('undelivered:message', data);
        }
    });

    socket.on('user:register', function (data) {
        // my msg
        var myData = {
            userData : data,
            socketData : socket
        }
        users[data.userid] = myData;

        if (data.isAdmin == true){
            AdminSocket['admin'] = myData;
        }

        if (AdminSocket['admin']){
            AdminSocket['admin'].socketData.emit('user:online', data);
        }
        //console.log(users);
    });

    socket.on('online:checker', function(data){
        data.checker.forEach(function(element) {
            if (users[element['uID']]){
                if (AdminSocket['admin']){
                    AdminSocket['admin'].socketData.emit('user:online', {userid : element['uID']});
                }
            }
        });
    });

    socket.on('disconnect', function (data) {
               
    });

});
