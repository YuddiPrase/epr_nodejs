var helper = require('../helper');
var schema = require('../schema');

module.exports = function(agenda){
	agenda.define('registration email', function(job, done) {
	    //email to user for verification
		    var option = job.attrs.data;
		    option.template = 'template1';

		    helper.EmailSend(option, function(err, res){
		    	if(err){throw err}
		    	return true;
		    });
	});

	agenda.define('reset password', function(job, done) {
	   	//email to reset password user
		    var option = job.attrs.data;
		    option.template = 'template1';

		    helper.EmailSend(option, function(err, res){
		    	if(err){throw err}
		    	return true;
		    });
	});

	agenda.define('lelang approval', function(job, done) {
		//email for lelang approval
		    var option = job.attrs.data;
		    option.template = 'template1';

		    helper.EmailSend(option, function(err, res){
		    	if(err){throw err}
		    	return true;
		    });
	});

	agenda.define('lelang invitation', function(job, done) {
		//email for lelang approval
		//looping send email to every vendor
		    var option = job.attrs.data;
		    option.template = 'template1';

		    helper.EmailSend(option, function(err, res){
		    	if(err){throw err}
		    	return true;
		    });
	});

	agenda.define('tes insert', function(job, done) {
		console.log('tes insert job')
		var datajson = {"user_id": 2, "channel_id": "123123", "session_socket" : "123apaan", "message": "promises"};

		helper.DBConnect('127.0.0.1', 'my_database');
		helper.DBCreate(datajson, "channel_log", schema.channel_logSchema, function(err, result){
			if(err){
				console.log(err);
			}
			else{
				console.log(result);
			}
		});
		done();
	});
}