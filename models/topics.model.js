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
