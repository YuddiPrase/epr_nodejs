var express = require('express');
var pg = require('pg');
var config = require('../config');
var model = require('../model/postgre');
var helper = require('../helper');
var schema = require('../schema');
var _ = require('lodash');
var formidable = require('express-formidable');
var CircularJSON = require('circular-json');
var today = helper.DateNow(Date.now());

express().use(formidable());

var router = express.Router();

//middleware untuk semua yang masuk ke route users
	router.use(function (req, res, next) {
		if(typeof req.headers.token === 'undefined'){
			var err = new Error('Not Found');
			err.status = 404;
			next('error')
		}	

		var condition = {"remember_token": req.headers.token};
		helper.DBConnect('127.0.0.1','users_online');
		helper.DBGet(condition, today, schema.userOnlineSchema, function(result){
			if(result.length > 0){
				console.log(result)
				next()		
			}
			else{
				res.send(false);
			}
		});
		
	});

/* GET users listing. */

router.post('/synchronize_users_token', function(req, res, next){
 
	var result = [];
	var dataFilter;

	function inject() {
	  this.login = 1;
	  //you can add more object here
	  //this.tes = 'tes';
	}

	model.User.findAll({
		  where: {
		    remember_token: {
		      $ne: null
		    }
		  }
	})
	.then(users => {
		users.forEach(function(element){
			dataFilter = _.pick(element.dataValues, ['id', 'remember_token']);
			dataFilter = _.assign(dataFilter, new inject);
			result.push(dataFilter);
		})
	})
	.then(function(){
		helper.DBConnect('127.0.0.1','users_online');
		helper.DBInsert(result, today, schema.tokenSchema, function(result){
			if(result){
				res.send(true);
			}
		})
	})

});

module.exports = router;
