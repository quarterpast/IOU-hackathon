if (Meteor.isClient) {
	

	function convertTextLocationToLatLng(location) {
		
		var geometry = Meteor.http.get("http://maps.googleapis.com/maps/api/geocode/json?address="+location+"&sensor=false").geometry;
		
		return geometry.location;
	}
	
	Template.map.rendered = function initialize() {
		
		Meteor.flush();
		
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
		  
		  var greenwich = new google.maps.LatLng(51.46,0.2);
		  
		  console.log(convertTextLocationToLatLng("Norwich"));    	  
	  var mapOptions = {
	    center: greenwich,
	    zoom: 8,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  };
	  
	  var map = new google.maps.Map(document.getElementById("map_canvas"),
	      mapOptions);
	  
	  var heatmap = new google.maps.visualization.HeatmapLayer({
	  	  data: blobbyness,
	  	  radius: 50
	  });
	  
	  heatmap.setMap(map);
	}
}