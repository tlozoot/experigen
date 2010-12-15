var remote_host = "http://phonetics.fas.harvard.edu/experigen/";

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
];

var stylesheets = [
    "lib/default.css",
    "app/custom.css"
];

function getScriptName (i) {
    var path = scripts[i];
    if (path.match(/^lib/)) {
        path = remote_host + path;
    }
    return path;
}

(function loadScript(i) {
    $.ajax({
        async: false,
        url: getScriptName(i),
        dataType: 'script',
        success: function() {
            if (currentScript < scripts.length) {
                loadScript(i + 1);
            } 
        }
    });
    
})(0);

$.each(stylesheets, function(i, file) {
   var css_string = "<link rel='stylesheet' href='" + file + "' type='text/css'>";
   $('head').append(css_string)
});

