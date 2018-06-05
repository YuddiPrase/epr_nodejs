var definedJob = require('./definedJob');
var helper = require('./helper');

module.exports = {
	tes: function(){
		console.log('tes');
	},
	hello: function(agenda, callback){
		console.log('hellow')
		 agenda.define('hello', job => {
		    console.log(job.attrs.data);
		    process.exit(0);
		  });

		// agenda.define('hello', (option) => {
			console.log('dsds')
		// });
		callback(agenda);
	},
	sendEmail_lelangApproval: function(agenda, callback){
	},
	sendEmail_lelangInvitation: function(agenda, callback){
		agenda.define('sendEmail_lelangInvitation', job => {
			definedJob.sendEmail_lelangInvitation(job.attrs.data);
		});

		callback(agenda);
	}
}

