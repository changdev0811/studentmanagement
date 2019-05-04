const mongoose = require('mongoose');
console.log('db connection');
//Connect to mongodb
/*mongoose.connect('mongodb://administrator:JQL3RpasqfF7UNay@ds121726.mlab.com:21726/ikita', {
	useMongoClient: true,
});*/

/*
mongoose.connect('mongodb://127.0.0.1:27017/ikita', {
    useMongoClient: true,
    // other options 
});*/

mongoose.connect('mongodb://admin:admin@ds121726.mlab.com:21726/ikita', {
	useMongoClient: true,
});

mongoose.connection.once('open', function(){
    console.log('Connection succesfull');
}).on('error', function(error){
    console.log('Connection error...', error);
});