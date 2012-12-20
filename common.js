GeocodeResults = new Meteor.Collection('geocode');
SchoolData = new Meteor.Collection('schools');

function geocodeAddress(addressString, callback) {
	if(callback==null)
		console.log(arguments.callee.caller.toString());
	else
	{
		console.log(callback);
		return;
	}
	//convert the result to a latlng instead of the horrible crap that google sends back
	Meteor.http.get(
		"http://api.geonames.org/postalCodeSearchJSON",
		{params:{
			placename:addressString,
			country:'GB',   // restricts to results in UK
			isReduced:true, // increases rank of exact text match
			username:'quarterto'
		}},
		function(err,result) {
			var len = result.data.postalCodes.length;
			console.log(addressString,callback);
			if(err || len === 0) 
				return callback(err);
			
			var idx = Math.floor(Math.random()*len); // random results to spread out the blobs
			return callback(null,{
				Ya: result.data.postalCodes[idx].lat,
				Za: result.data.postalCodes[idx].lon
			});
		}
	);
}