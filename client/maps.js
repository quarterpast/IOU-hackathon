if(Meteor.isClient) {

	var cachecount = 0;

	function getSchools(callback) {
		_.each("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''), function(nextChar) {
			Meteor.http.get("https://data.kusiri.com/search/q/55938856-2557-4c6e-92ae-0bd94f3a29c9?q=" + nextChar, {
				headers: {
					"Authorization": "Basic bmljay5zY290dEBpbXBvcnQuaW86TmV5ZmVyITExMw=="
				}
			}, function(err, schoolRequest) {
				if(err) {
					console.log("error");
					return;
				}
				console.log(schoolRequest);

				_.each(schoolRequest.data.results, function(result) {
					if(result.location.address.toLowerCase().indexOf("london") >= 0 || result.location.address.toLowerCase().indexOf("nottingham") >= 0) {

						//console.log("looking for cache result", result.title);
						if(SchoolData.findOne({
							"title": result.title
						}) !== null) {
							//do nothing here
							console.log("found in cache " + result.title);
							cachecount++;
						} else {
							geocodeAddress(_.last(result.location.address.split(',')), function(err, latLng) {
								if(err) {
									console.log(err);
									return;
								} else {
									console.log(cachecount);
									console.log("inserting school " + result.location.address + " geocode: " + latLng);
									SchoolData.insert({
										title: result.title,
										latLng: latLng
									});
								}
							});
						}
					}
				});
			});
		});
	}

	function pinSchool(schoolAddress, clickCallback) {
		var pinImage = google.maps.MarkerImage('/schoolIcon.png', new google.maps.Size(16, 16), new google.maps.Point(0, 0), new google.maps.Point(16, 16));
		var addedPin = new google.maps.Marker({
			position: schoolAddress,
			map: map,
			icon: pinImage
		});
		google.maps.event.addListener(addedPin, 'click', clickCallback);
	}

	function pinJob(latLng, clickCallback) {
		var pinImage = google.maps.MarkerImage('/jobIcon.png', new google.maps.Size(16, 16), new google.maps.Point(0, 0), new google.maps.Point(16, 16));
		var addedPin = new google.maps.Marker({
			position: latLng,
			map: map,
			icon: pinImage
		});
		google.maps.event.addListener(addedPin, 'click', clickCallback);
	}

	function pinLocation(latLng, clickCallback) {
		var pinImage = google.maps.MarkerImage('/favicon.png', new google.maps.Size(16, 16), new google.maps.Point(0, 0), new google.maps.Point(16, 16));
		var addedPin = new google.maps.Marker({
			position: latLng,
			map: map,
			icon: pinImage
		});
		google.maps.event.addListener(addedPin, 'click', clickCallback);
	}

	Template.map.rendered = function initialize() {

		Meteor.flush();

		//set up the main variables here....
		var greenwich = new google.maps.LatLng(51.46, 0.2);

		var mapOptions = {
			center: greenwich,
			zoom: 8,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		geocodr = new google.maps.Geocoder();

		getSchools();

		//		Meteor.call('getSchools',function(err, schools) {
		//			console.log(schools);
		//		});
		//start up import.io link
		io = new importio(function() {});

		map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

		var location = "Norwich";
		geocodeAddress(location, function(latLng) {

			pinLocation(latLng, function() {
				//Hi brennan, look at google.maps.InfoWindow here for displaying data.... http://www.evoluted.net/thinktank/web-development/google-maps-api-v3-custom-location-pins
				alert("you clicked the box, biatch");
			});
		});
	};
}

Template.map.locationSidebar = function() {
	return Session.get('locations');
};