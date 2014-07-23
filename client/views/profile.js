Template.profile.events({
    'submit .form-profile': function(e) {
        e.preventDefault();
        var profile = $(e.target).serializeJSON();
        var user = Meteor.user();
        console.log("========================");
        if (!(profile['profile.email'] === user.profile.email)) {
            Meteor.call('updateEmail', user._id, profile['profile.email'], function(err, res) {
                // if (err)
                //     console.log(err);
                // if (res)
                //     console.log(res);
            });
        }
        Meteor.call('updateProfile', user._id, profile, function(err, res) {
            // if (err)
            //     console.log(err);
            // if (res)
            //     console.log(res);
        });
    },
    'click .change-password': function(e) {
        e.preventDefault();
        var user = Meteor.user();
        var hash = Package.sha.SHA256($('.password-actual').val());
        var newPwd = Package.sha.SHA256($('.password-reset').val());
        var checkPwd = Package.sha.SHA256($('.password-reset-check').val());
        // Accounts.setPassword(user._id, newPassword);
        Meteor.call('checkPassword', hash, function(err, res) {
            console.log(newPwd);
            console.log(checkPwd);
            if (res) {
                if (newPwd == checkPwd) {
                    if ($('.password-reset').val().length >= 5) {
                        Accounts.changePassword($('.password-actual').val(), $('.password-reset').val(), function(err, res) {
                            console.log(err, res);
                        });
                    } else
                        alertMessage('.alert-warning', 'Un mot de passe doit contenir au moins 5 caractères');
                } else {
                    alertMessage('.alert-warning', 'Les nouveaux mots de passe ne correspondent pas');
                }
            } else {
                alertMessage('.alert-warning', 'Le mot de passe actuel ne correspond pas avec votre mot de passe');
            }
        });
    },
});