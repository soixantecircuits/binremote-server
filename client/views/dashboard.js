Template.dashboard.name = function() {
    if (Session.get('user'))
        return Session.get('user').profile.first_name + ' ' + Session.get('user').profile.last_name;
};

Template.dashboard.remotes = function() {
    var remotes = Remotes.find().count();
    if (remotes.length == 0 && !Meteor.user())
        Session.set('isLoaded', false);
    else if (remotes && Meteor.user())
        Session.set('isLoaded', true);
    return remotes;
};

Template.dashboard.isLoaded = function() {
    return Session.get('isLoaded');
};

Template.dashboard.remotesArray = function() {
    if (Meteor.user())
        return Remotes.find().fetch();
};
