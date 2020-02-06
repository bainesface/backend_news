const commentsRouter = require('express').Router();
const {
  patchComment,
  deleteComment
} = require('../controllers/comments.contoller');
const { send405Error } = require('../errors');

commentsRouter
  .route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(send405Error);

module.exports = commentsRouter;
