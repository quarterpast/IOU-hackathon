GeocodeResults = new Meteor.Collection('geocode');
SchoolData = new Meteor.Collection('schools');
SidebarData = new Meteor.Collection('sidebar');

var lastRequest = Date.now();

function geocodeAddress(addressString, geocodeCallback) {
	var geocoder = new google.maps.Geocoder();
	//convert the result to a latlng instead of the horrible crap that google sends back
	var timeSinceLast = Date.now() - lastRequest;
	if(timeSinceLast < 1100) {
		return Meteor.setTimeout(function() {
			geocodeAddress(addressString, geocodeCallback);
		}, 1100-timeSinceLast);
	} else {
		lastRequest = Date.now();
		geocoder.geocode({'address':addressString}, function(results, status)
			{
				console.log(results, status);
				
				if(status!=google.maps.GeocoderStatus.OK)
				{
					//geocodeCallback(status || {error:"nothing returned lol"});
					
				}
				else
				{
					var idx = Math.floor(Math.random()*results.length); // random results to spread out the blobs
	//				console.log(results.data);
					geocodeCallback(null,{
						Ya: results[idx].geometry.location.Ya,
						Za: results[idx].geometry.location.Za
					});
				}
			
			
			}
		);
	}
}