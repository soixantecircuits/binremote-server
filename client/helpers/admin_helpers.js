Handlebars.registerHelper('emailIsVerified', function(emails) {
    return emails[0].verified ? 'verified' : 'notverified';
});

Handlebars.registerHelper('emailState', function(emails) {
    return emails[0].verified ? "email-checked" : "email-unchecked";
});

Handlebars.registerHelper('userIsValidate', function(emails) {
    return emails[0].verified ? true : false;
});

Handlebars.registerHelper('isInactive', function(roles) {
    return roles == 'inactive' ? 'inactive-member' : '';
});

Handlebars.registerHelper('isCheckedUser', function(roles) {
    return roles == 'inactive' ? false : true;
});

Handlebars.registerHelper('displayRole', function(roles) {
    if (roles) {
        var role = (typeof roles === 'string') ? roles : roles[0];

        switch (role) {
            case 'inactive':
                return 'Inactif';
                break;
            case 'manage':
                return 'Administrateur';
                break;
            case 'edit':
                return 'Edition';
                break;
            case 'read':
                return 'Lecture seule';
                break;
            default:
                return 'Les droits n\'existent pas';
                break;
        }
    }
});

Handlebars.registerHelper('displayStatus', function(roles) {
    if (roles) {
        var role = (typeof roles === 'string') ? roles : roles[0];

        switch (role) {
            case 'inactive':
                return '<span class="fa fa-lock"></span>';
                break;
            case 'manage':
                return '<span class="fa fa-certificate"></span>';
                break;
            case 'edit':
                return '<span class="fa fa-pencil"></span>';
                break;
            case 'read':
                return '<span class="fa fa-eye"></span>';
                break;
            default:
                return '<span class="fa fa-times"></span>';
                break;
        }
    }
});

alertMessage = function(type, log) {
    $(type).empty();
    $(type).append(log);
    Meteor.setTimeout(function() {
        $(type).empty();
    }, 5000);
}

alertBorder = function(el, borderStyle) {
    $(el).css('border', borderStyle);
    Meteor.setTimeout(function() {
        $(el).css('border', "1px solid rgb(190, 196, 200)");
    }, 5000);
}

successSubmit = function(el) {
    $(el).addClass('state-success');
    Meteor.setTimeout(function() {
        $(el).removeClass('state-success');
    }, 5000);
}