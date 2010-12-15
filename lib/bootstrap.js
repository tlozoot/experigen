var scripts = [
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

var stylesheets = [
    "http://phonetics.fas.harvard.edu/experigen/lib/default.css",
    "app/custom.css"
]

$.each(scripts, function(i, file) {
    var script_string = "<script src='" + file + "'></script>";
    $('head').append(script_string);
});

$.each(stylesheets, function(i, file) {
   var css_string = "<link rel='stylesheet' href='" + file + "' type='text/css'>";
   $('head').append(css_string)
});