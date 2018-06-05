var express = require('express');
var router = express.Router();
var helper = require('../helper');
var config = require('../config');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expresss' });
});

router.get('/tes', function(req, res, next){
	console.log('tess')
	console.log(config.dbPostgre.user)
	// res.send(helper.Config)
});

router.get('/chats', function(req, res, next){
	res.sendFile(appRoot  + '/realtime.html');
});

router.get('/tes_report', function(req, res, next){
	var html = fs.readFileSync(appRoot+'/template/pdf/jumbotron.html', 'utf8');
  	var options = { format: 'Letter' , "footer": {
	    "height": "28mm",
	    "contents": {
	      default: '<p style="color: #444; float: right; margin-right: 1cm; display: block;"><span>{{page}}</span>/<span>{{pages}}</span></p>', // fallback value
	    }
	  }, 
	  "header": {
	    "height": "20mm",
	    // "contents": '<p>Author: Bari</p>'
	  }
	};
  	var name = "./../report/tes_report123";

	helper.Html2Pdf(name, html, options, function(result){
		console.log(result);
	});
});

module.exports = router;
