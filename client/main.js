if (Meteor.isClient) {
	var results = {};
	Template.hello.result = function() {
		return results[Session.get('requestId')];
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
						results[message.data.requestId] = message.data.data.results;
						Session.set('requestId',message.data.requestId);
					} else {
						console.log(message.data);
					}
				});
			});
		}
	});
}