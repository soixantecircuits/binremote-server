Template.newpassword.events({
    'submit #reset-form': function(e) {
        e.preventDefault();
        var options = $(e.target).serializeJSON();
        console.log("submit");
        var newPwd = Package.sha.SHA256($('.new').val());
        var checkPwd = Package.sha.SHA256($('.check').val());
        if (newPwd == checkPwd) {
            if ($('.new').val().length >= 5) {
                Accounts.resetPassword(Router.current().data().token, $('.new').val(), function() {
                    Router.go('/login');
                });
            } else
                alertMessage('.alert-warning', 'Un mot de passe doit contenir au moins 5 caractères');
        } else {
            alertMessage('.alert-warning', 'Les nouveaux mots de passe ne correspondent pas');
        }

    }
});