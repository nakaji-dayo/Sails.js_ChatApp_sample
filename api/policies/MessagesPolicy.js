module.exports = function (req, res, next) {
  if (req.session.user) {
    var action = req.target.action;
    console.log('action: '+ action);
    if (action == 'create') {
      req.body.userId = req.session.user.id;
      req.body.username = req.session.user.username;
    }
    next();
  } else {
    res.send('You Must Be Logged In', 403);
  }
};