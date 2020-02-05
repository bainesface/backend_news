const connection = require('../connection');

exports.selectTopics = () => {
  //console.log('in topics model');
  return connection
    .select('*')
    .from('topics')
    .then(topics => {
      return topics;
    });
};

exports.checkIfTopicExists = topic => {
  return connection
    .select('*')
    .from('topics')
    .modify(querySoFar => {
      if (topic !== undefined) querySoFar.where({ 'topics.slug': topic });
    })
    .then(topic => {
      if (topic.length === 0) {
        return false;
      }
      return true;
    });
};
