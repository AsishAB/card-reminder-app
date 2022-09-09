const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const session_secret = require("./helpers/helpers/session-secret-code");
const MongoDBStore = require("connect-mongodb-session")(session);

const User = require("./models/UserModel");
const mongoURL = require("./helpers/gitignores/mongodburl");
const billReminderRoutes = require("./routes/walletRoute");
const userRoutes = require("./routes/userRoutes");
const bankRoutes = require("./routes/bankRoutes");
const indexRoute = require("./routes/indexRoute");
const bankAccountRoute = require("./routes/bankAccountRoute");
const rootDir = require("./helpers/user-defined-path");
const HtmlError = require("./controllers/HtmlErrorController");

app.use(bodyParser.urlencoded({ extended: false }));

const store = new MongoDBStore({
	uri: mongoURL,
	collection: "doc_sessions",
});

const csrf = require("csurf");
const csrfProtection = csrf();

app.set("views engine", "ejs");

app.set("views", [
	path.join(rootDir, "views"),
	path.join(rootDir, "views/admin"),
	path.join(rootDir, "views/htmlerrors"),
	path.join(rootDir, "views/bankaccounts"),
	path.join(rootDir, "views/registerandauth"),
]);

app.use(
	session({
		secret: session_secret,
		resave: false,
		saveUninitialized: false,
		store: store,
		cookie: {
			maxAge: 720000,
		},
	})
);

//app.use(csrfProtection); //Must be used after configuring session session({})

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn; // isLoggedIn is in UserController->loginUser . isAuthenticated is Used in all views (navigation.ejs)
	res.locals.isUserRole = req.session.isUserRole; // "
	//res.locals.csrfToken = req.csrfToken();
	next();
});

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			if (!user) {
				return next();
			}
			//console.log(user);
			req.user = user;
			next();
		})
		.catch(err => {
			next(new Error(err));
		});
});

app.use("/", indexRoute);
app.use("/cards", billReminderRoutes);
app.use("/users", userRoutes);
app.use("/bank", bankRoutes);
app.use("/bankaccount", bankAccountRoute);

app.use(express.static(path.join(__dirname, "public")));
app.use(
	"/bank_images",
	express.static(path.join(__dirname, "public/file_uploads/bank_images"))
);

app.use(HtmlError.get404Page); //To display 404 page
app.use("/500", HtmlError.get500Page); //To display 500 page

mongoose
	.connect(mongoURL)
	.then(result => {
		console.log(
			`Card Reminder app listening on port ${port} - http://localhost:${port}`
		);
		app.listen(port);
	})
	.catch(err => {
		console.log(err);
	});
