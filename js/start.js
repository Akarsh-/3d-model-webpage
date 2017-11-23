var ROW_COUNT = 6;

function start()
{
	var request = new XMLHttpRequest();
	var me = this;
	
   var data = {reqId:1};
   //request.open("GET", "file.json", true);
   request.onreadystatechange = me.FileLoaded.bind(me);
   request.open("POST", "", true);
   request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");  
   request.send(JSON.stringify(data));
   
   window.setInterval(function() {me.resize()}, 300);
   this.mainDiv = document.getElementById("maindiv");
   this.width = this.mainDiv.offsetWidth;
}

start.prototype.FileLoaded = function(request)
{
    if(request.target.readyState == 4 && request.target.status == 200) 
	{
        var my_JSON_object = JSON.parse(request.target.responseText);
   
		this.dialog = new Dialog(this.mainDiv);
		var myModel = new MyClass(my_JSON_object);
		
		this.myView = new MyView(myModel, this.mainDiv, this.dialog);
    }
}

start.prototype.resize = function()
{
	if(this.width != this.mainDiv.offsetWidth)
	{
		this.width = this.mainDiv.offsetWidth;
		if(this.myView != null)
		{
			this.dialog.resize();
			this.myView.setStartPos0();
			this.myView.resize(this.width);
			this.dialog.re
		}
	}
}