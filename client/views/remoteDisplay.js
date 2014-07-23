Template.remoteDisplay.events({
  'click .start-link': function (el) {
    console.log(el);
    console.log(this);
    //Messages.remove(this._id);
    var key   = 'bins.'+$(el.currentTarget).closest('tr').index()+'.state';
    if(this.state == 'started') {
      Meteor.call('stopRemote', $(el.target).closest('table').attr('id'), key);
    }
    else {
      Meteor.call('startRemote', $(el.target).closest('table').attr('id'), key);
    }
  }
});
