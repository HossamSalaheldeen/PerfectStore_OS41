exports.isAuth = (req, res, next) => {
    if(req.session.userId) next(); //if a logged in user, use next middleware
    else res.redirect('/login');
}