const connection = require('../connection');
const { checkIfUserExists } = require('./users.model');
const { checkIfTopicExists } = require('./topics.model');

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

exports.checkIfArticleExists = article_id => {
  return connection
    .select('*')
    .from('articles')
    .where('article_id', '=', article_id)
    .then(article => {
      if (article.length === 0) {
        return false;
      }
      return true;
    });
};

exports.selectArticles = (sort_by, order, username, topic) => {
  if (order === undefined) order = 'desc';
  if (sort_by === undefined) sort_by = 'created_at';

  return connection
    .select('articles.*')
    .from('articles')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .modify(querySoFar => {
      if (sort_by !== undefined) querySoFar.orderBy(sort_by, order);
      if (username !== undefined)
        querySoFar.where({ 'articles.author': username });
      if (topic !== undefined) querySoFar.where({ 'articles.topic': topic });
    })
    .then(articles => {
      return Promise.all([
        articles,
        checkIfUserExists(username),
        checkIfTopicExists(topic)
      ]);
    })
    .then(([articles, userExists, topicExists]) => {
      if (userExists === false) {
        return Promise.reject({ status: 404, msg: 'username does not exist' });
      } else if (topicExists === false) {
        return Promise.reject({ status: 404, msg: 'topic does not exist' });
      }
      return articles;
    });
};
