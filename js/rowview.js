/**
this is view which adds one row and image model
*/

var IMG_WIDTH = 165;
function RowView(cat, lstModels, parentDiv, dialog)
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
	var span = document.createElement("span");
	span.setAttribute("class", "btnText");
	span.innerHTML = "<";
	this.leftBtn.appendChild(span);
	this.leftBtn.setAttribute("class", "btn");
	this.leftBtn.onclick = function() {me.onLeftButtonClick.call(me);};
	
	this.rytBtn = document.createElement("button");
	var span = document.createElement("span");
	span.setAttribute("class", "btnText");
	span.innerHTML = ">";
	this.rytBtn.appendChild(span);
	this.rytBtn.setAttribute("class", "btn");
	this.rytBtn.style.right = "100%";
	this.rytBtn.onclick = function() {me.onRightButtonClick.call(me);};
	
	this.mainHoriDiv.appendChild(this.rytBtn);
	this.mainHoriDiv.appendChild(this.leftBtn);
	this.bRequestForUpdationGone = false;
	
	var totalWidth = parentDiv.offsetWidth;
	this.resize(totalWidth);
	this.ShowHideButtons();
	this.dialog = dialog;
}

/**
	this is called when more models are loaded
*/
RowView.prototype.OnUpdate = function(obj)
{
	if(obj.detail.id == this.category.id)
	{
		this.lstModels = this.category.lstModels;
		this.resize(this.nWidth);
		this.bRequestForUpdationGone = false;
		this.ShowHideButtons();
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
	this.sendRequest();

	this.startIndex += this.count;
		
	this.resize(this.nWidth);
	this.ShowHideButtons();
}

RowView.prototype.sendRequest = function()
{
	if(this.category.morerows  == 1)
	{
		this.bRequestForUpdationGone = true;
		this.category.GetMoreModels.call(this.category);
	}
}

RowView.prototype.ShowHideButtons = function()
{
	this.leftBtn.style.display = "block";
	this.rytBtn.style.display = "block";
	
	if(this.startIndex == 0)
		this.leftBtn.style.display = "none";
	if(this.startIndex + this.count >= this.lstModels.length && (this.category.morerows == 0 || this.bRequestForUpdationGone))
		this.rytBtn.style.display = "none";
}

/**
	resize event called to determine row count and item width
*/
RowView.prototype.resize = function(totalWidth) 
{
	var me = this;
	this.nWidth = totalWidth;
	this.modelWidth = IMG_WIDTH;
	this.count = (totalWidth + this.paddingBetween) / (IMG_WIDTH + this.paddingBetween);
	this.count = Math.floor(this.count);
	if(this.count == 0)
		this.count++;

	var nAvaiWidth = this.nWidth - (this.count * (this.paddingBetween));
	this.modelWidth = Math.round(nAvaiWidth / this.count);
	
	var i = 0;
	if(this.count + this.startIndex > this.lstModels.length && this.category.morerows == 0)
	{
		this.startIndex -= (this.count + this.startIndex - this.lstModels.length);
		if(this.startIndex < 0)
			this.startIndex = 0;
	}
	
	for(i = 0 ; i< this.count && i + this.startIndex < this.lstModels.length; i++)
	{
		var div = this.lstDivs[i];
		var div1;
		var div2name;
		if(div == null)
		{
			div = document.createElement("div");
			div.onclick = function() {me.onItemClicked.call(me, this);};
			div.setAttribute("class", "item");
			
			div1 = document.createElement("div");
			div1.setAttribute("class", "imgDiv");
			div.appendChild(div1);
			
			div2name = document.createElement("div");
			div2name.setAttribute("class", "modelName");
			div.appendChild(div2name);
			this.mainHoriDiv.appendChild(div);
			
			div.style.marginBottom = this.paddingBetween;
		
			
			div.style.display = "inline-block";
			
			this.lstDivs[i] = div;
		}
		div1 = div.getElementsByClassName("imgDiv")[0];
		div1.style.background = "url(" + this.lstModels[i + this.startIndex].thumb + ")";
		div1.style.width = this.modelWidth + "px";
		
		div2name = div.getElementsByClassName("modelName")[0];
		div2name.innerHTML = this.lstModels[i + this.startIndex].name;
		if(i != this.count -1)
			div.style.marginRight = this.paddingBetween;
		else
			div.style.marginRight = 0;
	}
	
	var uCountToBeSubTracted = this.count;;
	if(i + this.startIndex >= this.lstModels.length)
	{
		uCountToBeSubTracted = i ;
	}
	
	for(i = this.lstDivs.length - 1; i >= uCountToBeSubTracted && i >= 0; i--)
	{
		this.mainHoriDiv.removeChild(this.lstDivs[i]);
		this.lstDivs.splice(i,1);
	}
	
	if(this.count > this.lstModels.length && this.category.morerows == 1)
	{
		this.sendRequest();
		this.ShowHideButtons();
	}
	
	var rH = this.mainHoriDiv.offsetHeight;
	var rT = this.mainHoriDiv.offsetTop;
	this.leftBtn.style.top = rT + (rH - 48) / 2;
	this.leftBtn.style.left = "0px";
	this.rytBtn.style.top = rT + (rH - 48) / 2;
	this.rytBtn.style.right = "0px";
}

RowView.prototype.onItemClicked = function(obj)
{
	var index = 0;
	for(var i =0; i< this.lstDivs.length; i++)
	{
		if(obj == this.lstDivs[i])
		{
			index = i + this.startIndex;
			break;
		}
	}
	
	var model = this.lstModels[index];
	this.dialog.ShowDialog(model);
}