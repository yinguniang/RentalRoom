var mongoose = require("mongoose");

module.exports = mongoose.model("User", {
	"name" : String,
    "mobile" : String,
    "h_resources" : String,
    "h_comments" : String,
    "avatar" : String  
});