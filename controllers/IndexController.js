exports.indexPage = (req, res, next) => {
	res.render("index.ejs", {
		pageTitle: "Welcome",
	});
};
