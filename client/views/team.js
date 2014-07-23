Template.user.events({
    'submit .form-member': function(e) {
        e.preventDefault();
        var id = $(e.target).attr('id');
        var member = $(e.target).serializeJSON();
        if ($(e.target).find('.isverified')) {
            Meteor.call('validateUser', id, member, function(err, res) {
                // if (err)
                //     console.log(err);
                // if (res)
                //     console.log(res);
            });
        }

        Meteor.call('updateRole', id, member, function(err, res) {
            // if (err)
            //     console.log(err);
            if (res)
                successSubmit($(e.target).find('button[type=submit]'));
        });
    },
    'click .suppress': function(e) {
        e.preventDefault();
        var id = $(e.target).closest('form').attr('id');
        Meteor.call('suppressUser', id, function(err, res) {
            // if (err)
            //     console.log(err);
            // if (res)
            //     console.log(res);
        });
    },
});

Template.roles.events({
    'click .role': function(e) {
        e.preventDefault();

        var input_roles = $(e.target).closest('form').find('input[type=hidden]');
        var display_roles = $(e.target).closest('form').find('.display-role');
        var role = $(e.target).data('role');
        input_roles.val(role);
        switch (role) {
            case 'inactive':
                display_roles.val('Inactif');
                break;
            case 'manage':
                display_roles.val('Administrateur');
                break;
            case 'edit':
                display_roles.val('Edition');
                break;
            case 'read':
                display_roles.val('Lecture seule');
                break;
            default:
                display_roles.val('Aucun droit');
                break;
        }
    },
});