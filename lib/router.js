Router.configure({
    layoutTemplate: 'main',
    // notFoundTemplate: 'notFound'
});

var goToDashboard = function(pause) {
  if (Meteor.user()) {
    Router.go('dashboard');
    pause();
  }
};

Router.onBeforeAction(function() {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            return false;
        } else {
            Router.go('login');
        }
    }
}, {
    except: ['/', 'forgot', 'login', 'signup', 'verifyEmail', 'resetPassword', 'newpassword']
});

Router.onBeforeAction(goToDashboard, {only: ['', '/']});

AccountController = RouteController.extend({
    verifyEmail: function() {

    },
    resetPassword: function() {
        // Accounts.resetPassword(this.params.token, prompt('enter new password'), function() {
        Router.go('/newpassword/' + this.params.token);
        // });
    },
});

Router.map(function() {
    this.route('/', {
        path: '/',
        template: 'home'
    });

    this.route('resetPassword', {
        controller: 'AccountController',
        path: '/reset-password/:token',
        action: 'resetPassword'
    });

    this.route('newpassword', {
        path: '/newpassword/:token',
        template: 'newpassword',
        data: function() {
            return {
                token: this.params.token
            };
        },
    });

    this.route('login', {
        path: '/login',
        template: 'login'
    });

    this.route('signup', {
        path: '/signup',
        template: 'signup'
    });

    this.route('forgot', {
        path: '/forgot',
        template: 'forgot'
    });

    this.route('/forbidden', {
        path: '/forbidden',
        template: 'forbidden'
    });

    this.route('/validate/:uuid', {
        path: '/validate/:uuid',
        data: function() {
            return {
                uuid: this.params.uuid,
                project: Projects.findOne({
                    uuid: this.params.uuid
                }),
                content: {
                    page_title: 'Encaissement',
                    page_name: 'sold',
                    submit_text: 'Encaisser le projet'
                },
            };
        },
        onBeforeAction: function() {
            user = Meteor.user();
            Meteor.subscribe('projects', user);
        },
        template: 'validate'
    });

    this.route('team', {
        path: '/team',
        data: function() {
            return {
                company: Company.findOne(),
                users: Meteor.users.find().fetch()
            };
        },
        onBeforeAction: function() {
            user = Meteor.user();
            if (user) {
                if (Roles.userIsInRole(user, 'manage')) {
                    Meteor.subscribe('company', user);
                    Meteor.subscribe('users', user);
                } else {
                    Router.go('/dashboard');
                }
            }

        },
        template: 'team'
    });

    this.route('profile', {
        path: '/profile',
        data: function() {
            user = Meteor.user();
            if (user) {
                return {
                    user: user
                };
            }
        },
        template: 'profile'
    });

    this.route('verifyEmail', {
        controller: 'AccountController',
        path: '/verify-email/:token',
        onBeforeAction: function() {
            Accounts.verifyEmail(this.params.token, function() {
                Router.go('/login');
            });
        },
        action: function() {}
    });

    
    this.route('dashboard', {
        path: '/dashboard',
        data: function() {
            user = Meteor.user();
            return {};
        },
        waitOn: function() {
            user = Meteor.user();
            if (Roles.userIsInRole(user, 'manage')) {
                Meteor.subscribe('company', user);
            }
            Meteor.subscribe('remotes', user);
        },
        template: 'dashboard'
    });

    this.route('create', {
        path: '/create',
        data: function() {
            user = Meteor.user();
            return {
                content: {
                    page_title: 'Création',
                    page_name: 'create',
                    submit_text: 'Valider le projet'
                }
            };
        },
        waitOn: function() {
            user = Meteor.user();
            console.log(user);
        },
        template: 'create'
    });

});