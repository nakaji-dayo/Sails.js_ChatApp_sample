/**
 * MainController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  index: function (req, res) {
    res.view();
  },
  signup: function (req, res) {
    var username = req.param('username');
    var password = req.param('password');

    Users.findByUsername(username).done(function(err, user) {
      if (err) {
        res.set('error', 'DB Error');
        res.send(500);
      } else if (user.length) {
        res.set('error', 'Username already Taken');
        res.send(400);
      } else {
        var hasher = require("password-hash");
        password = hasher.generate(password);
        Users.create({username: username, password: password}).done(function(error, user) {
          if (error) {
            res.set('error', 'DB Error');
            res.send(500);
          } else {
            req.session.user = user;
            res.send(user);
          }
        });
      }
    });
  },
  login: function (req, res) {
    var username = req.param('username');
    var password = req.param('password');
    Users.login(username, password, function(err, user) {
      if (err) {
          res.set('error', err.message);
          return res.send(err.code);
      }
      req.session.user = user;
      res.send(user);
    });
  },
  chat: function (req, res) {
    if (req.session.user) {
      res.view({username: req.session.user.username});
    } else {
      res.redirect('/');
    }
  }
};
