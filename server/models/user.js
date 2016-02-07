var mongoose = require('mongoose');
var User = mongoose.model('User', {
    avatar_url: String,
    email: String,
    name: String,
    location: String,
    followers: Number,
    following: Number,
    githubId: Number
});

User.createFromData = function (data) {
    data.githubId = data.id;
    var user = new User(data);
    return user.save();
};

return User;