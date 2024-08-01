const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, minLength: 3, maxLength: 100, required: true },
  last_name: { type: String, minLength: 3, maxLength: 100, required: true },
  email: { type: String, minLength: 3, maxLength: 100, required: true },
  password: { type: String, required: true },
  membership: {
    type: String,
    enum: ['', 'member', 'admin'],
    default: '',
  },
});

UserSchema.virtual('fullname').get(function () {
  if (this.first_name && this.last_name) {
    return this.first_name + ' ' + this.last_name;
  }
  return '';
});

UserSchema.virtual('url').get(function () {
  return `/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
