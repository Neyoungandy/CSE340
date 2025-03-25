const errorhandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('errors/500', { message: "Something went wrong!" });
};
module.exports = errorhandler;