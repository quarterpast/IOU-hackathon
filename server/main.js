if (Meteor.isServer) {
	var require = __meteor_bootstrap__.require;

	var crypto = require('crypto'),
	apikey = '75pMfISX+QY7X4iTeoJe/wzHPjbWpZz/kR2sOkfipuklFldbviYykN20hUvGxWIVPgyD0+FJYF3WWCgy4t4DKQ==';
	
	//server side geocoder
	function geocodeAddress(addressString, callback) {
		//convert the result to a latlng instead of the horrible crap that google sends back
		geocodr.geocode({address: addressString}, function(results, status) {
			console.log(status);
			if(status == google.maps.GeocoderStatus.OK)
				callback(results[0].geometry.location);
		});
	}
	
	
	Meteor.startup(function () {
		Meteor.methods({
			signQuery: function(query){
				var signed_query = {
					queryJson: JSON.stringify(query),
					expiresAt: new Date().getTime() + 10*60*1e3,
					userGuid: 'f58f10ff-2bc3-45ea-b560-458ec30d1469',
					orgGuid: "00000000-0000-0000-0000-000000000000"
				};

				var check = signed_query.queryJson + ":" + signed_query.userGuid + ":" + signed_query.expiresAt;

				signed_query.digest = crypto.createHmac("sha1", new Buffer(apikey, "base64").toString("binary")).update(check).digest('base64');

				return signed_query;
			},
		
			getSchools: function() {
				
				schoolRequest = Meteor.http.call("GET","https://data.kusiri.com/search/q/55938856-2557-4c6e-92ae-0bd94f3a29c9?q=A",{auth: "nick.scott@import.io:Neyfer!113"})
				
				_.each(schoolRequest.data.results,function(result) {
					if(SchoolData.findOne({title: result.title}) {
						//do nothing here
						console.log("found in cache " + result);
					}
					else {
						
						SchoolData.insert({title: result.title, latLng:geocodeAddress(result.location.address)});
						console.log("inserting school into cache" + result);
						
					}
						
				})

				//SchoolData
			}
		});
	});
}
