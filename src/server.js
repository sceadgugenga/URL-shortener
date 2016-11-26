var express = require('express')
var app = express()
var path = require('path')
var getinfo = require('./getinfo')
var displayHome = require("./displayhome")
var MongoClient = require('mongodb').MongoClient
var validate = require('validate.js')
const url = require('url')
var db
var dbName = "urls"
//var hostLoc = "mongodb://localhost/"
var hostLoc = "mongodb://anon:ihavenopass@ds049997.mlab.com:49997/"

//connect to database
MongoClient.connect(hostLoc + dbName, function(err, database) {
	if (err) throw err;
	db = database;

	// setting static diirectory to serve css and usage file
	app.use(express.static(path.resolve(__dirname, '../', 'public')))

	// sets empty path to direct to usage file
	app.get('/', function(req, res) {
		res.sendFile(path.resolve(__dirname, '../', 'public', 'index.html'))
	})


	app.use(function(req, res) {

		var originalURL;

		//Parses the Original url from the path
		originalURL = url.parse(req.url).pathname

		//Removes leading '/''
		originalURL = decodeURIComponent(originalURL).slice(1)


		//This protects against processing favicon calls
		if (originalURL !== 'favicon.ico') {


			// This validates the 'cleaned' url	passed from address bar
			// this uses the validate.js library
			var myValidURL = validate({
				website: cleanURL(originalURL)
			}, {
				website: {
					url: true
				}
			})

			//If the validation has no errors then null is passed.
			//This checks is there was a validation error
			if (!myValidURL) {

				// Check the database for the url
				getOriginalURLFromDB(cleanURL(originalURL), function(err, collect) {
					if (err) {
						console.log("Error getting original_url from db: " + err)
					}
					if (collect) {

						//send the stored info to screen
						res.send(collect)
					} else {

						//generate a new short url
						makeUniqueShortURL(function(err, result) {
							if (err) {
								console.log("Error creating short url: " + err)
							}
							if (result) {
								var fullDoc = {
									"original_url": cleanURL(originalURL),
									"short_url": result
								}
								res.send(fullDoc)
								addURLsToDB(fullDoc)
							}
						})
					} //end else
				})
			} else {

				//if the usr is not valid then check to see if it is
				// a short url in the database
				getShortURLFromDB(originalURL, function(err, collect) {
					if (err) {
						console.log("Error getting short_url from db: " + err)
					}
					if (collect) {
						var redirURL = collect.original_url
							// redirect short URL to Original URL
						res.writeHead(301, {
							Location: redirURL
						})
						res.end()
					} else {

						//if it is not a short url in the database, assume that
						//it is not a valid url
						notValid(res)
					}
				})
			}
		}
	})

	app.listen(process.env.PORT || 3000, function() {
		console.log('URL Shortener Microservice listening on port 3000!')
	})
})


/**
 * @param  {obj} this a result object from Express
 * @return {None} This doesn't return a value but executes a sent command to display
 * null values for the orignial and short urls.
 */
function notValid(res) {
	res.send({
		"original_url": null,
		"short_url": null
	})
}

/**
 * @param  {url} This is a url
 * @return {String} url with http:// at the beginning
 */
function cleanURL(url) {
	if (url.includes("http") == false) {
		//console.log("81: "+ url.split(0, 4))
		url = "http://" + url
	}
	return url
}



/**
 * Check the database for short url
 * 
 * @param  {string} url
 * @param  {Function} callback function
 * @return {None} this function exectues the callback function 
 * to handle results of query. If no item is found in database, callback
 * is passed a null value.
 * 
 */
function getShortURLFromDB(url, cb) {
	db.collection('urls').findOne({
		short_url: {
			$eq: url
		}
	}, function(err, item) {
		if (err) cb(err, null)
			//	console.dir("96| " + item)
		if (item == null) {
			cb(null, false)
		} else {
			cb(null, item)
		}
	})
}



/**
 * Check the database for original url
 * 
 * @param  {string} url
 * @param  {Function} callback function
 * @return {None} this function exectues the callback function 
 * to handle results of query. If no item is found in database, callback
 * is passed a null value.
 * 
 */
function getOriginalURLFromDB(url, cb) {
	db.collection('urls').findOne({
		original_url: {
			$eq: url
		}
	}, {
		'_id': 0
	}, function(err, item) {
		if (err) cb(err, null)
		if (item == null) {
			cb(null, false)
		} else {
			cb(null, item)
		}
	})
}


/**
 * Adds url paris to database
 * 
 * @param {object} Object contains original_url and sort_url
 */
function addURLsToDB(urls) {
	db.collection('urls').insert(urls, {
		w: 1
	}, function(err, result) {
		if (err) {
			return console.dir(err)
			console.log(urls + " added to database.")
		}
	})
}



/**
 * Generates a unique short URL and checks results against database 
 * to ensure value is unquie. If value is not unique, then a new short
 * url is generated.
 * 
 * @param  {Function} Callback funtion
 * @return {None} The callback function is called to process unique url
 */
function makeUniqueShortURL(cb) {
	var newShortURL = getinfo.createShortURL(7)
	var loop = true

	getShortURLFromDB(newShortURL, function(err, obj) {
		while (loop) {

			if (obj == false) {
				cb(null, newShortURL)
				loop = false
			} else {
				console.log("157: obj: " + obj)
				setTimeout(function() {}, 0)
				newShortURL = getinfo.createShortURL(7)
			}
		}
	})

}