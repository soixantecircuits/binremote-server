Template.login.events({
    'submit #login-form': function(e, t) {
        e.preventDefault();

        var user = $(e.target).serializeJSON();
        var logs = '';
        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.

        if (user['login-id'] == '')
            logs += 'Renseignez votre identifiant ';
        if (user['login-password'] == '')
            logs += (logs == '' ? 'Renseignez votre mot de passe ' : 'et votre mot de passe ');

        if (logs == '') {
            Meteor.loginWithPassword(user['login-id'], user['login-password'], function(err, res) {
                if (err) {
                    if (err.reason == 'User not found')
                        alertMessage('.alert-warning', 'User not found');
                    else if (err.reason == 'Login forbidden')
                        alertMessage('.alert-warning', 'The account has not been validated');
                    else 
                        alertMessage('.alert-warning', 'User or password incorrect');
                } else {
                    Router.go('/dashboard');
                }
            });
            return false;
        }
        alertMessage('.alert-warning', logs);
    }
});