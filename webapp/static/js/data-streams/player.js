define(['jquery'], function ($) {
    var endpoint = '/player';
    function getSongPart(parameters, callback) {
        callback = callback || function () {};
        
        var title = parameters.title;
        var artist = parameters.artist;
        var startTime = parameters.startTime;

        $.ajax(endpoint + '/song-part', {
            data: {
                title: title,
                artist: artist,
                startTime: startTime
            },
            error: function (error) {
                callback(error);
            },
            success: function (results) {
                callback(null, results);
            }
        });
    }
    return {
        search: search
    };
});
