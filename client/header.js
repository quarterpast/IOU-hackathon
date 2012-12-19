function getJobDaytr(jobSearchTerm, gotDaytr) {
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

var heatmap;

Session.set('searchicon','<i class="icon-search"></i>');
Template.header.searchIcon = function() {
	return Session.get('searchicon')
}

Template.header.events({
	"blur input": function(ev) {
		Session.set("searchquery",ev.target.value)
	},
	"click button": function(ev) {
		ev.preventDefault();

		$(ev.target).attr('disabled','disabled');
		Session.set('searchicon','<img src="/load.gif">')

		getJobDaytr(Session.get("searchquery"), function(allResults) {
			if(heatmap != null) heatmap.setMap(null);
			var jobMapData = []
			_.chain(allResults)
			.pluck("employment_tenure/person/places_lived/location/topic:name")
			.each(function(locationString) {
				if(geo = GeocodeResults.findOne({loc:locationString})) {
					console.log("mongo cache hit %s",locationString);
					console.log(geo.latLng);
					jobMapData.push(new google.maps.LatLng(geo.latLng.Ya,geo.latLng.Za));
				} else geocodeAddress(locationString,function(latLng) {
					GeocodeResults.insert({loc:locationString,latLng:latLng});
					jobMapData.push(latLng);
				});
			});
			heatmap = new google.maps.visualization.HeatmapLayer({
				data: jobMapData,
				radius: 100,
				dissipating: true
			});

			heatmap.setMap(map);
			$(ev.target).removeAttr('disabled');
			Session.set('searchicon','<i class="icon-search"></i>');

		});
	}
});