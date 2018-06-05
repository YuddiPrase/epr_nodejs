var express = require('express');
var router = express.Router();
var helper = require('../helper');
var Agenda = require('agenda');
var agenda = new Agenda({db: {address: 'localhost/agenda', collection: 'job'}});
var joblist = require('../jobList');
var Promises = require('bluebird');
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3031');

socket.on('connect', function (socket) {
  console.log('Connected from email!',socket);
});

var job = [];

/* GET users listing. */
router.post('/user_verification', function(req, res, next) {
  res.send('respond with a resource email');
});

router.post('/user_forget_password', function(req, res, next) {

});

router.post('/lelang_approval', function(req, res, next) {

});

router.post('/lelang_invitation', function(req, res, next) {

	//send job email undangan lelang, 1 email 1 job
	//
	// {
	// "pengirim": "darisaya@gmail.com",
	// "sender_userid": 1
	// "data":
	// [{
	// "tujuan": "alamat1@gmail.com",
	// "subject": "Email Invitation",
	// "body": "lalala......",
	// "footer": "footer email",
	// "attachment": "D://attachment/file1.xls"
	// },
	// {
	// "tujuan": "alamat2@gmail.com",
	// "subject": "Email Invitation",
	// "body": "lalala......",
	// "footer": "footer email",
	// "attachment": "D://attachment/file1.xls"
	// }]
	// }
	var body = req.body;
	var sender = req.body.pengirim;
	var sender_id = req.body.sender_userid;
	var data = req.body.data;

	//validasi input
		if(typeof sender.length == "undefined" || typeof sender_id == "undefined" || data.length == 0){
			console.log("REQ email: ",req.body)
			res.send(false);
			// process.exit(0);
		}

		if(!sender || !sender_id || !data){
			res.send(false);
			// process.exit(0);
		}
		
	var emailOption = {};
	var agenda = new Agenda({db: {address: 'localhost/agenda', collection: 'job'}});

	joblist.sendEmail_lelangInvitation(agenda, function(result){
		agenda.on('ready', function() {
			for (var i = 0; i < data.length; i++) {
				//looping tiap email pengirim	
					emailOption.sender = sender;
					emailOption.receivers = data[i].tujuan;
					emailOption.subject = data[i].subject;
					emailOption.body = data[i].body;
					emailOption.sender_userid = sender_id;
			  		job.push(agenda.schedule(new Date(Date.now() + 100), 'sendEmail_lelangInvitation', emailOption));
			  	//end of looping
			}		
			
			Promises.all(job)
			.then(function() {
				agenda.start();
			})
			.then(function(){
				console.log('job finished')
			});
		});	

		agenda.on('complete', function(job) {
		  console.log('Email %s sent', job.attrs.name);
		  
		//   console.log('email %s sent data', job.attrs.data);
		  console.log('email %s sent data', JSON.stringify(job.attrs.data.receivers));
		  var data = {
				jenisNotif: "email_sendInvitation"
		  }

		  var datajson = {
			receiver: job.attrs.data.receivers,
			receiver_id: job.attrs.data.sender_userid,
			content: data
		  };
		  socket.emit('channel:notifToBase', datajson);
		});
	});
	
	res.send(true);
});

module.exports = router;
