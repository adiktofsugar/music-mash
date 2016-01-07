define([], function () {
    var appData = {};
    return {
        set: function (key, value) {
            appData[key] = value;
        },
        get: function (key) {
            return appData[key];
        }
    };
});
