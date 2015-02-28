requirejs.config({
    paths: {
        jquery: "https://code.jquery.com/jquery-2.1.3.min",
        handlebars: "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.0/handlebars",
        text: "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text"
    }
});

define("template", ["handlebars", "text"], function (Handlebars, textPlugin) {
    return {
        load: function (name, parentRequire, onload, config) {
            parentRequire(["text!" + name + ".handlebars"], function (source) {
                var template = Handlebars.compile(source);
                onload(template);
            });
        }
    };
});

define("debug", [], function () {
    var log = function () {
        if (typeof window.console === "undefined") {
            return;
        }
        console.log.apply(console, arguments);
    }
    function prependedMessageLog(message) {
        return function () {
            var args = Array.prototype.slice();
            return log.apply(log, [message].concat(args));
        };
    }
    log.debug = prependedMessageLog("[DEBUG]");
    log.info = prependedMessageLog("[INFO]");
    log.error = prependedMessageLog("[ERROR]");
    return {
        log: log
    };
});
