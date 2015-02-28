var cookieParser = require('cookie-parser');
module.exports = function (app) {
    app.use(function (req, res, next) {
        console.log(req.method + " " + req.url);
        next();
    });
    app.use(cookieParser());
}
