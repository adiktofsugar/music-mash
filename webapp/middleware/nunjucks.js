module.exports = function (app) {
    app.use(function defaultTitle (req, res, next) {
        res.locals.default_title = "This is music mash";
        next();
    });
}
