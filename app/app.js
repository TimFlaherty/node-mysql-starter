var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var mysql = require('mysql');

//Enter db credentials here as ('mysql://username:password@host/database'):
var connection = mysql.createConnection('mysql://root@localhost/testdb');

//Declare app
var app = express();

//bodyParser to interpret POST data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Declare database connection
connection.connect(function(err) {
	if (err) throw err
});

//Send last entry in database as string (explicitly calling columns)
app.get('/last', function (req, res) {
	connection.query('SELECT * FROM person ORDER BY id DESC LIMIT 1', function(err, rows, fields)   
	{  
		if (err) throw err;  
		res.send(rows[0].id+' '+rows[0].fname+' '+rows[0].lname); 
	});
});

//Send all rows in 'person' as an array (explicitly calling columns)
app.get('/disp', function (req, res) {
	connection.query('SELECT * FROM person', function(err, rows, fields) {  
		var rowray = [];
		var colray = [];
		if (err) throw err; 
		for (i=0;i<rows.length;i++) {
			colray.push(rows[i].id); 
			colray.push(rows[i].fname); 
			colray.push(rows[i].lname); 
			rowray.push(colray);
			colray = [];
		};
		res.send(rowray);
	});
});

//Add user to database
app.post('/add',function(req,res){
	var fname=req.body.first;
	var lname=req.body.last;
	connection.query('INSERT INTO person (fname, lname) VALUES ("'+fname+'", "'+lname+'");', function(err, rows, fields)
	{
		if(err) throw err;
	});
	res.end();
});

//Static file server
app.use(serveStatic('public', {'index': ['index.html', 'index.htm']}));

app.listen(3000);

//Serve to local network on port 8000:
//app.listen(8000, 'your.local.ip.address');
