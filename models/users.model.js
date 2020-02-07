const connection = require('../connection');

exports.selectUser = username => {
  return connection
    .select('*')
    .from('users')
    .modify(querySoFar => {
      if (username !== undefined)
        querySoFar.where({ 'users.username': username });
    })
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'username not found'
        });
      }
      return user;
    });
};
