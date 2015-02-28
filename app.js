var fs = require('fs');
var path = require('path');

var async = require('async');
var express = require('express');
var app = express();

var nunjucks = require('nunjucks');
var nunjucksEnvironment = new nunjucks.Environment(
    new nunjucks.FileSystemLoader('webapp/templates'));
nunjucksEnvironment.express(app);

function initModulesFromDir(dirBase, callback) {
    fs.readdir(dirBase, function (error, moduleNames) {
        if (error) return callback(error);
        moduleNames.forEach(function (moduleName) {
            var modulePath = path.join(dirBase, moduleName);
            require(modulePath)(app);
            console.log("Initialized " + modulePath.slice(__dirname.length));
        });
        callback(null);
    });
}

function setupMiddleware(callback) {
    app.use('/static', express.static(__dirname + '/webapp/static'));
    initModulesFromDir(__dirname + '/webapp/middleware', callback);
}
function setupRoutes(callback) {
    initModulesFromDir(__dirname + '/webapp/routes', callback);
}
function setupErrorMiddleware(callback) {
    initModulesFromDir(__dirname + '/webapp/error-middleware', callback);
}

async.series([setupMiddleware, setupRoutes, setupErrorMiddleware], function (error) {
    if (error) {
        console.error("Couldn't prepare environment - " + error);
        return;
    }
    app.listen(3000, function () {
        console.log("Ready.");
    });
});
