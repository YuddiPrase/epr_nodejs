var moment = require('moment');
var socketIOFile = require('socket.io-file');
var config = require('../config');
var schema = require('./../schema');

module.exports = function (io, helper) {

	// var userid = [];

	// var nspChat = io.of('/chat');

	// // routing
	// app.get('/', function (req, res) {
	// 	res.sendfile(__dirname + '/index.html');
	// });

	// usernames which are currently connected to the chat
	var usernames = {};

	var users = []

	// rooms which are currently available in chat
	var rooms = ['room1', 'room2', 'room3'];


	//initialize IO connection
	io.on('connection', function (socket) {
		console.log('user chat terhubung.');
		helper.DBConnect(config.mongoDb.host, config.mongoDb.database);

		// when the client emits 'adduser', this listens and executes
		socket.on('adduser', function (data) {
			var username = data.username;
			if (data.token) {

				var datajson = {
					"user_id": 12,
					"user_name": username,
					// "last_seen":  nDate,
					"remember_token": data.token,
					"status": "Online"
				};

				helper.DBCreate(datajson, "user-list", schema.userOnlineSchema, function (err, result) {
					if (err) {
						console.log(err);
					} else {
						console.log("user-list: " + result);
					}
				});
			}
			console.log("Username: " + username)

			//initial data
			var data = {};

			// store the username in the socket session for this client		
			socket.username = username;

			// add the client's username to the global list
			usernames[username] = username;
			users.push(username);
			data.username = username;
			data.listUsers = users;
			data.statusSocket = true; //STATUS KONEKSI SOCKET

			if (username != "Admin Monitoring") {

				// store the room name in the socket session for this client
				socket.room = 'globalroom';
				// send client to room 1
				socket.join(socket.room);

				data.room = socket.room;

				// echo to client they've connected
				socket.emit('updatechat', 'SERVER', 'you have connected to ' + socket.room);
				socket.emit('updaterooms', rooms, socket.room);

			}

			var data = {
				collection: "notification-list",
				condition: {
					"notif_id": "channelyuddi"
				},
			}

			// var collection = data.collection;

			// helper.DBGet(data.condition, collection, schema.userOnlineSchema, function (result) {
			// 	if (result.length > 0) {

			// 		console.log("RESULT: " + result)
			// 		var datas = {
			// 			user: 'me',
			// 			msg: 'yoi bro?'
			// 		}
			// 		socket.emit('channel:errorLog', result);

			// } else {
			// if(err){
			// 	console.log("getData "+collection+" error: "+err)
			// }else{
			// 		console.log("getData " + collection + " gagal: " + JSON.stringify(data.condition))
			// 		// }
			// 		var datas = {
			// 			user: 'me',
			// 			msg: 'yoi bro?'
			// 		}
			// 		socket.emit('channel:notifToBase', result);
			// 	}
			// });

			io.emit('userList', data); // +'<br>'+{"room":socket.room, "user":socket.username}

			// echo to room 1 that a person has connected to their room
			data.message = socket.username + ' has connected to';

			data.permission = 'user';
			socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', data);

			data.permission = 'monitoring';
			if (socket.username == "Admin Monitoring") {
				data.message = socket.username + ' has connected';
				socket.broadcast.emit('updatechat', 'SERVER', data); //monitoring only				
			} else {
				data.message = socket.username + ' has connected to ' + socket.room;
				socket.broadcast.emit('updatechat', 'SERVER', data); //monitoring only	
			}

		});


		// when the client emits 'sendchat', this listens and executes
		// socket.on('sendchat', function (data) {
		// 	// we tell the client to execute 'updatechat' with 2 parameters
		// 	console.log("message in room " + socket.room + ": " + data + " || by: " + socket.username)
		// 	io.sockets.in(socket.room).emit('updatechat', socket.username, data);
		// });



		// var data = {
		// 	room_id: "200/201710/0001",
		// 	type_chat: "forum",
		// 	quote: {
		// 		isquote: false[{
		// 			quote_id: ""
		// 		}]
		// 	},
		// 	content: {
		// 		sender: {
		// 			sender_id: "3222012",
		// 			username: data.username,
		// 			company: "PT. Infimedia Solusi Pratama"
		// 		},
		// 		message: "Ini pesan baru dari ",
		// 		created_at: Date.now(),
		// 		photo_path: "../../img/avatars/5.png"
		// 	}
		// }

		// when the client emits 'sendchat', this listens and executes
		socket.on('channel:sendForum', function (data) {

			if (data.type_chat == "forum") {

				var datajson = {
					room_id: data.room_id,
					quote: data.quote,
					content: data.content
				}

				helper.DBCreate(datajson, "forum-list", schema.forumListSchema, function (result) {
					console.log("forum-list " + result);
					if (result) {
						console.log("send forum success " + result);
						// we tell the client to execute 'updatechat' with 2 parameters
						console.log("message in room " + socket.room + ": " + data + " || by: " + socket.username)
						socket.broadcast.emit('channel:getNotif', 'SERVER', data);
						io.in(socket.room).emit('channel:updateForum', socket.username, data);
					} else {
						console.log("send forum " + result);
					}

				});

			} else if (data.type_chat == "description") {

				var datajson = {
					room_id: data.room_id,
					content: data.content
				}

				helper.DBCreate(datajson, "forumdescription-list", schema.forumDescriptionListSchema, function (result) {
					if (result) {
						console.log("send description success " + result);
						var dataNotif = {
							receiver: "String",
							receiver_email: "String",
							room_id: data.room_id,
							content: data.content,
							status: true,
						}
						helper.DBCreate(dataNotif, "notification-list", schema.notifListSchema, function (resultNotif) {
							if (resultNotif) {
								socket.broadcast.emit('channel:getNotif', 'SERVER', data);
								io.in(socket.room).emit('channel:updateForumDescription', socket.username, data);
							} else {
								console.log("failed notif description " + resultNotif);
							}
						});
					} else {
						console.log("failed send description " + result);
					}

				});
			}

		});

		socket.on('channel:getForum', function (data) {
			helper.DBConnect(config.mongoDb.host, config.mongoDb.database);

			dataMongo = {
				collection1: {
					collection: "forumdescription-list",
					condition: {
						"room_id": data.room_id
					},
				},
				collection2: {
					collection: "forum-list",
					condition: {
						"room_id": data.room_id
					},
				}
			}

			var dataMDBDescription = [];
			var dataMDBForum = [];


			helper.DBGet(dataMongo.collection1.condition, dataMongo.collection1.collection, schema.forumDescriptionListSchema, function (result) {
				if (result.length > 0) {
					// console.log("RESULT forum description: " + data.email)
					// console.log("#1-success:", result)
					result.forEach(function (item) {
						console.log("ITEM", item);
						// var createDate = moment.tz(new Date(item.content.created_at), "Asia/Jakarta");
						// var dateCreate = createDate.format('YYYY-MM-DD HH:mm:ss')						
						var arr = {
							id: item.id,
							room_id: item.room_id,
							content: {
								photo_path: item.content.photo_path,
								created_at: item.content.created_at,
								message: item.content.message,
								sender: {
									company: item.content.sender.company,
									email: item.content.sender.email,
									username: item.content.sender.username,
									sender_id: item.content.sender.sender_id
								}
							},
							created_at: item.created_at,
							// success: true
						}
						dataMDBDescription.push(arr);
					});
					dataMDBDescription.success = true;
					console.log("#1-success-dataMDBDescription", dataMDBDescription)

					io.emit(data.email + "-description", dataMDBDescription);
				} else {
					dataMDBDescription = {
						errorMessage: "No Results Found",
						success: false
					}
					console.log("#1-failed:", result)
					console.log("#1-getData " + dataMongo.collection1.collection + " gagal: " + JSON.stringify(dataMongo.collection1.condition))
					io.emit(data.email + "-description", dataMDBDescription);
				}
			});

			helper.DBGet(dataMongo.collection2.condition, dataMongo.collection2.collection, schema.forumListSchema, function (result) {
				if (result.length > 0) {
					// console.log("RESULT forum description: " + data.email)
					// console.log("#2-success:", result)
					result.forEach(function (item) {
						var arr = {
							id: item.id,
							room_id: item.room_id,
							quote: item.quote,
							content: {
								photo_path: item.content.photo_path,
								created_at: item.content.created_at,
								message: item.content.message,
								sender: {
									company: item.content.sender.company,
									email: item.content.sender.email,
									username: item.content.sender.username,
									sender_id: item.content.sender.sender_id
								}
							},
							created_at: item.created_at,
							// success: true
						}
						dataMDBForum.push(arr)
					});
					dataMDBForum.success = true;
					console.log("#2-success-DATAMDBForum", dataMDBForum)
					io.emit(data.email + "-forum", dataMDBForum);
				} else {
					dataMDBForum = {
						errorMessage: "No Results Found",
						success: false
					}
					console.log("#2-failed:", result)
					console.log("#2-getData " + dataMongo.collection2.collection + " gagal: " + JSON.stringify(dataMongo.collection2.condition))
					io.emit(data.email + "-forum", dataMDBForum);
				}
			});

			// socket.broadcast.emit('channel:pushNotif', 'SERVER', data);
		})

		socket.on("channel:notifToBase", function (data) {
			console.log("NotifToBase-Success")
			socket.broadcast.emit('channel:pushNotif', 'SERVER', data);
		})

		socket.on("channel:errorLog", function (data) {
			socket.broadcast.emit('channel:pushErrorLog', 'SERVER', data);
		})

		socket.on('channel:sendNotif', function (data) {
			// var dataNotif = {
			// 	receiver: {
			// 		userId: "1234321",
			// 		username: "tes@gmail.com",
			// 		company: "PT. Integra Media Dinamika"
			// 	},
			// 	sender: {
			// 		userId: "3222012",
			// 		username: data.username,
			// 		company: "PT. Infimedia Solusi Pratama"
			// 	},
			// 	content: {
			// 		messageNotif: "Ini pesan baru dari "+ data.username,
			// 		createAt: "Baru saja",
			// 		linkPage: "Aanwijzing-forum",
			// 		channelId: data.channelId
			// 	}
			// }
			socket.broadcast.emit('channel:getNotif', 'SERVER', data);
			// console.log("Notif Sending...: "+data.notifCount);
			console.log("Notif Sending...: " + data.user);
		});

		//channel ini di emit dari client ketika client mendapatkan pesan,
		socket.on('channel:statusNotif', function (data) {
			console.log("Status Notif: " + data.status + " to " + data.penerima.email + ", at " + data.tanggal);
			socket.broadcast.emit('channel:getStatusNotif', data.pengirim.email, data);
		});

		//------------------------Test private Chat
		socket.on("sendPrivateMessage", function (data) {
			var channel = "channel" + data.channel;
			var datajson = {
				"channel_id": channel,
				"user_name": data.username,
				"message": data.message,
				"remember_token": data.token,
				"createdAt": new Date(Date.now()).toISOString()
			};
			helper.DBCreate(datajson, "privatemsg-list", schema.privateMessageSchema, function (result) {
				if (err) {
					console.log(err);
				} else {
					console.log("privatemsg-list: " + result);
				}
			});

			socket.broadcast.emit(channel, 'SERVER', data);
		});

		//------------------------Test schema Chat
		socket.on("getChatList", function (data) {
			data = {
				collection: "privatemsg-list",
				condition: {
					"channel_id": "channelyuddi"
				},
			}
			var collection = data.collection;
			helper.DBGet(data.condition, collection, schema.userOnlineSchema, function (result) {
				if (result.length > 0) {
					console.log("RESULT: " + result)
				} else {
					// if(err){
					// 	console.log("getData "+collection+" error: "+err)
					// }else{
					console.log("getData " + collection + " gagal: " + JSON.stringify(data.condition))
					// }
				}
			});
		});

		socket.on('switchRoom', function (newroom) {
			console.log("Switch Room to " + newroom)
			// leave the current room (stored in session)
			console.log("current room " + socket.room)
			socket.leave(socket.room);
			// join new room, received as function parameter
			socket.room = newroom;
			console.log("current room " + socket.room)
			socket.join(newroom);
			socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
			// sent message to OLD room
			socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has left this room');
			// update socket session room title
			socket.room = newroom;
			socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
			socket.emit('updaterooms', rooms, newroom);
		});

		// when the user disconnects.. perform this
		socket.on('disconnect', function () {
			var data = {};
			var disconnectUser;
			for (let i = 0; i < users.length; i++) {
				if (users[i] === socket.username) {
					users.splice(i, 1);
					disconnectUser = users[i];
				}
			}

			data.room = socket.room;
			data.listUsers = users;
			data.statusSocket = false; //STATUS KONEKSI SOCKET

			io.emit('userList', data);

			// remove the username from global usernames list
			delete usernames[socket.username];
			// update list of users in chat, client-side
			// nspChat.sockets.emit('updateusers', usernames);
			// echo globally that this client has left
			data.message = socket.username + ' has disconnected from';
			if (socket.username != "Admin Monitoring") {
				data.permission = 'user';
			} else {
				data.permission = 'monitoring';
			}
			socket.broadcast.emit('updatechat', 'SERVER', data);
			socket.leave(socket.room);
		});


		// socket.on('channel:send_chat', function(id, data){
		// 	socket.broadcast.to(id).emit('channel:get_chat',{
		// 		msg : data.msg,
		// 		room : data.room
		// 	});
		// 	// socket.broadcast.to(id).emit('my message', msg);
		// 	console.log('Message: ' + data.msg);
		// });

		// socket.on('chat message', function(msg){
		// 	io.emit('chat message', msg);
		// });

		// socket.on('channel:chat_user', function(data, callback){
		// 	//for register user in chat
		// 	if(userid.indexOf(data) < 0){
		// 		socket.nickname = data;
		// 		userid.push(socket.nickname);
		// 	} else{
		// 		return false;
		// 	}

		// });

		// socket.on('channel:chat', function(pesan) {
		// 	//channel realtime chat
		// 	var datajson = {"user_id": 2, "channel_id": "123123", "session_socket" : "123apaan", "message" : pesan};
		// helper.DBCreate(datajson, "channel_log", schema.channel_logSchema);

		//   io.emit('channel:chat', pesan);
		//   console.log(pesan);
		// });

		// socket.on('disconnect', function(){
		//   console.log('user chat terputus.');
		// });

	});
}