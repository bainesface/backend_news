const {
  updateArticle,
  selectArticles,
  checkIfArticleExists,
  selectArticle
} = require('../models/articles.model');
const { selectUser } = require('../models/users.model');
const { selectComments, addComment } = require('../models/comments.model');
const { selectTopics } = require('../models/topics.model');

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticle(article_id)
    .then(article => {
      res.send({ article: article });
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
      res.send({ article: updatedArticle[0] });
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
  return Promise.all([
    selectArticle(article_id),
    selectUser(username),
    checkIfArticleExists(article_id)
  ])
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
  const { sort_by, order, topic, author } = req.query;
  return selectTopics(topic)
    .then(topic => {
      return selectUser(author);
    })
    .then(user => {
      return selectArticles(sort_by, order, topic, author);
    })
    .then(articles => {
      res.send({ articles: articles });
    })
    .catch(err => {
      next(err);
    });
};
