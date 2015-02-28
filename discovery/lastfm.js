var url = require('url');
var crypto = require('crypto');
var request = require('request');
var _ = require('lodash');

var apiKey = "9cd7424fd5947eda481d2477ccd55fc9";
var apiSecret = "18c2c1993b9944ae49bda986d8986a42";
var apiRoot = "http://ws.audioscrobbler.com/2.0/";


function getAuthorizationEndpoint(callbackUrl) {
    return url.format({
        protocol: "http",
        host: "www.last.fm",
        pathname: "/api/auth",
        query: {
            api_key: apiKey,
            cb: callbackUrl
        }
    });
}

function generateApiSignature(requestParameters) {
    var signature = "";
    var sortedParameterKeys = Object.keys(requestParameters).sort();
    sortedParameterKeys.forEach(function (key) {
        var value = requestParameters[key];
        signature += key + value;
    });
    signature += apiSecret;
    return crypto.createHash('md5')
        .update(signature).digest("hex");
}

function getSession(token, callback) {
    callback = callback || function () {};

    apiRequest('auth.getSession', {
        token: token,
        api_key: apiKey
    }, {
        shouldSign: true
    }, function (error, response) {
        if (error) {
            return callback(error);
        }
        callback(null, response.session);
    });
}

function apiRequest(methodName, parameters, options, callback) {
    if (callback === undefined) {
        callback = options;
        options = {};
    }
    callback = callback || function () {};

    var requestUriParameters = url.parse(apiRoot);
    var requestParameters = _.merge({
        format: "json",
        api_key: apiKey,
        method: methodName
    }, parameters);

    if (options.shouldSign) {
        requestParameters.api_sig = generateApiSignature(requestParameters);
    }

    var requestUri = url.format(_.merge(url.parse(apiRoot), {
        query: requestParameters
    }));
    request({
        method: (options.method || "get").toUpperCase(),
        uri: requestUri
    }, function (error, response, body) {
        console.log("last fm response for " + requestUri);
        console.log(body);

        body = JSON.parse(body);
        if (error) {
            console.error("Error making last.fm api request", error);
            callback(error);
        } else if (body.error) {
            console.error("Last.fm error code - " + body.error +
                " message - " + body.message);
            callback(body);
        } else {
            callback(null, body);
        }
    });
}

module.exports = {
    getAuthorizationEndpoint: getAuthorizationEndpoint,
    apiRequest: apiRequest,
    getSession: getSession
};
