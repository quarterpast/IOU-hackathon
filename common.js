GeocodeResults = new Meteor.Collection('geocode');
SchoolData = new Meteor.Collection('schools');

function geocodeAddress(addressString, callback) {
	//convert the result to a latlng instead of the horrible crap that google sends back
	Meteor.http.get(
		"http://nominatim.openstreetmap.org/search",
		{params:{q:addressString,format:'json',countrycodes:'gb',emailaddress:'matt@relocatr.co.uk'}},
		function(err,result) {
			if(err) callback(err);
			callback(null,{Ya:result.data[0].lat,Za:result.data[0].lon});
		}
	);
}