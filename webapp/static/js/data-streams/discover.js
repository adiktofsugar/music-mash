define(['jquery'], function ($) {
    var endpoint = '/discover';
    function search(searchTerms, callback) {
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
    return {
        search: search
    };
});
