'use strict';
module.exports = function (app, db) {
	app.get('/:url', function(req, res){
		var url = req.params.url;
		findURL(url, db, res);
	});
	app.get('/new/:url*', function(req, res){
		// create short url, store and display info
		var url = req.url.slice(5);
		var urlObj = {};
		if(validateURL(url)){
			urlObj = {
				'original_url' : url,
				'short_url' : linkGen()
			};
			res.send(urlObj);
			save(urlObj, db);
		} else {
			 urlObj = {
		        "error": "Wrong url format, make sure you have a valid protocol and real site."
		      };
		      res.send(urlObj);
		}
	});

	function linkGen () {
		var num = Math.floor(10000 + Math.random()*900000);
		return num.toString().substring(0,4);
	}

	function save (obj, db) {
		var sites = db.collection('sites');
		sites.save(obj, function(err, result){
			if(err){ throw err;}
			console.log('Saved : '+result);
		});
	}

	function findURL(link, db, res){
		// check if site is already there
		var sites = db.collection('sites');
		// get url
		sites.findOne({
			"short_url" : link
		}, function(err, result){
			if(err) throw err;
			if(result){
				console.log('Found :'+result);
				console.log('Redirecting to : '+result.original_url);
				res.redirect(result.original_url);
			} else {
				 res.send({
			        "error": "This url is not on the database."
			      });
			}
		})
	}

	function validateURL(url) {
	    // Checks to see if it is an actual url
	    // Regex from https://gist.github.com/dperini/729294
	    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
	    return regex.test(url);
	  }
};




