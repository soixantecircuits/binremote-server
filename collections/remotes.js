Remotes = new Meteor.Collection('remotes');

var remotesdump = {
  PCname: 'Predator',
  group: 'soixantecircuits',
  bins: [{
    id: 'pka21EEDDAPL22soasopak3',
    name: 'Kenzo',
    state: 'iddle',
    lastupdate: Date.now()
  }, {
    id: 'pka21EEDDAPL223',
    name: 'Akka',
    state: 'started',
    lastupdate: Date.now()
  }, {
    id: 'oapdka2124AOSDKOPK',
    name: 'Stars',
    state: 'started',
    lastupdate: Date.now()
  }]
};

//console.log(Remotes.insert(remotesdump));

Remotes.allow({
  update: function() {
    return true;
  },
  insert: function() {
    return true;
  }
});


Meteor.methods({
    updateRemote: function(_uuid, _remote) {
      Remotes.upsert({
        'uuid': _uuid
      }, _remote, function(err, res) {
        if (err)
          return err;
        if (res)
          return res;
      });
    },
    addRemote: function(remote) {
      console.log(remote);
      Remotes.upsert({
        'PCname': remote.PCname
      }, remote, function(err, res) {
        if (err)
          return err;
        if (res)
          return res;
      });
    },
    startRemote: function(id, key) {
      //db.remotes.update({_id: 'XDn7xy4DthS8oE2xs'}, {$set: { 'bins.0.state': 'started'}}, {multi: false,upsert: false});
      //console.log('update({_id: '+id+'}, {$set: { '+key+': '+"started"+'}}, {multi: false,upsert: false});');
      var setter = {};
        var state = key+'.state';
        var active = key+'.active';
        setter[state] = 'started';
        setter[active] = true;
      console.log(setter);  
      Remotes.update({
        _id: id
      }, {
        $set: setter
      }, {
        multi: false,
        upsert: true
      }, function(err, docs) {
        if(err)
            console.log(err);
        console.log(docs);
      });
    },
    stopRemote: function(id, key) {
        var setter = {};
        var state = key+'.state';
        var active = key+'.active';
        setter[state] = 'iddle';
        setter[active] = false;
      console.log(setter);
      Remotes.update({
        _id: id
      }, {
        $set: setter
      }, {
        multi: false,
        upsert: true
      }, function(err, docs) {
        if(err)
            console.log(err);
        console.log(docs);
      });
    }
});