if (Meteor.isClient) {
	
	
	
	function pinSchool(schoolAddress, clickCallback) {
		var pinImage = google.maps.MarkerImage('/schoolIcon.png',new google.maps.Size(16,16), new google.maps.Point(0,0), new google.maps.Point(16,16));
		var addedPin = new google.maps.Marker({position: schoolAddress,map: map, icon: pinImage});
		google.maps.event.addListener(addedPin, 'click', clickCallback);
	}
	
	function pinJob(latLng, clickCallback) {
		var pinImage = google.maps.MarkerImage('/jobIcon.png',new google.maps.Size(16,16), new google.maps.Point(0,0), new google.maps.Point(16,16));
		var addedPin = new google.maps.Marker({position: latLng,map: map, icon: pinImage});
		google.maps.event.addListener(addedPin, 'click', clickCallback);
	}
	
	function pinLocation(latLng, clickCallback) {
		var pinImage = google.maps.MarkerImage('/favicon.png',new google.maps.Size(16,16), new google.maps.Point(0,0), new google.maps.Point(16,16));
		var addedPin = new google.maps.Marker({position: latLng, map: map, icon: pinImage});
		google.maps.event.addListener(addedPin, 'click', clickCallback);
	}
	
	Template.map.rendered = function initialize() {
		
		Meteor.flush();
		
		//set up the main variables here....
		var greenwich = new google.maps.LatLng(51.46,0.2);
		
		var mapOptions = {
					center: greenwich,
					zoom: 8,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
		
		geocodr = new google.maps.Geocoder();
		
		Meteor.call('getSchools',function(schools) {
			console.log(schools);
		});
		
		//start up import.io link
		io = new importio(function(){});
		
		map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);

		var location = "Norwich";
		geocodeAddress(location, function(latLng) {
			console.log(location, latLng);
			
			pinLocation(latLng, function() {
				//Hi brennan, look at google.maps.InfoWindow here for displaying data.... http://www.evoluted.net/thinktank/web-development/google-maps-api-v3-custom-location-pins
				alert("you clicked the box, biatch");
			});
		});	
	};
}