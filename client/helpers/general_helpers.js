Handlebars.registerHelper('show', function(item, optional_msg) {
    console.log(item);
});

Handlebars.registerHelper('determineClass', function(item) {
    if (item == Router.current().path)
        return "active";
    else
        return "inactive";
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

Handlebars.registerHelper('elementExists', function(element) {
    return (element != null || element != undefined) ? element : null;
});