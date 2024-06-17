const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    filiacao: String,
    level: String,
    active: Boolean,
    dateRegisto: String
  });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema, "users")