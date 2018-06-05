var mongoose = require('mongoose');
var mongoDb = 'mongodb://10.10.8.6/eproc-realtime';
var mongoQueueDb = 'mongodb://10.10.8.6/task_queue';
var mongodb = require('mongodb');
var mongoDbQueue = require('mongodb-queue');
var monq = require('monq');
var monqDb = monq('mongodb://localhost:27017/queue_job');
var fs = require('fs');
var phantom = require('phantom');
var handlebars = require('handlebars');
var moment = require('moment');
var nodemailer = require('nodemailer');
var config = require('./config');
var schema = require('./schema');
var Promise = require('bluebird');

moment().format();

mongoose.connect(mongoDb);
mongoose.Promise = global.Promise;

var exports = module.exports = {};

exports.DBConnect = function(host, database){
  mongoDb = 'mongodb://'+host+'/'+database;
  mongoose.connect(mongoDb);
  // mongoose.connect(mongoDb, {
  //   useMongoClient: true
  // });
  mongoose.Promise = global.Promise;
  console.log('terhubung ke '+host+' - '+database);
}

exports.DBCreate = function(data, collection, schema, callback){
  //helper to insert 1 record only
  var Model = mongoose.model(collection, schema);
  channel = new Model(data);

  channel.save(function(err){
    console.log("data ditambahkan disimpan di "+collection);

    if(err){
      console.log(err);
    }else{
      return callback(true);
    }
    
  });
}

exports.DBInsert = function(data, collection, schema, callback){
  //helper to insert more than 1 record
  var Model = mongoose.model(collection, schema);
  Model.collection.insert(data, onInsert);

  function onInsert(err, docs){
    if(err){
      return console.log('failed insert many');
    }
    else{
      return callback(true);
    }

  }

}

exports.DBUpdate = function(data, param, value, collection, schema){
  var Model = mongoose.model(collection, schema);
  var cond = '{'
       +'"'+param+'" : "'+value+'"'
       +'}';

  var query = JSON.parse(cond);
  var update = {
            "$set": data 
        };
    var options = { "multi": true };

  Model.update(query, update, options, function (err) {
    console.log("data perubahan disimpan di "+collection);
        if (err) return console.error(err);         
    })
}

exports.DBDelete = function(param, value, collection, schema){
  var Model = mongoose.model(collection, schema);
  var cond = '{'
       +'"'+param+'" : "'+value+'"'
       +'}';
       
  var query = JSON.parse(cond);

  Model.remove(query, function(err){
    console.log("data penghapusan di "+collection);
    if(err) return console.error(err);
  });
}

exports.DBGet = function(param, collection, schema, callback){
  var Model = mongoose.model(collection, schema);

  Model.find(param).exec(function(err, result){
    if(err) throw err;
    return callback(result);
  })
}

exports.QueueAdd = function(task, callback){
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    today = yyyy + '_' + mm + '_' + dd;

    mongodb.MongoClient.connect(mongoQueueDb, function(err, db) {
      var queue = mongoDbQueue(db, 'TASK_'+today);

      queue.add(task, function(err, id) {
          return callback(id);
      });
    })
}

exports.QueueGet = function(task, callback){
  queue.get(function(err, msg) {
      console.log('msg.id=' + msg.id)
      console.log('msg.ack=' + msg.ack)
      console.log('msg.payload=' + msg.payload) // 'Hello, World!' 
      console.log('msg.tries=' + msg.tries)

      return callback(msg);
  })
}

exports.MomentFromUtc = function(time, callback){

  var date = moment(time);
  var dateComponent = date.utc().format('YYYY-MM-DD');
  var timeComponent = date.utc().format('HH:mm:ss');

  return callback(dateComponent+ ' ' +timeComponent);
}

exports.MomentToUtc = function(time, callback){
  //time format = YYYY-MM-DD H:i:s
  return callback(moment(time).toISOString());
}

