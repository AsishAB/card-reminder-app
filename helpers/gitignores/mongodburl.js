const mongoDBPassword = require("../mongodb-database").mongoDBPassword;
const mongoDBDatabase = require("../mongodb-database").mongoDBDatabase;
const mongoDBURL = `mongodb+srv://RememberMeAsish:${mongoDBPassword}@asishcluster.rjwov.mongodb.net/${mongoDBDatabase}?retryWrites=true&w=majority`;

module.exports = mongoDBURL;

/*

    mongodb+srv://RememberMeAsish:vUarAawV333Dx2n1@asishcluster.rjwov.mongodb.net/card-reminder?retryWrites=true&w=majority


  */
