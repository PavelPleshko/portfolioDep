var express=require('express');
var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var compression = require('compression');
var credentials = require('./environment/environment').mailCredentials;
var cors = require('cors')
var assisters = require('./helpers/lib');
var app=express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
app.use(cors());
app.use(compression());

var smtpTransport = nodemailer.createTransport({
    service: "yandex",
    host: "smtp.yandex.ru",
    port:465,
    auth: {
        user: credentials.email,
        pass: credentials.pass
    }
});
var oneYear = 1 * 365 * 24 * 60 * 60 *1000;
app.use('/',express.static(__dirname + '/public',{maxAge:oneYear}));
app.get('/',(req, res) => {  
  res.sendFile(__dirname+'/public/index.html');
});



app.post('/send',function(req,res){
	console.log(req.body);
var mailOpts = {
	to:credentials.to,
	subject:req.body.name + " left a message from portfolio website",
	from:credentials.email,
	text:assisters.createMsg(req.body),
	html:assisters.createHtml(req.body)
}
smtpTransport.sendMail(mailOpts,function(response,error){
	if(error){
		console.log(error);
		res.json(error);
	}else{
		console.log(response);
		res.json(response);
	}
})
})




app.listen(8080,function(){
console.log("Express Started on Port 3000");
});


