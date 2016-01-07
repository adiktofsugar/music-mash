define(['jquery'], function ($) {
    var endpoint = '/discover';
    function search(searchTerms, callback) {
        callback = callback || function () {};
        $.ajax(endpoint + '/search', {
            data: {
                q: searchTerms
            },
            error: function (error) {
                callback(error);
            },
            success: function (results) {
                callback(null, results);
            }
        });
    }
    function details(itemName, itemType, callback) {
        callback = callback || function () {};
        $.ajax(endpoint + '/details', {
            data: {
                name: itemName,
                type: itemType
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
