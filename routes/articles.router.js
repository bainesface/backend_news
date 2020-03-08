const articlesRouter = require('express').Router();
const {
  patchArticle,
  postComment,
  getCommentsByArticleID,
  getArticles,
  getArticleByArticleId,
  postArticle,
  deleteArticle
} = require('../controllers/articles.controller');
const { send405Error } = require('../errors');

articlesRouter
  .route('/:article_id/comments')
  .post(postComment)
  .get(getCommentsByArticleID)
  .all(send405Error);

articlesRouter
  .route('/:article_id')
  .get(getArticleByArticleId)
  .patch(patchArticle)
  .delete(deleteArticle)
  .all(send405Error);

articlesRouter
  .route('/')
  .get(getArticles)
  .post(postArticle)
  .all(send405Error);

module.exports = articlesRouter;
