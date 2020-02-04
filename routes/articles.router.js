const articlesRouter = require('express').Router();
const {
  getArticleByArticleID,
  patchArticle,
  postCommentByArticleID
} = require('../controllers/articles.controller');

articlesRouter.route('/:article_id/comments').post(postCommentByArticleID);

articlesRouter
  .route('/:article_id')
  .get(getArticleByArticleID)
  .patch(patchArticle);

module.exports = articlesRouter;
