if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to test.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
	this.greeting = 'Do not press this button again.'
     }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
