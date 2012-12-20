Template.sidebar.factors = [
	{name:"Crime"},
	{name:"Economy", sub:["Growth","Cost of Living","Council Tax"]},
	{name:"Education", sub:["School Locations","University"]},
	{name:"Environmental", sub:["Pollution Index","Weather"]},
	{name:"Healthcare", sub:["Dental Practices","GPs","Hospitals","Healthcare System Index"]},
	{name:"Local Amenities", sub:["Fitness","Shopping","Swimming Pools","Libraries","Green Areas"]},
	{name:"Property"},
	{name:"Transport", sub:["Travel Costs","Airports","Train Stations"]},
	{name:"Sport & leisure", sub:["Football Clubs","Bars & Nightclubs"]},
	{name:"Wellbeing"}
];

var locations = [
	{
		name:"London",
		lat: 51.514832, lng:-0.088946
	},
	{
		name:"Nottingham",
		lat: 52.947808, lng:-1.218309
	}
];
Session.set('locations',[]);

function showHospitalMarkers()
{
	_.each(hospitalMarkers, function(marker) {
		marker.setVisible(true);
	});
}

function hideHospitalMarkers()
{
	_.each(hospitalMarkers, function(marker) {
		marker.setVisible(false);
	});
}

function showSchoolMarkers()
{
	_.each(schoolMarkers, function(marker) {
		marker.setVisible(true);
	});
}

function hideSchoolMarkers()
{
	_.each(schoolMarkers, function(marker) {
		marker.setVisible(false);
	});
}

function pinLocation(latLng, clickCallback) {
	var img = 'favicon.ico';
	var addedPin = new google.maps.Marker({
		position: latLng,
		map: map,
		icon: img
	});
	google.maps.event.addListener(addedPin, 'click', clickCallback);
}


Template.sidebar.events({
	"click [href='#toggle']": function(ev) {
		ev.preventDefault();
		$(ev.currentTarget)
			.find('i').toggleClass('icon-caret-right').toggleClass('icon-caret-down')
		.end()
			.closest('.sidebar-section')
			.find('.subs')
			.toggle();
	},
	"change [type='checkbox']": function(ev) {
		switch(ev.target.value) {
			case "School Locations":
				ev.target.checked ? showSchoolMarkers() : hideSchoolMarkers();
				
				break;
			case "Hospitals":
				ev.target.checked ? showHospitalMarkers() : hideHospitalMarkers();
				
				break;
		}
	},
	"click .btn-pin": function(ev) {
		ev.preventDefault();
		var loc = locations.shift();
		if(loc == null) return;

		Session.set('locations',
			Session.get('locations').concat(loc)
		);
		pinLocation(new google.maps.LatLng(loc.lat,loc.lng),function(){});
	}
});

Template.sidebar.rendered = function() {
	$('.subs').hide();
};


