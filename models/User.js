const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({ 
  email:{
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate:[validator.isEmail, 'Invalid Email Address'],
    required: 'Please provide an email address'    
  },
  name: {
    type: String,
    required: 'please enter a name',
    trim: true
  }, 
  resetPasswordToken: String,
  resetPasswordExpires: Date  
});
// virtual field must not be in the scheme
userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?$=200`

});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'}); // help us use .register in controler
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
