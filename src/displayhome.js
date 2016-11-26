
module.exports =  function () {

    
	var retStr = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>'

    retStr += '.code { \
	background-color: #EEE;\
    display: inline;\
    font-family: monospace;\
    padding: 1px 5px;\
    white-space: pre;\
    width: auto;\
    white-space: pre-wrap;\
    white-space: -moz-pre-wrap;\
    white-space: -pre-wrap;\
    white-space: -o-pre-wrap;\
    word-wrap: break-word;\
}	</style></head>'
    retStr += "<title>URL Shortener Microservice </title></head><body>"
retStr += "<h1>URL Shortener Microservice </h1>"

	retStr += "<p>This Microservice returns a an object that contains the orginal url as well as a shortened url.</p>"
	
	//retStr += "<h2>Usage</h2>"
	
    retStr += "<p><h2>Creating URL</h2>"
    retStr += "<p class='code'>"+ "www.mydomain.com" +"/"+ "www.google.com" +"</p></p>"
	
	retStr += "<p><h2>Output</h2></p>"
	retStr += '<p  class="code">{"original url:"' + '"'+'www.google.com'+'", "short url:" "'+'0C62KE6'+'"}</p>'
    retStr += "<p><h2>Using Shortened URL</h2></p>"
	 retStr += "<p class='code'>"+ "www.mydomain.com" +"/"+"0C62KE6" +"</p></p>"
	 
	 retStr += "<p></p><p><h2>Redirects To</h2></p>"
	 retStr += "<p class='code'>"+'www.google.com' +"</p>"
      retStr += "</body></html>"
	 
return retStr
}