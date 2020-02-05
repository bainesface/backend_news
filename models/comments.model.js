const connection = require('../connection');
const { checkIfArticleExists } = require('./articles.model');

exports.selectComments = (id, sort_by, order) => {
  if (order === undefined) order = 'desc';
  if (sort_by === undefined) sort_by = 'created_at';
  return connection
    .select('*')
    .from('comments')
    .where('article_id', '=', id)
    .modify(querySoFar => {
      if (sort_by !== undefined) querySoFar.orderBy(sort_by, order);
    })
    .then(result => {
      return Promise.all([result, checkIfArticleExists(id)]);
    })
    .then(([result, articleExists]) => {
      if (articleExists) {
        return result;
      } else
        return Promise.reject({ status: 404, msg: 'article id not found' });
    });
};

exports.addComment = (body, article_id) => {
  let username;
  for (key in body) {
    username = key;
  }
  const commentObj = {
    article_id: article_id,
    author: username,
    body: body[username]
  };
  return connection('comments')
    .insert(commentObj)
    .returning('*')
    .then(result => {
      return result;
    });
};

exports.updateComment = (id, num) => {
  if (typeof num !== 'number') {
    return Promise.reject({ status: 406, msg: 'votes need to be numerical' });
  }
  return connection('comments')
    .where('comment_id', '=', id)
    .increment('votes', num)
    .returning('*')
    .then(updatedComment => {
      if (updatedComment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'comment id does not exist'
        });
      }
      return updatedComment;
    });
};

exports.removeComment = id => {
  return connection('comments')
    .where({ 'comments.comment_id': id })
    .del()
    .returning('*')
    .then(deletedComment => {
      if (deletedComment.length === 0) {
        return Promise.reject({ status: 404, msg: 'comment id not found' });
      }
      return deletedComment;
    });
};
