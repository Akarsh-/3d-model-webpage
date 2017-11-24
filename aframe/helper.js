	window.onmessage = function (e)
	{
		console.log("hello");
		var msg = JSON.parse(e.data);
		setImage(msg.thumb, msg.obj, msg.mtl);
	}
	function setImage(imgurl, objurl, mtlurl)
	{
		document.getElementById("imgId").setAttribute("src", imgurl);
		document.getElementById("object").setAttribute("src",objurl);
		document.getElementById("material").setAttribute("src", mtlurl);
	}