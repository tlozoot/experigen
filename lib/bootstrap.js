var scripts = {
    "lib/jquery/jquery.json-2.2.min.js": 'remote',
    "lib/ejs/ejs_production.js": 'remote',
    "lib/soundman/soundmanager2-jsmin.js": 'remote',
    "lib/soundman/config.js": 'remote',
    "lib/array.js": 'remote',
    "lib/experiment.js": 'remote',
    "lib/trial.js": 'remote',
    "lib/dataconnection.js": 'remote',
    "app/setup.js": 'local',
    "app/design.js": 'local',
    "lib/launch.js": 'remote'
}

var stylesheets = [
    "lib/default.css",
    "app/custom.css"
]

$.each(scripts, function(file, location) {
    var script_string = "<script src='" + file + "'></script>";
    $('head').append(script_string);
});

$.each(stylesheets, function(i, file) {
   var css_string = "<link rel='stylesheet' href='" + file + "' type='text/css'>";
   $('head').append(css_string)
});