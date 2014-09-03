var Future = Npm.require('fibers/future');
var util = Npm.require('util');

Meteor.startup(function() {
    process.env.MAIL_URL = 'smtp://guillaume%40soixantecircuits.fr:WsOP6smYBJzbMwHlDO7lnA@smtp.mandrillapp.com:587';

    Accounts.config({
        sendVerificationEmail: true,
        forbidClientAccountCreation: false
    });

    Accounts.validateLoginAttempt(function(args) {
        if (args.user) {
            console.log(args.user.services.email);
            if (args.user.emails[0].verified) {
                return true;
            } else
                return false;
        }
    })
    // Clients.remove({});
    // Keywords.remove({});
    // Options.remove({});
    // Projects.remove({});
    // Meteor.users.remove({});
    // Meteor.roles.remove({});
    // Company.remove({});

    //console.log(Meteor.users.find().fetch());
    console.log(util.inspect(Meteor.users.find().fetch(), false, null));

    if (Meteor.roles.find().count() == 0) {
        Roles.createRole('admin');
        Roles.createRole('manage');
        Roles.createRole('read');
        Roles.createRole('edit');
        Roles.createRole('inactive');
    }

    Meteor.publish('remotes', function(user) {
        if(this.userId) {
            var user = Meteor.users.findOne(this.userId);
            console.log(user);
            return Remotes.find({
                group: user.profile.company.group
            });
        } else {
            console.log("Unauthorized user tried to subscribe to remotes");
        }
    });

    Meteor.publish('company', function(user) {
        if(this.userId) {
            var user = Meteor.users.findOne(this.userId);
            console.log(user);
            var company = Company.find({
                group: user.profile.company.group
            });
            return company;
        } else {
             console.log("Unauthorized user tried to subscribe to Options");
        }
    });

    Meteor.publish('users', function(user) {
        if(this.userId) {
            var user = Meteor.users.findOne(this.userId);
            console.log(user);
            return Meteor.users.find({
                'profile.company.group': user.profile.company.group
            });
        } else {
             console.log("Unauthorized user tried to subscribe to Options");
        }
    });

    Meteor.publish(null, function() {
        return Meteor.roles.find({})
    })
});

Meteor.methods({
    ping: function() {
        console.log('ping');
        if(this.userId) {
            var user = Meteor.users.findOne(this.userId);
            console.log(user);
            return {
                success: true,
                response: 'pong'
            };
        } else {
            return {
                success: false,
                response: 'you\'re note invited'
            };
        }
    },
    signup: function(user, _group) {
        var fut = new Future();
        var _id = Accounts.createUser(user);
        // If company doesn't exist
        if (Company.find({
            group: _group
        }).count() == 0) {
            if (_id) {
                Accounts.sendVerificationEmail(_id, user.email);
            }
            var company = {
                name: user.profile.company.name,
                group: _group,
                users: [{
                    id: _id,
                    roles: 'manage'
                }]
            };
            Company.insert(company);

            Roles.addUsersToRoles(_id, 'manage');
            return {
                success: true,
                log: 'Votre compte a été créé'
            };
        } else {
            var admins = Meteor.users.find({
                roles: "manage",
                'profile.company.group': _group
            }).fetch();

            _.each(admins, function(admin) {
                console.log("email : " + admin.profile.email);
            })

            Roles.addUsersToRoles(_id, 'edit');
            // Send mail to admin

            return {
                success: false,
                log: 'Votre compte est en attente de validation par un administrateur'
            };
        }
    },
    sendEmail: function(to, from, subject, text) {
        check([to, from, subject, text], [String]);

        this.unblock();

        Email.send({
            to: to,
            from: from,
            subject: subject,
            text: text
        });
    },
    suppressUser: function(userId) {
        var user = Meteor.users.findOne({
            _id: userId
        });

        Meteor.users.remove({
            _id: userId
        });
        Meteor.call('sendEmail',
            user.profile.email,
            'noreply@ffanalytics.com',
            'Bin remote : Votre compte a été refusé',
            'Le compte que vous avez créé pour le groupe ' + user.profile.company.name + ' a été refusé par l\'administrateur du groupe.');

        return {
            success: true,
            log: "L'utilisateur a été supprimé"
        };

    },
    validateUser: function(userId, profile) {
        var user = Meteor.users.findOne({
            _id: userId
        });

        Meteor.users.update({
            _id: userId,
            'emails.address': user.profile.email
        }, {
            $set: {
                'emails.$.verified': true
            }
        });

        Meteor.call('sendEmail',
            user.profile.email,
            'noreply@ffanalytics.com',
            'Bin remote : Votre compte a été accepté',
            'Le compte que vous avez créé pour le groupe ' + user.profile.company.name + ' a été accepté par l\'administrateur du groupe. \nVous pouvez désormais vous connecter !');
        return {
            success: true,
            log: "L'utilisateur peut désormais accéder au groupe " + user.profile.company.name
        };

    },
    updateRole: function(userId, profile) {
        Meteor.users.update({
            _id: userId
        }, {
            $set: profile
        });
        var roles = Roles.getRolesForUser(userId);
        var role = "" + profile.roles;
        Roles.setUserRoles(userId, role);
        Roles.addUsersToRoles(userId, role);
        return {
            success: true,
            log: 'Le compte a été mis à jour'
        };
    },
    updateProfile: function(userId, profile) {
        Meteor.users.upsert({
            _id: userId
        }, {
            $set: profile
        });

        return {
            success: true,
            log: 'Le profil a été mis à jour'
        };
    },
    updateEmail: function(userId, email) {
        console.log(email);
        Meteor.users.upsert({
            _id: userId
        }, {
            $set: {
                "emails": [{
                    address: email,
                    verified: true
                }]
            }
        });

        return {
            success: true,
            log: 'L\'email a été mis à jour'
        };

    },
    checkPassword: function(pwd) {
        check(pwd, String);

        if (this.userId) {
            var user = Meteor.user();
            var password = {
                digest: pwd,
                algorithm: 'sha-256'
            };
            var result = Accounts._checkPassword(user, password);
            return result.error == null;
        } else {
            return false;
        }
    },
    changeUserPassword: function(pwd) {
        check(pwd, String);

        if (this.userId) {
            var user = Meteor.user();
            console.log(pwd);
        } else {
            return false;
        }
    }
});


(function() {
    "use strict";
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('reset-password/' + token);
    };
    Accounts.urls.verifyEmail = function(token) {
        return Meteor.absoluteUrl('verify-email/' + token);
    };
})();