const connection = require('../connection');

exports.selectArticle = id => {
  return connection
    .select('*')
    .from('articles')
    .where('article_id', '=', id)
    .then(articleData => {
      if (articleData.length === 0) {
        return Promise.reject({ status: 404, msg: 'article id not found' });
      }
      return articleData;
    });
};

exports.updateArticle = (id, votesToAdd) => {
  if (typeof votesToAdd !== 'number') {
    return Promise.reject({ status: 406, msg: 'votes need to be numerical' });
  }
  return connection('articles')
    .where('article_id', '=', id)
    .increment('votes', votesToAdd)
    .returning('*')
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: 'article id not found' });
      }
      return result;
    });
};
