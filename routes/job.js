var fs = require('fs');
var express = require('express');
var router = express.Router();
var Agenda = require('agenda');
var Promise = require('bluebird');
var helper = require('../helper');
var today = helper.DateNow(Date.now());
var schema = require('../schema');
var mongoQueueDb = 'mongodb://127.0.0.1/job';
var mongodb = require('mongodb');
var jobList = require('../jobList');
var util = require('util');

var mongoClient = mongodb.MongoClient;
var Collection = mongodb.Collection;
var job = [];
var files = [];
var connect = mongodb.MongoClient.connect(mongoQueueDb);
var agenda = new Agenda({db: {address: 'localhost/agenda', collection: 'job'}});	
var bodyParser = require('body-parser');

//middleware untuk semua yang masuk ke route users
	// router.use(function (req, res, next) {
	// 	if(typeof req.headers.token === 'undefined'){
	// 		var err = new Error('Not Found');
	// 		err.status = 404;
	// 		next('error')
	// 	}	

	// 	var condition = {"remember_token": req.headers.token};
	// 	helper.DBConnect('127.0.0.1','users_online');
	// 	helper.DBGet(condition, today, schema.userOnlineSchema, function(result){
	// 		if(result.length > 0){
	// 			next()		
	// 		}
	// 		else{
	// 			return false;
	// 		}
	// 	});
		
	// });


/* GET users listing. */
router.get('/queue', function(req, res, next) {
	//connect mongodb
	//add job
	//start job after certain seconds
	//give notification

	var agenda = new Agenda({db: {address: 'localhost/agenda', collection: 'job'}});

	//agenda.define udah di include di atas
	// agenda.define('hello', () => {
	// 	console.log('hello job from jobList aye');
	// 	process.exit(0);
	// });

	jobList.hello(agenda, function(result){
		agenda.on('ready', function() {
		  agenda.schedule(new Date(Date.now() + 5000), 'hello');
			agenda.start();
		});	
	});
	

	
});

router.get('/antrian', function(req, res, next){
	for (var i = 0; i < 10; ++i) {
	    files.push(fs.writeFileSync("file-" + i + ".txt", "", "utf-8"));
	}

	Promise.all(files)
	.then(function() {
	    console.log("all the files were created");
	})
	.then(function(){
		console.log('tes dul')
	});

})

router.post('/job', function(req, res, next){
	var agenda = new Agenda({db: {address: 'localhost/agenda', collection: 'job'}});

	var email_jobs = require('../jobs/email')(agenda);
	var jobList = require('../jobList');
	jobList.hello(agenda, function(result){
		console.log('tes')
		agenda.on('ready', function() {
		  agenda.schedule(new Date(Date.now() + 10000), 'hello', {data: "Data Hello"});
			agenda.start();
		});	

		agenda.on('complete', function(job) {
		  console.log('Job %s finished', job.attrs.name);
		});
	});

	res.send(true);
});

router.post('/send_user_registration', function(req, res, next){
	console.log('send user registrasion');
	var agenda = new Agenda({db: {address: 'localhost/agenda', collection: 'job'}});	
	var email_jobs = require('../jobs/email')(agenda);
	
	var dataTemplate = {
	  "body": 'Ini adalah email registrasi user',
	  "author": '@azat_co',
	  "tags": ['express', 'node', 'javascript']
	}

	var emailOption = {
		 		"sender": "'Ridwan Aji Bari' <bari@gmail.com>",
		 		"receivers": [
		 			"tes@gmail.com",
		 			"tes2@gmail.com",
		 			"tes3@gmail.com"
		 		],
		 		"subject": "Tes email",
		 		"data": dataTemplate,
		 		"attachments": [{   
		 			// utf-8 string as an attachment
		            	filename: 'text1.txt',
		            	content: 'hello world!'
		        }]
			}

	jobList.hello(agenda, function(result){
		agenda.on('ready', function() {
		  agenda.schedule(new Date(Date.now() + 10000), 'registration email', emailOption);
			agenda.start();
		});	

		agenda.on('complete', function(job) {
		  console.log('Job %s finished', job.attrs.name);
		});
	});

	res.send(true);
});

router.get('/index', function(req, res, next){
	res.send('to the rythim');
});

router.post('/json', function(req, res, next){
	fs.writeFile("/tmp/test", util.inspect(req, { showHidden: true}), function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	}); 
});

module.exports = router;
