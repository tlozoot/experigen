var files = [
    "lib/jquery/jquery.json-2.2.min.js",
    "lib/ejs/ejs_production.js",
    "lib/soundman/soundmanager2-jsmin.js",
    "lib/soundman/config.js",
    "lib/array.js",
    "lib/experiment.js",
    "lib/trial.js",
    "lib/dataconnection.js",
    "app/setup.js",
    "app/design.js",
    "lib/launch.js"
]

$.each(files, function(i, file) {
    var script_string = "<script src='" + file + "'></script>"
    $('html').append(script_string);
});
