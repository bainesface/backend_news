const connection = require('../connection');

exports.selectComments = id => {
  return connection
    .select('*')
    .from('comments')
    .where('article_id', '=', id)
    .then(result => {
      return result;
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
