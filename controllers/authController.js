const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now Logged out!');
  res.redirect('/');

};

exports.isLoggedIn = (req, res, next) => {
  // first check if user is authenticated
  if(req.isAuthenticated()) {
    next(); // carry on, they are logged in
    return;
  }
  req.flash('error', 'Oops, you have to be Logged in to do that');
  res.redirect('/login');

};
