function MyView(myModel, parentDiv)
{
	this.model = myModel;
	this.lstRows = [];
	var i = 0;
	var lstCat = myModel.lstCat;
	for(i = 0; i< lstCat.length; i++)
	{
		var div = document.createElement("div");
		div.innerHTML = lstCat[i].name;
		parentDiv.appendChild(div);
		var rowView = new RowView(lstCat[i], lstCat[i].lstModels, parentDiv);
		this.lstRows[i] = rowView;
	}
}

MyView.prototype.resize = function(width)
{
	var i = 0;
	for(i = 0; i< this.lstRows.length; i++)
	{
		this.lstRows[i].resize(width);
	}
}

var IMG_WIDTH = 300;
function RowView(cat, lstModels, parentDiv)
{
	this.category = cat;
	var me = this;
	this.mainHoriDiv = document.createElement("div");
	document.addEventListener('update', function (e) {me.OnUpdate.call(me, e);});
	
	this.mainHoriDiv.setAttribute("class", "rowView");
	parentDiv.appendChild(this.mainHoriDiv);
	this.modelWidth = IMG_WIDTH;
	this.paddingBetween = 16;
	this.lstModels = lstModels;
	this.startIndex = 0;
	this.count = 0;
	this.lstDivs = [];
		
	this.leftBtn = document.createElement("button");
	
	this.leftBtn.setAttribute("class", "btn");
	this.leftBtn.onclick = function() {me.onLeftButtonClick.call(me);};
	
	this.rytBtn = document.createElement("button");
	this.rytBtn.setAttribute("class", "btn");
	this.rytBtn.style.right = "100%";
	this.rytBtn.onclick = function() {me.onRightButtonClick.call(me);};
	
	this.mainHoriDiv.appendChild(this.rytBtn);
	this.mainHoriDiv.appendChild(this.leftBtn);
	
	
	var totalWidth = parentDiv.offsetWidth;
	this.resize(totalWidth);
	this.ShowHideButtons();
}

RowView.prototype.OnUpdate = function(obj)
{
	if(obj.detail.id == this.category.id)
	{
		this.lstModels = this.category.lstModels;
		this.resize(this.nWidth)
	}
}


RowView.prototype.onLeftButtonClick = function()
{
	this.startIndex -= this.count;
	if(this.startIndex < 0)
		this.startIndex = 0;
	this.resize(this.nWidth);
	this.ShowHideButtons();
}

RowView.prototype.onRightButtonClick = function()
{
	if(this.category.morerows  == 1)
	{
		this.category.GetMoreModels.call(this.category);
	}

	this.startIndex += this.count;
	this.resize(this.nWidth);
	this.ShowHideButtons();
}

RowView.prototype.ShowHideButtons = function()
{
	this.leftBtn.style.display = "block";
	this.rytBtn.style.display = "block";
	
	if(this.startIndex == 0)
		this.leftBtn.style.display = "none";
	if(this.startIndex + this.count >= this.lstModels.length)
		this.rytBtn.style.display = "none";
}

RowView.prototype.resize = function(totalWidth) 
{
	this.nWidth = totalWidth;
	this.modelWidth = IMG_WIDTH;
	this.count = totalWidth / (IMG_WIDTH + this.paddingBetween);
	this.count = Math.floor(this.count);
	var diff = totalWidth - (this.count * (IMG_WIDTH + this.paddingBetween)) + this.paddingBetween;
	var extraWidth = Math.floor(diff / this.count);
	this.modelWidth += extraWidth;
	var i;
	for(i = 0 ; i< this.count && i + this.startIndex < this.lstModels.length; i++)
	{
		var div = this.lstDivs[i];
		var div1;
		if(div == null)
		{
			div = document.createElement("div");
			div.setAttribute("class", "item");
			div1 = document.createElement("div");
			div1.setAttribute("class", "imgDiv");
			div.appendChild(div1);
			this.mainHoriDiv.appendChild(div);
			
			
			div.style.marginBottom = this.paddingBetween;
		
			
			div.style.display = "inline-block";
			
			this.lstDivs[i] = div;
		}
		div1 = div.getElementsByClassName("imgDiv")[0];
		div1.style.background = "url(" + this.lstModels[i + this.startIndex].thumb + ")";
		div1.style.width = this.modelWidth + "px";
		if(i != this.count -1)
			div.style.marginRight = this.paddingBetween;
		else
			div.style.marginRight = 0;
	}
	
	for(i = this.lstDivs.length - 1; i >= this.count && i >= 0; i--)
	{
		this.mainHoriDiv.removeChild(this.lstDivs[i]);
		this.lstDivs.splice(i,1);
	}
	
	var rH = this.mainHoriDiv.offsetHeight;
	var rT = this.mainHoriDiv.offsetTop;
	this.leftBtn.style.top = rT + (rH - 48) / 2;
	this.leftBtn.style.left = "0px";
	this.rytBtn.style.top = rT + (rH - 48) / 2;
	this.rytBtn.style.right = "0px";
}



