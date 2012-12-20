Template.locationSidebar.unemploymentRate = function() {
	var unemp = _.find(function(it){return it.name == "Unemployed";},this.stats);
	var popul = _.find(function(it){return it.name == "Population";},this.stats);

	return (100*unemp/popul) + '%';
};

Template.locationSidebar.jobsPerThou = function() {
	var ejobs = _.find(function(it){return it.name == "Engineering Jobs";},this.stats);
	var popul = _.find(function(it){return it.name == "Population";},this.stats);

	return 1000*ejobs/popul;
};

Template.locationSidebar.competIdx = function() {
	var ejobs = _.find(function(it){return it.name == "Engineering Jobs";},this.stats);
	var unemp = _.find(function(it){return it.name == "Unemployed";},this.stats);

	return (100*ejobs/unemp) + '%';
};

Template.locationSidebar.crimePerThou = function() {
	var crime = _.find(function(it){return it.name == "Crime";},this.stats);
	var popul = _.find(function(it){return it.name == "Population";},this.stats);
	
	return 1000*crime/popul;
};

