var mongoose = require('mongoose');
var mongooseAutoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    standarizedUsername: String,
    username: String,
    email: String,
    password: String,
    isRoot: {
        type: Boolean,
        default: false
    },
    isAdministrator: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    iconId: {
        type: Number,
        default: 1
    }
});

UserSchema.methods.getSessionAttrs = function () {
    return {
        userId: this.userId,
        username: this.username,
        isRoot: this.isRoot,
        isAdministrator: this.isAdministrator,
        iconId: this.iconId
    };
};

UserSchema.methods.getPrivateAttrs = function () {
    return {
        userId: this.userId,
        username: this.username,
        email: this.email,
        isRoot: this.isRoot,
        isAdministrator: this.isAdministrator,
        iconId: this.iconId
    };
};

UserSchema.methods.getPublicAttrs = function () {
    return {
        userId: this.userId,
        username: this.username,
        email: this.email,
        isRoot: this.isRoot,
        isAdministrator: this.isAdministrator,
        isBanned: this.isBanned,
        iconId: this.iconId
    };
};

mongooseAutoIncrement.initialize(mongoose.connection);

UserSchema.plugin(mongooseAutoIncrement.plugin, {
    model: 'User',
    field: 'userId',
    startAt: 1
});

module.exports = mongoose.model('User', UserSchema);
