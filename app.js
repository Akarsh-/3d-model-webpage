var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

var INITIAL_VALUE = 2;


var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "applicationdb"
});

con.connect(function(err) 
{
	if (err) 
	{
		console.log("cannot connect to db");
	}
	console.log("connectin established");
});
		

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/start.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/js/start.js'));
});
app.get('/main.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/js/main.js'));
});
app.get('/mainView.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/js/mainView.js'));
});
app.get('/file.json', function(req, res) {
    res.sendFile(path.join(__dirname + '/json/file.json'));
});

app.post('', function(req, res) {
    var reqId = req.body.reqId;
	//res.setHeader('Content-Type', 'text/plain');
    
	
	if(reqId == 1)
	{
		var strQuery = 'CALL uspGetCategories(2)';
		
		con.query(strQuery, function (err, result) {
			
			if (err) 
			{
				console.log("error while getting categories");
				return;
			}
							
			var lstCategory = [];
			GetModels(lstCategory, result[0][0].ucatid, 0, result[0], res);
						
		});
	}
	else if(reqId == 2)
	{
		var catId = req.body.catId;
		var startIndex = req.body.startIndex;
		var nCount = req.body.count;
		var strQuery = "CALL uspGetModels(" + catId + "," + startIndex + "," + nCount + ")";
		
		con.query(strQuery, function(err, models) {
		if(err)
		{
			console.log("error while getting model for category" + catId);
			return;
		}
		
		var result = {};
		result.morerows = models[0][0].morerows;
		result.models = models[1];
		res.send(result);
		});
	}
	
	
});


function GetModels(lstCategory, catid, index, result, res)
{
	//at start getting minimum 6 count
	strQuery = 'CALL uspGetModels(' + catid + ',0, 6)';
	con.query(strQuery, function(err, models) {
		if(err)
		{
			console.log("error while getting model for category" + catid);
			return;
		}
		var cat = {};
		cat.name = result[index].strcatname;
		cat.id = result[index].ucatid;
		cat.morerows = models[0][0].morerows;
		cat.models = models[1];
		lstCategory.push(cat);
		
		if(index == result.length - 1)
		{
			var finalRes = {};
			finalRes.categories = lstCategory;
	
			res.send(finalRes);
			
		}
		else
		{
			index++;
			var newCatId= result[index].ucatid;
			GetModels(lstCategory, newCatId, index, result, res);
		}
	});
}



console.log("listening on port 3000");

app.listen(3000);