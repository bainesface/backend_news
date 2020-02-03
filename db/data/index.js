const { userData, topicData, articleData, commentData } =
  process.env.NODE_ENV !== undefined
    ? require('../data/test-data/index')
    : require('../data/development-data/index');

module.exports = { userData, topicData, articleData, commentData };
