const { selectUser } = require('../models/users.model');

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  return selectUser(username)
    .then(user => {
      res.send({ user: user[0] });
    })
    .catch(next);
};
