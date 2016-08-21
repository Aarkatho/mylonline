var mongoose = require('mongoose');
var mongooseAutoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    }
});

mongooseAutoIncrement.initialize(mongoose.connection);

userSchema.plugin(mongooseAutoIncrement.plugin, {
    model: 'User',
    field: 'userId',
    startAt: 1
});

module.exports = mongoose.model('User', userSchema);
