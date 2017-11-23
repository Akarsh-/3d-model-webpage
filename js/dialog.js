/**
	dialog class to show 3d model dialog
*/
function Dialog(parentDiv)
{	
	this.mainDiv = parentDiv;
	var me = this;
	this.backgroundDiv = document.createElement("div");
	this.backgroundDiv.setAttribute("class", "bgDDiv");
	parentDiv.appendChild(this.backgroundDiv);
	
	this.dialog = document.createElement("div");
	this.dialog.setAttribute("class", "dialog");
	parentDiv.appendChild(this.dialog);
	
	this.crossButton = document.createElement("button");
	this.crossButton.setAttribute("class", "crossbutton");
	this.crossButton.onclick = function() {me.CloseDialog.call(me);};
	this.dialog.appendChild(this.crossButton);
	
	var span = document.createElement("span");
	span.setAttribute("class", "btnText");
	span.innerHTML = "X";
	this.crossButton.appendChild(span);
	
	this.iframe = document.createElement("iframe");
	this.iframe.setAttribute("class", "frame");
	
	
	this.backgroundDiv.style.display = "none";
	this.dialog.style.display = "none";
}

Dialog.prototype.ShowDialog = function(model)
{
	this.backgroundDiv.style.display = "block";
	this.dialog.style.display = "block";
	
	this.dialog.appendChild(this.iframe);
	this.iframe.setAttribute("src", "/testaframe.html");
	
	this.resize();
	
	disableScroll();
	document.body.setAttribute("class", "stop-scrolling");
	document.getElementsByTagName('html')[0].setAttribute("class", "stop-scrolling");
}

Dialog.prototype.CloseDialog = function()
{
	this.dialog.removeChild(this.iframe);
	this.backgroundDiv.style.display = "none";
	this.dialog.style.display = "none";
	enableScroll();
	document.body.removeAttribute("class");
	document.getElementsByTagName('html')[0].removeAttribute("class");
}

Dialog.prototype.resize = function()
{
	var tW= this.mainDiv.offsetWidth;
	var tH = this.mainDiv.offsetHeight;
	
	if(tW < this.dialog.offsetWidth)
		this.dialog.offsetWidth = tW;
	
	var dW = this.dialog.offsetWidth;
	var dH = this.dialog.offsetHeight;
	
	this.dialog.style.top = (tH - dH) / 2;
	this.dialog.style.left = (tW - dW) / 2;
}
