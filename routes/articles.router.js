const articlesRouter = require('express').Router();
const {
  getArticle,
  patchArticle,
  postComment
} = require('../controllers/articles.controller');

articlesRouter.route('/:article_id/comments').post(postComment);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle);

module.exports = articlesRouter;
