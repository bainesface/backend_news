const connection = require('../connection');

exports.selectTopics = topic => {
  return connection
    .select('*')
    .from('topics')
    .modify(querySoFar => {
      if (topic !== undefined) querySoFar.where({ 'topics.slug': topic });
    })
    .then(topics => {
      if (topics.length === 0) {
        return Promise.reject({ status: 404, msg: 'topic does not exist' });
      }
      return topics;
    });
};
