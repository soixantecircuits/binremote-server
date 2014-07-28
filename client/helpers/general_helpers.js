Handlebars.registerHelper('show', function(item, optional_msg) {
    console.log(item);
});

Handlebars.registerHelper('determineClass', function(item) {
    if (Router.current() != null && item == Router.current().path)
        return "active";
    else
        return "inactive";
});

Handlebars.registerHelper('isHome', function(item) {
    if (Router.current() != null &&  Router.current().path == '/')
        return true;
    else
        return false;
});

Handlebars.registerHelper('key_value', function(context, options) {
    var result = [];
    _.each(context, function(value, key, list) {
        result.push({
            key: key,
            value: value,
            parentKey: options
        });
    })
    return result;
});

Handlebars.registerHelper('dateFormat', function(item) {
    var result = 'no date';
    lastupdate = moment(item);;
    result = lastupdate.format('MMMM Do YYYY, h:mm:ss a');
    return result;
});

Handlebars.registerHelper('elementExists', function(element) {
    return (element != null || element != undefined) ? element : null;
});