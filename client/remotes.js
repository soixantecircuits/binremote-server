var notNaNorInfinity = function(number) {
    if (isNaN(number) || number == Number.POSITIVE_INFINITY || number == Number.NEGATIVE_INFINITY)
        return false;
    else
        return true;
};

alertMessage = function(type_success, log) {
    if ($(type_success).text() != '')
        $(type_success).empty();
    $(type_success).append(log);
    Meteor.setTimeout(function() {
        $(type_success).empty();
    }, 5000);
}

alertBorder = function(element_to_surround, borderStyle) {
    $(element_to_surround).css('border', borderStyle);
    Meteor.setTimeout(function() {
        $(element_to_surround).css('border', "1px solid rgb(190, 196, 200)");
    }, 5000);
}


