var express = require('express'); 
var path = require('path'); 
var enforce = require('express-sslify');
var app = express(); 
 
// Use enforce.HTTPS({ trustProtoHeader: true }) in case you are behind
// a load balancer (e.g. Heroku). See further comments below

app.use(enforce.HTTPS({trustProtoHeader:true}));

// app.use(express.static(path.resolve(__dirname, 'www'))); 
app.use(express.static(__dirname + '/www'));
app.set('port', process.env.PORT || 3000); 

app.get('/*', function(req,res) {
	res.sendFile(path.join(__dirname+'/www/index.html'));
});


app.listen(app.get('port'), ()=>{
	console.log('listening to port', app.get('port')); 
});

 
