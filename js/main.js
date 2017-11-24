/**
main lstCategories gets set here
*/

function MyClass(response)
{
	this.data = response;
	var lstCategories = this.data.categories;
	this.lstCat = [];
	var i = 0;
	for(i = 0; i< lstCategories.length;i++)
	{
		var name = lstCategories[i].name;
		var morerows = lstCategories[i].bMoreRows;
		var id = lstCategories[i].id;
		var modelLst = lstCategories[i].lstModel;
		var cat = new Categories(id, name, modelLst, morerows);
		this.lstCat[i] = cat;
	}
	this.startIndex = 0;
}

Categories.prototype.ModelLoaded = function (request)
{
	if(request.target.readyState == 4 && request.target.status == 200) 
	{
        var obj = JSON.parse(request.target.responseText);
   
		this.morerows = obj.bMoreRows;
		var models = obj.lstModel;
		
		for(i = this.startIndex, j = 0; i< models.length + this.startIndex; i++, j++)
		{
			var name = models[j].name;
			var mtl = models[j].mtl;
			var obj = models[j].obj;
			var thumb = models[j].thumb;
			var oModel = new Model(name, mtl, obj, thumb);
			this.lstModels[i] = oModel;
		}
		
		//event sent to view to update
		var cEvent = new CustomEvent('update', { detail: {id: this.id} });
		document.dispatchEvent(cEvent);
    }
}


/**
	model to store category name and lst of models in it
*/
function Categories(id, name, modelLst, morerows)
{
	this.id = id;
	this.name = name;
	this.morerows = morerows;
	var models = modelLst;
	this.lstModels = [];
	this.startIndex = 0;
	var i;
	for(i = 0; i< models.length;i++)
	{
		var name = models[i].name;
		var mtl = models[i].mtl;
		var obj = models[i].obj;
		var thumb = models[i].thumb;
		var oModel = new Model(name, mtl, obj, thumb);
		this.lstModels[i] = oModel;
	}
}

/**
	function to get more madels
*/
Categories.prototype.GetMoreModels = function()
{
		this.startIndex += this.lstModels.length;
		var request = new XMLHttpRequest();
		var me = this;
	
		var data = {reqId:2, count:ROW_COUNT, catId:this.id, startIndex: this.startIndex};
		request.onreadystatechange = me.ModelLoaded.bind(me);
		request.open("POST", "", true);
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");  
		request.send(JSON.stringify(data));
}

Categories.prototype.ModelLoaded = function (request)
{
	if(request.target.readyState == 4 && request.target.status == 200) 
	{
        var obj = JSON.parse(request.target.responseText);
   
		this.morerows = obj.bMoreRows;
		var models = obj.lstModel;
		
		for(i = this.startIndex, j = 0; i< models.length + this.startIndex; i++, j++)
		{
			var name = models[j].name;
			var mtl = models[j].mtl;
			var obj = models[j].obj;
			var thumb = models[j].thumb;
			var oModel = new Model(name, mtl, obj, thumb);
			this.lstModels[i] = oModel;
		}
		
		//event sent to view to update
		var cEvent = new CustomEvent('update', { detail: {id: this.id} });
		document.dispatchEvent(cEvent);
    }
}


/**
	model data structure
*/
function Model(name, mtl, obj, thumb)
{
	this.name = name;
	this.mtl = mtl;
	this.obj = obj;
	this.thumb = thumb;
}