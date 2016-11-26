module.exports = {
	
	createShortURL: function (length) {
	var alphaNum;
	var newURL = ""
	var min
	var max
	
	for (var x=0;x<length;x++) {
	alphaNum = Math.floor(Math.random() * (Math.floor(3)- Math.ceil(1)) +  Math.ceil(1))
	//console.log(alphaNum)
	switch (alphaNum) {
		case 1:
		min = Math.ceil(48)
		max = Math.floor(57)
		
		break
		case 2:
		min = Math.ceil(65)
		max = Math.floor(90)
		break
		
		case 3:
		min = Math.ceil(97)
		max = Math.floor(122)
		
		
		break
		
	}
	newURL += String.fromCharCode(Math.floor((Math.random() * (max - min) + min)))
	
	}
	return newURL
}
}