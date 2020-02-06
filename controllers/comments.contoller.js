const { updateComment, removeComment } = require('../models/comments.model');

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  return updateComment(comment_id, inc_votes)
    .then(updatedComment => {
      res.status(202).send({ updatedComment: updatedComment });
    })
    .catch(err => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return removeComment(comment_id)
    .then(response => {
      res.status(204).send();
    })
    .catch(err => {
      next(err);
    });
};
