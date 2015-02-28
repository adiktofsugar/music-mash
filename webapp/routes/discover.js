var url = require('url');
var lastfm = require('../../discovery/lastfm');
var async = require('async');

module.exports = function (app) {

    function getLastfmCookieToken(req) {
        return req.cookies.lastfm_token;
    }
    function setLastfmCookieToken(req, token) {
        req.cookies.lastfm_token = token;
    }
    function getLastfmSessionKey(req) {
        return req.cookies.lastfm_sk;
    }
    function setLastfmSessionKey(req, key) {
        req.cookies.lastfm_sk = key;
    }

    app.get('/discover/search', function (req, res, next) {
        var lastfmCookieToken = getLastfmCookieToken(req);
        var lastfmSessionKey = getLastfmSessionKey(req);
        
        var q = req.query.q;
        function searchTags(callback) {
            lastfm.apiRequest('tag.search', {
                tag: q
            }, function (error, response) {
                if (error) {
                    return callback(error);
                }
                var tagmatches = response.results.tagmatches;
                var results = tagmatches.tag.map(function (tag) {
                    return {
                        title: tag.name,
                        count: tag.count,
                        url: tag.url
                    };
                });
                callback(null, results);
            });
        }
        function searchArtists(callback) {
            lastfm.apiRequest('artist.search', {
                artist: q
            }, function (error, response) {
                if (error) {
                    return callback(error);
                }
                var matches = response.results.artistmatches;
                var results = matches.artist.map(function (artist) {
                    return {
                        title: artist.name,
                        image_small: artist.image_small,
                        image: artist.image,
                        url: artist.url
                    };
                });
                callback(null, results);
            });
        }
        async.parallel({
            tags: searchTags,
            artists: searchArtists
        }, function (error, searchResults) {
            if (error) {
                return res.status(400).json(error);
            }
            var tags = searchResults.tags;
            var artists = searchResults.artists;
            var results = [];
            tags.forEach(function (tag) {
                tag.type = "tag";
                results.push(tag);
            });
            artists.forEach(function (artist) {
                artist.type = "artist";
                results.push(artist);
            });
            results.sort(function (a, b) {
                var aTitle = a.title.toLowerCase();
                var bTitle = b.title.toLowerCase();
                if (aTitle < bTitle) {
                    return -1;
                } else if (aTitle > bTitle) {
                    return 1;
                }
                return 0;
            });
            return res.json(results);
        });
        

    });

    app.get('/discover/lastfm-oauth', function (req, res, next) {
        var lastfmOauthCallbackUrl = url.format({
            protocol: req.protocol,
            hostname: req.host,
            port: req.port,
            pathname: '/discover/lastfm-oath-callback'
        });
        res.redirect(lastfm.getAuthorizationEndpoint(lastfmOauthCallbackUrl));
    });
    app.get('/discover/lastfm-oauth-callback', function (req, res, next) {
        var token = req.query.token;
        setLastfmCookieToken(token);

        lastfm.getSession(token, function (error, session) {
            if (error) {
                return res.end("Couldn't get session key");
            }
            setLastfmSessionKey(session.key);
            res.render('discover/lastfm-oauth');
        });
    });
}
