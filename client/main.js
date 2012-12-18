Results = new Meteor.Collection('results');

if (Meteor.isClient) {
	Template.hello.results = function() {
		Results.find({});
	};
	var io;
	Template.hello.rendered = function() {
		if(!this._rendered) {
			this._rendered = true;
			io = new importio(function(){});
		}
	};
	Template.hello.events({
		"click input": function() {
			Meteor.call('signQuery',{
				requestId: 'request-'+Date.now(),
				connectorGuids: ['79d826f8-f2ce-4267-bb2a-84fcda7a5c47'],
				input: {'location/street_address/postal_code/postal_code': 'ec1y 2bj'}
			},function(err,signedQuery) {
				if(err) return console.error(err);
				io.query(signedQuery,function(message){
					if(message.data.type == 'MESSAGE') {
						_.each(message.data.data.results,function(result){
							Results.insert({name:results['location/name']});
						});
					} else if(message.data.type == 'MESSAGE') {
						console.error(message.data)
					}
				});
			});
		}
	});
}