if (Meteor.isServer) {
	var require = __meteor_bootstrap__.require;

	var crypto = require('crypto'),
	apikey = '75pMfISX+QY7X4iTeoJe/wzHPjbWpZz/kR2sOkfipuklFldbviYykN20hUvGxWIVPgyD0+FJYF3WWCgy4t4DKQ==';
	
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
			}
		});
	});
}
