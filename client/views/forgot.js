Template.forgot.events({
    'submit #forgot-form': function(e) {
        e.preventDefault();
        console.log("submit");
        var options = $(e.target).serializeJSON();
        Accounts.forgotPassword(options, function(err, res) {
            if (!err) {
                alertMessage('.alert-success', 'Un mail vous a été envoyé');
            }
        });
    }
});