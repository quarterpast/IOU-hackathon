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
		lat: 51.514832, lng:-0.088946,
		stats:[
			{name:"Population",value:"8278251"},
			{name:"Unemployed",value:"223742"},
			{name:"Unemployment Rate",value:"4.1%"},
			{name:"Engineering Jobs",value:20638, sort:1},
			{name:"Competetive Index",value:"17.81%", sort:1},
			{name:"Crime",value:"4674",sort:-1},
			{name:"Health Care System Index",value:"65.9",sort:1},
			{name:"House Price to Income Ratio",value:"15.31",sort:-1},
			{name:"Mortgage as % of income",value:"121.27%",sort:-1},
			{name:"Pollution index",value:"57.46",sort:-1},
			{name:"Traffic Index",value:"170.48",sort:-1},
			{name:"Time index",value:"51.56",sort:-1},
			{name:"Commuters CO<sub>2</sub>",value:"121.85",sort:1},
			{name:"Rainfall",value:"More than France"},
			{name:"Beer Index",value:"£4"},
			{name:"Utilities",value:"£168"},
			{name:"Rent for 1 bed flat",value:"£900"}
		]
	},
	{
		name:"Nottingham",
		lat: 52.947808, lng:-1.218309,
		stats:[
			{name:"Population",value:"666358"},
			{name:"Unemployed",value:"13611"},
			{name:"Unemployment Rate",value:"6.3%"},
			{name:"Engineering Jobs",value:2424, sort:1},
			{name:"Competetive Index",value:"9.22%", sort:1},
			{name:"Crime",value:"1740",sort:-1},
			{name:"Health Care System Index",value:"79.63",sort:1},
			{name:"House Price to Income Ratio",value:"6.52",sort:-1},
			{name:"Mortgage as % of income",value:"51.65%",sort:-1},
			{name:"Pollution index",value:"41.81",sort:-1},
			{name:"Traffic Index",value:"46.37",sort:-1},
			{name:"Time index",value:"15",sort:-1},
			{name:"Commuters CO<sub>2</sub>",value:"443.33",sort:1},
			{name:"Rainfall",value:"More than France"},
			{name:"Beer Index",value:"£3"},
			{name:"Utilities",value:"£139"},
			{name:"Rent for 1 bed flat",value:"£375"}
		]
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


