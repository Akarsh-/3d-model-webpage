var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 


var pool  = mysql.createPool({
	connectionLimit : 5,
	host: "b8f5j5ecq-mysql.services.clever-cloud.com",
	user: "uklr9t0l9gc9rvu6",
	password: "Jfi0SxbJdiLATy3gI82v",
	database: "b8f5j5ecq"
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
app.get('/dialog.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/js/dialog.js'));
});
app.get('/rowview.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/js/rowview.js'));
});
app.get('/proj.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/material/proj.css'));
});
app.get('/testaframe.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/aframe/testaframe.html'));
});
app.get('/Cabbage_01.obj', function(req, res) {
	 res.sendFile(path.join(__dirname + '/material/Cabbage_01.obj'));
});
app.get('/Cabbage_01.mtl', function(req, res) {
	 res.sendFile(path.join(__dirname + '/material/Cabbage_01.mtl'));
});
app.get('/touch.js', function(req, res) {
	 res.sendFile(path.join(__dirname + '/js/touch.js'));
});


app.post('', function(req, res) {
    var reqId = req.body.reqId;
	
	switch(reqId)
	{
		case 1:
			GetInitData(req, res);
			break;
		case 2:
			GetCategoriesModel(req, res);
			break;
	}
	
});

function GetInitData(req, res)
{
	var COL_COUNT = 5;
	var strQuery = 'CALL uspGetInitData(5)';
		
	pool.getConnection(function(err, con) {
		if(err)
		{
			console.log("cannot connect to db");
			return;
		}
				
		con.query(strQuery, function (err, result) {
		con.release();
		var finalRes = {};
		if (err) 
		{
			console.log("error while getting init data");
			res.send(finalRes);
			return;
		}
		console.log(result[0][0]);				
		var lstCategory = [];
		
		var lstTotalCount = result[0];
		
		var objResult = result[1];
		var curCatId = -1;
		var j = 0;
		var category;
		
		for(var i =0; i< objResult.length; i++)
		{
			var model = {};
			if(curCatId != objResult[i]["ucatid"])
			{
				if(category != null)
				{
					lstCategory[j] = category;
					j++;
				}
				curCatId = objResult[i]["ucatid"];
				
				category = new Object();
				category.name = objResult[i]["strcatname"];
				category.id = objResult[i]["ucatid"];
				category.bMoreRows = lstTotalCount[j]["totalmodels"] > COL_COUNT;
				category.lstModel = [];
			}
			 model.name = objResult[i]["strmodelname"];
			 model.obj = objResult[i]["strmodelobj"];
			 model.mtl = objResult[i]["strmodelmtl"];
			 model.thumb = objResult[i]["strmodelthumb"];
			 category.lstModel.push(model);
			 
			 if(i == objResult.length - 1)
				 lstCategory[j] = category;
		}
		
		finalRes.categories = lstCategory;
		res.send(finalRes);
					
		});
	});
}

function GetCategoriesModel(req, res)
{
	var catId = req.body.catId;
	var startIndex = req.body.startIndex;
	var nCount = req.body.count;
	var strQuery = "CALL uspGetModels(" + catId + "," + startIndex + "," + nCount + ")";
	
	pool.getConnection(function(err, con) {
		if(err)
		{
			console.log("cannot connect to db");
			return;
		}
		
			var result = {};
		con.query(strQuery, function(err, models) {
			con.release();
			if(err)
			{
				console.log("error while getting model for category" + catId);
				res.send(result);
			}
			
			result.bMoreRows = models[0][0].morerows;
			result.lstModel = models[1];
			res.send(result);
		});
	});
}



console.log("listening on port 8080");

app.listen(8080);
