if (Meteor.isClient) {
	var results = {};
	Template.main.result = function() {
		return results[Session.get('requestId')];
	};
	var io;
	Template.main.rendered = function() {
		if(!this._rendered) {
			this._rendered = true;
			io = new importio(function(){});
		}
	};
	Template.main.events({
		"click input": function() {
			Meteor.call('signQuery',{
				requestId: 'request-'+Date.now(),
				connectorGuids: ['79d826f8-f2ce-4267-bb2a-84fcda7a5c47'],
				input: {'location/street_address/postal_code/postal_code': 'ec1y 2bj'}
			},function(err,signedQuery) {
				if(err) return console.error(err);
				io.query(signedQuery,function(message){
					if(message.data.type == 'MESSAGE') {
						results[message.data.requestId] = _.pluck(message.data.data.results,'location/name');
						Session.set('requestId',message.data.requestId);
					} else {
						console.log(message.data);
					}
				});
			});
		}
	});
}