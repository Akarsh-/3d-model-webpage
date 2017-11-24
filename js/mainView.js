/*
	this is view in which i add categories name
	and initialises adding of categories model
*/
function MyView(myModel, parentDiv, dialog)
{
	this.model = myModel;
	this.lstRows = [];
	var i = 0;
	var lstCat = myModel.lstCat;
	for(i = 0; i< lstCat.length; i++)
	{
		var divCatName = document.createElement("div");
		divCatName.innerHTML = lstCat[i].name;
		divCatName.setAttribute("class", "catName");
		parentDiv.appendChild(divCatName);
		var rowView = new RowView(lstCat[i], lstCat[i].lstModels, parentDiv, dialog);
		this.lstRows[i] = rowView;
		
		if(i == 0)
		{
			divCatName.style.marginTop ="16px";
		}
	}
}

MyView.prototype.setStartPos0 = function(width)
{
	var i = 0;
	for(i = 0; i< this.lstRows.length; i++)
	{
		this.lstRows[i].startIndex = 0;
	}
}

MyView.prototype.resize = function(width)
{
	var i = 0;
	for(i = 0; i< this.lstRows.length; i++)
	{
		this.lstRows[i].resize(width);
		this.lstRows[i].ShowHideButtons();
	}
}



