var uuid = [];

Handlebars.registerHelper('getDate', function(item) {
    if (Router.current().data().project)
        if (Router.current().data().project['date_' + item])
            return Router.current().data().project['date_' + item];
});

Handlebars.registerHelper('whatIsUuid', function(index) {
    return uuid[index];
});


Handlebars.registerHelper('display', function(current, name) {
    var regex = new RegExp(name);
    if (current.match(regex))
        return true;
    else
        return false;
});

Handlebars.registerHelper('actualRouteIs', function(name) {
    return (Router.current().data().content.page_name == name) ? true : false;
});

Handlebars.registerHelper('disableThisFieldIfCurrentRouteIs', function(name) {
    return (Router.current().data().content.page_name == name) ? "disabled" : "";
});

Handlebars.registerHelper('enableThisFieldIfCurrentRouteIs', function(name) {
    return (Router.current().data().content.page_name == name) ? "" : "disabled";
});

Handlebars.registerHelper('makeThisEditableIfCurrentRouteIs', function(name) {
    return (Router.current().data().content.page_name == name) ? true : false;
});