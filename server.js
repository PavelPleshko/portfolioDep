var express=require('express');
var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var compression = require('compression');
var cors = require('cors');
var helmet = require('helmet');
var assisters = require('./helpers/lib');
var app=express();
var PORT = 8080;
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(compression());

var smtpTransport = nodemailer.createTransport({
    service: "yandex",
    host: "smtp.yandex.ru",
    port:465,
    auth: {
        user: process.env.CLIENT_EMAIL,
        pass: process.env.CLIENT_PASSWORD
    }
});
var oneYear = 1 * 365 * 24 * 60 * 60 *1000;
app.use(express.static(__dirname + '/public',{maxAge:oneYear}));
app.get('/*',(req, res) => {  
  res.sendFile(__dirname+'/public/index.html');
});



app.post('/send',function(req,res){
var mailOpts = {
	to:process.env.EMAIL_TO,
	subject:req.body.name + " left a message from portfolio website",
	from:process.env.CLIENT_EMAIL,
	text:assisters.createMsg(req.body),
	html:assisters.createHtml(req.body)
}
smtpTransport.sendMail(mailOpts,function(response,error){
	if(error){
		res.json(error);
	}else{
		res.json(response);
	}
})
})




app.listen(PORT,function(){
console.log("Server started on Port "+PORT);
});


