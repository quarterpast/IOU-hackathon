if(Meteor.isClient) {
	
	
	schoolMarkers = [];
	hospitalMarkers = [];

	var cachecount = 0;
	
	function gotHospitalDaytr(err,allResults) {
		//connector guid hospitals 20621576-8982-4001-af32-ec1bdd47797c
		//connector guid dentists 9dd56e47-9236-4e40-af25-2db3879c054f
		
		var hospMapData = [];
		
		console.log(allResults);
		_.each(allResults,function(singleresult) {
			console.log("hospital result: "+singleresult);
			console.log(singleresult);
			var locationString = singleresult["location/street_address/postal_code/postal_code"];
			console.log(locationString);
			var hospitalScore = singleresult["location/topic:description"];
			var hospitalName = singleresult["location/topic:name"];
			var geo;
			if(geo = GeocodeResults.findOne({loc:locationString})) {
				console.log("mongo cache hit %s",locationString);
				console.log(geo.latLng);

				hospitalMarkers.push(pinHospital(new google.maps.LatLng(geo.latLng.Ya,geo.latLng.Za), hospitalName));
			} else geocodeAddress(locationString,function(err,latLng) {
				if(err) return console.log(err);
				GeocodeResults.insert({loc:locationString,latLng:latLng});

				hospitalMarkers.push(pinHospital(new google.maps.LatLng(geo.latLng.Ya,geo.latLng.Za), hospitalName));
			});
		});
	}

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
						
						var sch = SchoolData.findOne({"title": result.title});
						//console.log("looking for cache result", result.title);
						if(typeof sch !== "undefined") {
							//do nothing here
							console.log("found in cache " + result.title);
							cachecount++;
							
							schoolMarkers.push(pinSchool(new google.maps.LatLng(sch.latLng.Ya,sch.latLng.Za), result.title , function() {
								
							}));
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

	function pinSchool(latLng,name, clickCallback) {
		var img = 'schools.png';
		var addedPin = new google.maps.Marker({
			position: latLng,
			map: map,
			title: name,
			icon: img,
			visible: false
		});
		google.maps.event.addListener(addedPin, 'click', clickCallback);
		return addedPin;
	}

	function pinJob(latLng, clickCallback) {
		var img = 'jobIcon.png';
		var addedPin = new google.maps.Marker({
			position: latLng,
			map: map,
			icon: img
		});
		google.maps.event.addListener(addedPin, 'click', clickCallback);
	}
	
	function pinHospital(latLng, name) {
		var img = 'hospitals.png';
		var addedPin = new google.maps.Marker({
			position: latLng,
			map: map,
			title: name,
			icon: img,
			visible: false
		});
		google.maps.event.addListener(addedPin, 'click', function() {
			console.log("pinned");
		});
		return addedPin;
	}

	function pinLocation(latLng, clickCallback) {
		var img = 'favicon.png';
		var addedPin = new google.maps.Marker({
			position: latLng,
			map: map,
			icon: img
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

		//getHospDaytr("Nottingham", gotHospitalDaytr);
		
		getHospDaytr("London", gotHospitalDaytr);

		
		

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
