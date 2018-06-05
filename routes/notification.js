var helper = require('./../helper');
var schema = require('./../schema');
var config = require('../config');

var express = require('express');
var router = express.Router();
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3031');

socket.on('connect', function (socket) {
  console.log('Connected from notification!',socket);
});



/* GET users listing. */
router.get('/tes', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/notificationEmail', function (req, res, next) {
  var data = {
    typeNotifikasi: "email",
    message: "< html >",
    userId: "dnd3sdue7335mfdf",
    email: "admin@eproc.com",
    date: "dd-MM-yyyy"
  }

  // socket.emit("notifEmail" , data){

  // }
  res.send('respond with a resource');
});

router.post('/notification_eproc', function (req, res, next) {

  var body = req.body;
  var receiver = body.username;
  var receiver_id = body.user_id;
  var data = body.data;

  helper.DBConnect('127.0.0.1', 'eproc-realtime');
  //validasi input
  if (typeof receiver.length == "undefined" || typeof receiver_id.length == "undefined" || data.length == 0) {
    res.send(false);
    process.exit(0);
  }

  if (!receiver || !receiver_id || !data) {
    res.send(false);
    process.exit(0);
  }

  var datajson = {
    receiver: receiver,
    receiver_id: receiver_id,
    content: data
  };

  try {
    helper.DBCreate(datajson, "notification-list", schema.notifListSchema, function (result) {
      if (result) {
        console.log("Notification success " + result);
        datajson.status = "notification-list";
        socket.emit('channel:notifToBase', datajson);

        res.send(true);
      } else {
        console.log("Notification " + result);
        socket.emit('channel:errorLog', datajson);

        res.send(false);
        // process.exit(0);
      }

    });
  } catch (e) {

    res.send(false);
    // process.exit(0);
  }

});

module.exports = router;