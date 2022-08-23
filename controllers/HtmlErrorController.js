exports.get404Page = (req, res, next) => {
	res.render("404.ejs", { pageTitle: "404 ERROR" });
};

exports.get500Page = (req, res, next) => {
	res.render("500.ejs", { pageTitle: "500 ERROR" });
};