exports.JobAdd = function(name, job, callback){
  var queue = monqDb.queue(job);

  queue.enqueue(name, { text: 'foobar' }, function (err, job) {
      console.log('enqueued:', job);
  });
}

exports.JobStart = function(name, job, callback){
  var worker = monqDb.worker(job);
  var job_function = {
    cobaemail: function (params, callback) {
        try {
              var reversed = params.text.split('').reverse().join('');
              callback(null, reversed);
          } catch (err) {
              callback(err);
          }
      }
  };

  worker.register(job_function);
  worker.start();

  worker.on('complete', function (data) {
    console.log(data.result);
  });
}

exports.PhantomHtmlToPdf = function(name, html, options, callback){

  var _ph, _page;

  phantom
    .create()
    .then(ph => {
      _ph = ph;
      return _ph.createPage();
    })
    .then(page => {
      _page = page;
      
      return _page.property('content', html, function(error){
          if (error) {
                  console.log('Error setting content: %s', error);
             }
      });
    })
    .then(size => {

      return _page.property('paperSize', {format: options.format, orientation: options.orientation})

    })
    .then(content => {
      
      _page.render(name+'.pdf', function(error){
          console.log('Error generate '+name+'.pdf');
      }).then(render => {
          return callback(name+'.pdf');
          _ph.exit();
      })
    })
    .catch(e => console.log(e));
}

exports.HbsToHtml = function(hbs, option, callback){
  var template = handlebars.compile(source);
  var templateHtml = template(option.data);

  return callback(templateHtml);
}

exports.Html2Pdf = function(name, html, options, callback){
  var pdf = require('html-pdf');
  

  pdf.create(html, options).toFile(name+'.pdf', function(err, res) {
    if (err) return callback(err);
    return callback(res);
  });

  //stream | force download
  // pdf.create(html).toStream(function(err, stream){
  //   stream.pipe(fs.createWriteStream('./foo.pdf'));
  // });
}

exports.TokenCheck = function(token, callback){
  //fungsi untuk mengecek token ke mongodb (mongodb udah ambil dari postgresql)
  var condition = {"remember_token": token};
  exports.DBGet(condition, "users_token", Schema.tokenSchema, function(err, result){
    if(err) return console.error(err);
    return callback(true);
  });
}

exports.DateNow = function(date, exploder){
    if(typeof exploder === 'undefined'){
      var exploder = '_';
    }

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join(exploder);
}

exports.EmailSend = function(emailOption, callback){

    var fs = Promise.promisifyAll(require('fs'));

    fs.readFileAsync('./template/email/' + emailOption.template +'.tbs', 'utf-8')
    .then(function(data){
          var template = handlebars.compile(data);
          var templateHtml = template(emailOption);

          function sendEmail(){
              //sending email
                let transporter = nodemailer.createTransport({
                    host: config.email.host,
                    port: config.email.port,
                    secure: config.email.secure, // true for 465, false for other ports
                    tls: {
                      rejectUnauthorized: false
                  }
                });

                let mailOptions = {
                    from: emailOption.sender, // sender address
                    to: emailOption.receivers, // list of receivers
                    subject: emailOption.subject, // Subject line
                    html: templateHtml, // html body
                    attachments: emailOption.attachments
                };

                transporter.sendMail(mailOptions, (error, info) => { 
                    if (error) {
                        return console.log(error);
                    }

                    var emailLog = {"sender_user_id": emailOption.sender_userid,
                                    "receiver": emailOption.receivers,
                                    "email_subject": emailOption.subject,
                                  };

                    exports.DBConnect('localhost','email_log');
                    exports.DBCreate(emailLog, "log", schema.emailLogSchema, function (result) {
                      if (result) {
                        console.log("send forum success " + result);
                      } else {
                        console.log("send forum " + result);
                      }            
                    });
                    // console.log(mailOptions);
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info.messageId));

                    var result = true;
                
                    return callback(result);        
                });
          }
          
          setTimeout(sendEmail, 1000);
    })
}
