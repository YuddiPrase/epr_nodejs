var moment = require('moment-timezone');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var parseDate = new Date();

// var nDate = moment(new Date).format('YYYY-MM-DD HH:mm:ss');

var nDate = moment.tz(new Date(), "Asia/Jakarta");

var dateNow = nDate.format('YYYY-MM-DD HH:mm:ss')

// var dateNow = new Date().toLocaleString('en-US', {
// 	timeZone: 'Asia/Jakarta'
//   });

// schema Channel log
var channel_logSchema = new Schema({
	user_id: Number,
	channel_id: String,
	session_socket: String,
	message: String,
	created_at: {
		type: Date,
		default: dateNow
	}
});

//schema Channel
var channel = new Schema({
	channel_id: String,
	name: String,
	created_by: Number,
	created_at: {
		type: Date,
		default: dateNow
	},
	modified_by: Number,
	modified_at: {
		type: Date,
		default: dateNow
	}
});

//schema Channel content
var channel_contentSchema = new Schema({
	channel_id: Array,
	created_at: {
		type: Date,
		default: dateNow
	}
});

//schema Channel member
var channel_memberSchema = new Schema({
	user_id: Number,
	channel_id: String,
	created_at: {
		type: Date,
		default: dateNow
	}
});

//schema Log 
var logSchema = new Schema({
	user_id: Number,
	url: String,
	method: String,
	ip: String,
	response: String,
	created_at: {
		type: Date,
		default: dateNow
	}
});

//schema Token User
var tokenSchema = new Schema({
	id: Number,
	remember_token: String,
	login: Number
});

var channel_cobaSchema = new Schema({
	data: Object,
	created_at: {
		type: Date,
		default: dateNow
	}
});

var channel_TaskSchema = new Schema({
	task: String,
	created_at: {
		type: Date,
		default: dateNow
	}
});

var userOnlineSchema = new Schema({
	user_id: String,
	user_name: String,
	last_seen: {
		type: String,
		default: dateNow
	},
	remember_token: String,
	status: String
});

var emailLogSchema = new Schema({
	sender_user_id: Number,
	receiver: String,
	email_subject: String,
	created_at: {
		type: String,
		default: dateNow
	}
});

var privateMessageSchema = new Schema({
	channel_id: String,
	user_name: String,
	message: String,
	remember_token: String,
	createdAt: {
		type: String,
		default: dateNow
	}
});

var notifListSchema = new Schema({
	receiver: String,
	receiver_email: String,
	room_id: String,
	content: Object,
	status: {
		type: Boolean,
		default: false
	},
	created_at: {
		type: String,
		default: dateNow
	},
});

var forumListSchema = new Schema({
	room_id: String,
	quote: {
		type: Object,
		default: null,
	},
	content: {
		type: Object,
		default: null,
	},
	created_at: {
		type: String,
		default: dateNow
	},
});

var forumDescriptionListSchema = new Schema({
	room_id: String,
	sender: String,
	sender_id: String,
	email: String,
	content: Object,
	created_at: {
		type: String,
		default: dateNow
	},
});



//export all schema
module.exports = {
	channel_logSchema: channel_logSchema,
	channel: channel,
	channel_contentSchema: channel_contentSchema,
	channel_memberSchema: channel_memberSchema,
	logSchema: logSchema,
	tokenSchema: tokenSchema,
	channel_cobaSchema: channel_cobaSchema,
	channel_TaskSchema: channel_TaskSchema,
	userOnlineSchema: userOnlineSchema,
	emailLogSchema: emailLogSchema,
	privateMessageSchema: privateMessageSchema,
	notifListSchema: notifListSchema,
	forumListSchema: forumListSchema,
	forumDescriptionListSchema: forumDescriptionListSchema,
}