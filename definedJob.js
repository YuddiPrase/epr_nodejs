//defined job for queue
var helper = require('./helper');

module.exports = {
	sendEmail_lelangApproval: function(){
		helper.EmailSend(emailOption, function(){
			
		});
	},

	sendEmail_lelangInvitation: function(emailOption){
		emailOption.template = 'template_lelang_invitation';
		helper.EmailSend(emailOption);
	}

}