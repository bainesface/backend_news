const apiRouter = require('express').Router();
const topicsRouter = require('./topics.router.js');
const usersRouter = require('./users.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const { getEndpoints } = require('../controllers/api.controller');
const { send405Error } = require('../errors');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter
  .route('/')
  .get(getEndpoints)
  .all(send405Error);

module.exports = apiRouter;
