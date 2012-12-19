if (Meteor.isClient) {
	
	var geocodr;
	var io;
	var map;
	
	function getJobDaytr(jobSearchTerm, gotDaytr)
	{
		completeResults = [];
		
		Meteor.call('signQuery',{
			requestId: 'request-'+Date.now()+'-'+jobSearchTerm,
			connectorGuids: _.chain(connectrs).values().reject(_.isEmpty).value(),
			input: {'job_title/topic:description': jobSearchTerm},
			maxPages: 100
		},function(err,signedQuery) {
			if(err) return console.error(err);
			console.log(signedQuery);
			//track the progress of the query
			jobsSpawned = 0;
			jobsStarted = 0;
			jobsCompleted = 0;
			
			io.query(signedQuery,function(message){
				console.log(message);
				switch(message.data.type)
				{
				case 'SPAWN':
					jobsSpawned++;
					break;
				case 'INIT':
				case 'START':
					jobsStarted++;
					break;
	
				case 'STOP':
					jobsCompleted++;
					break;
				case 'MESSAGE':
					completeResults = completeResults.concat(message.data.data.results);
					//do something with this: message.data.data.results
				}
				
				finished = jobsStarted == jobsCompleted && jobsSpawned == jobsStarted -1 && jobsStarted > 0;
				//if we have all the returned data then call this callback to tell 
				if(finished) gotDaytr(completeResults);
				
			});
		});
	}
	
	function geocodeAddress(addressString, callback) {
		//convert the result to a latlng instead of the horrible crap that google sends back
		geocodr.geocode({address: addressString}, function(results, status) {
			console.log(status);
			if(status == google.maps.GeocoderStatus.OK)
				callback(results[0].geometry.location);
		});
	}
	
	function pinSchool(latLng, clickCallback) {
		var pinImage = google.maps.MarkerImage('/schoolIcon.png',new google.maps.Size(16,16), new google.maps.Point(0,0), new google.maps.Point(16,16));
		var addedPin = new google.maps.Marker({position: latLng,map: map, icon: pinImage});
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
		
		//start up import.io link
		io = new importio(function(){});
		
		map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
		
		var blobbyness = [
			new google.maps.LatLng(51.46,0.0),
			new google.maps.LatLng(51.36,-0.1),
			new google.maps.LatLng(51.56,-0.2),
			new google.maps.LatLng(51.66,-0.2),
			new google.maps.LatLng(51.56,-0.0),
			new google.maps.LatLng(51.46,-0.3),
			new google.maps.LatLng(51.56,-0.4),
			new google.maps.LatLng(52.66,0.2),
			new google.maps.LatLng(52.66,0.4),
			new google.maps.LatLng(52.66,0.2),
			new google.maps.LatLng(52.26,0.4),
			new google.maps.LatLng(52.36,0.4),
			new google.maps.LatLng(52.46,0.4),
			new google.maps.LatLng(51.56,-0.5),
			new google.maps.LatLng(52.44,-1.9),
			new google.maps.LatLng(52.46,-2.2),
			new google.maps.LatLng(52.45,-2.3),
			new google.maps.LatLng(52.44,-1.9),
			new google.maps.LatLng(52.46,-2.1)
		];
					
		var location = "Norwich";
		geocodeAddress(location, function(latLng) {
			console.log(location, latLng);
			
			pinLocation(latLng, function() {
				//Hi brennan, look at google.maps.InfoWindow here for displaying data.... http://www.evoluted.net/thinktank/web-development/google-maps-api-v3-custom-location-pins
				alert("you clicked the box, biatch");
			});
		});
		
		var engineeringJobs;
		var jobMapData = [];
		
		getJobDaytr("Engineering", function(allResults) {
			engineeringJobs = allResults;
			
			_.each(_.pluck(engineeringJobs,"employment_tenure/person/places_lived/location/topic:name"),function(locationString) {
				console.log(locationString)
				if(geo = GeocodeResults.findOne({loc:locationString})) {
					jobMapData.push(geo.latLng);
				} else geocodeAddress(locationString,function(latLng) {
					GeocodeResults.insert({loc:locationString,latLng:latLng});
					jobMapData.push(latLng);
				});
			});

		});
		
		
		var heatmap = new google.maps.visualization.HeatmapLayer({
				data: blobbyness,
				radius: 50
		});
		
		heatmap.setMap(map);
	}
}