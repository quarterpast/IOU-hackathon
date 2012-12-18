var crypto = require('crypto'),
    apikey = '75pMfISX+QY7X4iTeoJe/wzHPjbWpZz/kR2sOkfipuklFldbviYykN20hUvGxWIVPgyD0+FJYF3WWCgy4t4DKQ==';

if (Meteor.isServer) {
	Meteor.startup(function () {
		Meteor.methods({
			signQuery: function(query){
				var signedQuery = {
					queryJson: JSON.stringify(query),
					expiresAt: new Date().getTime() + 10*60*1e3,
					userGuid: 'f58f10ff-2bc3-45ea-b560-458ec30d1469',
					orgGuid: "00000000-0000-0000-0000-000000000000"
				};

				var hmac = crypto.createHmac('sha1',new Buffer(apikey,'base64'));
				hmac.update(signedQuery.queryJson);
				hmac.update(':');
				hmac.update(signedQuery.userGuid);
				hmac.update(':');
				hmac.update(signedQuery.orgGuid);
				hmac.update(':');
				hmac.update(signedQuery.expiresAt);

				signedQuery.digest = hmac.digest('base64');

				return signedQuery;
			}
		});
	});
}
