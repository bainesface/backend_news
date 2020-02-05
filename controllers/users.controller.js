const { selectUser } = require('../models/users.model');

exports.getUserByUsername = (req, res, next) => {
  //console.log('in controller');
  const { username } = req.params;
  return selectUser(username)
    .then(user => {
      res.send({ user: user });
    })
    .catch(err => {
      next(err);
    });
};