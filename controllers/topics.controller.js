const { selectTopics } = require('../models/topics.model');

exports.getTopics = (req, res, next) => {
  //console.log('in topics controller');
  return selectTopics().then(topics => {
    res.send({ topics: topics });
  });
};
