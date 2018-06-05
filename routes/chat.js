var express = require('express');
var router = express.Router();

var path = require('path');
global.appRoot = path.resolve();

/* GET users listing. */
router.get('/', function(req, res, next) {
	// res.io.emit("socketToMe", "users");
	res.sendFile(appRoot  + '/chat.html');
});

module.exports = router;
