const { updateComment, removeComment } = require('../models/comments.model');

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  return updateComment(comment_id, inc_votes)
    .then(updatedComment => {
      res.send({ comment: updatedComment[0] });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
