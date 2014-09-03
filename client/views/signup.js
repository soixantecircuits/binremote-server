Template.signup.events({
    'submit #signup-form': function(e, t) {
        e.preventDefault();

        var user = $(e.target).serializeJSON();
        var logs = '';
        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.

        if (isEmpty(user['signup-email']))
            logs += 'Renseignez votre email';
        if (isEmpty(user['signup-password']))
            logs += (logs == '' ? 'Renseignez votre mot de passe' : ', votre mot de passe ');
        if (isEmpty(user['signup-company']))
            logs += (logs == '' ? 'Renseignez le nom de votre entreprise' : ', le nom de l\'entreprise ');
        if (isEmpty(user['signup-password-confirm']))
            logs += (logs == '' ? 'Confirmez votre mot de passe' : ' et confirmez votre mot de passe ');

        if (isEmpty(logs)) {
            var errors = '';
            if (user['signup-password'] != user['signup-password-confirm'])
                errors += 'Les mots de passe ne sont pas les mêmes<br>';
            if (errorPassword(user['signup-password']))
                errors += 'Le mot de passe doit comporter au minimum six caractères';
            if (errorMinChars(user['signup-company']))
                errors += 'Le nom de l\'entreprise doit comporter au minimum deux caractères<br>';
            if (errorEmail(user['signup-email']))
                errors += 'L\'email comporte une erreur';

            if (isEmpty(errors)) {
                var group = user['signup-company'].toLowerCase();
                group = group.trim();
                group = group.replace(' ', '');

                var user = {
                    username: '',
                    email: user['signup-email'],
                    password: user['signup-password'],
                    profile: {
                        first_name: '',
                        last_name: '',
                        username: '',
                        email: user['signup-email'],
                        company: {
                            name: user['signup-company'],
                            group: group
                        }

                    }
                };
                Meteor.call('signup', user, group, function(err, res) {
                    if (err) console.log(err);
                    if (res) {
                        if (res.success == true)
                            alertMessage('.alert-success', res.log);
                        if (res.success == false)
                            alertMessage('.alert-warning', res.log);
                    }

                });


            } else
                alertMessage('.alert-warning', errors);
        } else
            alertMessage('.alert-warning', logs);
    }
});

var isEmpty = function(field) {
    return (field == '' || !field) ? true : false;
}

var errorMinChars = function(field) {
    return (field.length < 2) ? true : false;
}

var errorEmail = function(field) {
    return !/^[A-z0-9]+([_|\.|-]{1}[A-z0-9]+)*@[A-z0-9]+([_|\.|-]{1}[A-z0-9]+)*[\.]{1}[A-z]{2,6}$/.test(field) ? true : false;
}

var errorPassword = function(field) {
    return (field < 6) ? true : false;
}