/**
 * Users
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
  attributes: {   
    username: 'STRING',
    password: 'STRING'
  },

  login: function(username, password, cb) {
    Users.findByUsername(username).done(function(err, users) {
      if (err) {
        return cb({code:500, message:'DB Error'})
      } else {
        if (users.length > 0) {
          var user = users[0];
          var hasher = require('password-hash');
          if (hasher.verify(password, user.password)) {
            return cb(null, user);
          } else {
            return cb({code:400, message: 'Wrong Password'});
          }
        } else {
          return cb({code:404, message: 'User not found'});
        }
      }
    });
  }
};
