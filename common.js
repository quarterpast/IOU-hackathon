GeocodeResults = new Meteor.Collection('geocode');
SchoolData = new Meteor.Collection('schools');

function geocodeAddress(addressString, callback) {
	//convert the result to a latlng instead of the horrible crap that google sends back
	Meteor.http.get(
		"http://nominatim.openstreetmap.org/search",
		{query:{q:addressString,format:'json'}},
		function(result) {
			callback({Ya:result.data[0].lat,Za:result.data[0].lon});
		}
	);
}