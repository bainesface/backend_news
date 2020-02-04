const connection = require('../connection');

exports.selectUser = username => {
  return connection
    .select('*')
    .from('users')
    .where('username', '=', username)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: 'username not found' });
      }
      return result;
    });
};
