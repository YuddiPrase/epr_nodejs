var helper = require('../helper');
var schema = require('../schema');

module.exports = function(agenda){
	agenda.define('report lelang', function(job, done) {
	    //email to user for verification
		    var option = job.attrs.data;
		    option.template = 'template1';

		    helper.Html2Pdf(option, function(err, res){
		    	if(err){throw err}
		    	return true;
		    });
	});
}