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
	{name:"London"},
	{name:"Nottingham"}
];
Session.set('locations',[]);

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
				alert("School locations is "+(ev.target.checked ? "enabled" : "disabled"));
				break;
			case "Hospitals":
				alert("Hospitals is "+(ev.target.checked ? "enabled" : "disabled"));
				break;
		}
	},
	"click .btn-pin": function(ev) {
		ev.preventDefault();
		Session.set('locations',
			Session.get('locations').concat(locations.shift())
		);
	}
});

Template.sidebar.rendered = function() {
	$('.subs').hide();
};


