const connection = require('../connection');

// exports.getComments = id => {
//   return connection
//     .select('*')
//     .from('comments')
//     .where('article_id', '=', id)
//     .then(result => {
//       return result;
//     });
// };

exports.addComment = (body, article_id) => {
  for (key in body) {
    const commentObj = { article_id: article_id, author: key, body: body[key] };
    return connection('comments')
      .insert(commentObj)
      .returning('*')
      .then(result => {
        return result;
      });
  }
};
