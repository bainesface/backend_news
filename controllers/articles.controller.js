const {
  selectArticle,
  getCommentCountByArticleID,
  updateArticle
} = require('../models/articles.model');

const { getComments, addComment } = require('../models/comments.model');

exports.getArticleByArticleID = (req, res, next) => {
  //console.log('in article controller');
  const { article_id } = req.params;
  return Promise.all([
    selectArticle(article_id),
    getCommentCountByArticleID(article_id)
  ])
    .then(([articleData, commentCount]) => {
      const articleObj = { ...articleData, comment_count: commentCount };
      res.send(articleObj);
    })
    .catch(err => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return updateArticle(article_id, inc_votes)
    .then(updatedArticle => {
      res.status(202).send(updatedArticle);
    })
    .catch(err => {
      next(err);
    });
};

exports.postCommentByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticle(article_id)
    .then(articleData => {
      for (key in req.body) {
        if (articleData.author === key) {
          return addComment(req.body, articleData.article_id).then(
            addedComment => {
              const comment = addedComment[0].body;
              res.status(201).send({ msg: comment });
            }
          );
        } else
          return Promise.reject({ status: 400, msg: 'invalid username input' });
      }
    })
    .catch(err => {
      next(err);
    });
};
