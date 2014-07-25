Template.menu.events({
  'click #logout': function(el) {
    console.log(el);
    Meteor.logout(function(e) {
      console.log(e);
    });
  }
});