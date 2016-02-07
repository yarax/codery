var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    avatar_url: String,
    email: String,
    name: String,
    location: String,
    followers: Number,
    following: Number,
    githubId: Number
});
var User = mongoose.model('User', userSchema);

User.createFromData = function (data) {
    data.githubId = data.id;
    var user = new User({
        avatar_url: data.avatar_url,
        email: data.email,
        name: data.email,
        location: data.location,
        followers: data.followers,
        following: data.following,
        githubId: data.id
    });
    return user.save();
};

module.exports = User;