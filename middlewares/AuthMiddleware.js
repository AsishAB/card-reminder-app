const checkIsAuth = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		console.log("Middleware->AuthMiddleware.js");
		console.log("User is Not logged in");
		return res.redirect("/users/login");
	}
	next();
};

module.exports = checkIsAuth;
