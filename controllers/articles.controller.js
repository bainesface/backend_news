const {
  selectArticle,
  updateArticle,
  selectArticles
} = require('../models/articles.model');
const { selectUser } = require('../models/users.model');
const { selectComments, addComment } = require('../models/comments.model');

exports.getArticleByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  return Promise.all([selectArticle(article_id), selectComments(article_id)])
    .then(([articleData, commentsData]) => {
      articleData[0].comment_count = commentsData.length;
      res.send({ article: articleData });
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
      res.status(202).send({ updatedArticle: updatedArticle });
    })
    .catch(err => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  let username;
  for (key in req.body) {
    username = key;
  }
  return Promise.all([selectArticle(article_id), selectUser(username)])
    .then(([articleData, userData]) => {
      if (userData.length !== 0) {
        return addComment(req.body, articleData.article_id);
      }
    })
    .then(addedComment => {
      res.status(201).send({ addedComment: addedComment });
    })
    .catch(err => {
      next(err);
    });
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  return selectComments(article_id, sort_by, order)
    .then(comments => {
      comments.forEach(comment => {
        delete comment.article_id;
        return comment;
      });
      res.send({ comments: comments });
    })
    .catch(err => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, username, topic } = req.query;
  return selectArticles(sort_by, order, username, topic)
    .then(articles => {
      res.send({ articles: articles });
    })

    .catch(err => {
      next(err);
    });
};
