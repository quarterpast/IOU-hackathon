GeocodeResults = new Meteor.Collection('geocode');
SchoolData = new Meteor.Collection('schools');

var lastRequest = Date.now();

function geocodeAddress(addressString, geocodeCallback) {
	//convert the result to a latlng instead of the horrible crap that google sends back
	var timeSinceLast = Date.now() - lastRequest;
	if(timeSinceLast < 400) {
		return Meteor.setTimeout(function() {
			geocodeAddress(addressString, geocodeCallback);
		}, 400-timeSinceLast);
	} else {
		lastRequest = Date.now();
		Meteor.http.get(
			"http://api.geonames.org/postalCodeLookupJSON",
			{params:{
				placename:addressString,
				country:'GB',   // restricts to results in UK
				isReduced:true, // increases rank of exact text match
				username:'quarterto'
			}},
			function(err,result) {
				console.log(result, err);
				var len = result.data.postalcodes.length;
				if(err || len === 0)
				{
					geocodeCallback(err);
					return;
				}
				
				var idx = Math.floor(Math.random()*len); // random results to spread out the blobs
				console.log(result.data);
				geocodeCallback(null,{
					Ya: result.data.postalcodes[idx].lat,
					Za: result.data.postalcodes[idx].lng
				});
			}
		);
	}
}