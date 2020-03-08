const connection = require('../connection');

exports.selectArticle = id => {
  return connection
    .select('articles.*')
    .from('articles')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', '=', id)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: 'article id not found' });
      } else return article[0];
    });
};

exports.updateArticle = (id, votesToAdd = 0) => {
  if (typeof votesToAdd !== 'number') {
    return Promise.reject({ status: 400, msg: 'votes need to be numerical' });
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

exports.selectArticles = (
  sort_by = 'created_at',
  order = 'desc',
  topic,
  author
) => {
  if (order !== 'asc' && order !== 'desc') {
    return Promise.reject({
      status: 400,
      msg: "order must be 'asc' or 'desc'"
    });
  }

  return connection
    .select('articles.*')
    .from('articles')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by, order)
    .modify(querySoFar => {
      if (topic !== undefined) querySoFar.where({ 'articles.topic': topic });
      if (author !== undefined) querySoFar.where({ 'articles.author': author });
    })
    .then(articles => {
      return articles;
    });
};

exports.addArticle = (username, title, topic, body) => {
  const articleObj = {
    author: username,
    title: title,
    topic: topic,
    body: body
  };
  return connection('articles')
    .insert(articleObj)
    .returning('*')
    .then(result => {
      return result[0];
    });
};

exports.removeArticle = id => {
  return connection('articles')
    .where({ 'articles.article_id': id })
    .del()
    .returning('*')
    .then(deletedArticle => {
      if (deletedArticle.length === 0) {
        return Promise.reject({ status: 404, msg: 'article id not found' });
      }
      return deletedArticle;
    });
};
