const {
  updateArticle,
  selectArticles,
  selectArticle,
  addArticle,
  removeArticle
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
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  return addComment(username, body, article_id)
    .then(addedComment => {
      res.status(201).send({ comment: addedComment });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { username, title, topic, body } = req.body;

  return addArticle(username, title, topic, body)
    .then(addedArticle => {
      res.status(201).send({ article: addedArticle });
    })
    .catch(next);
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
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, author } = req.query;

  return selectTopics(topic)
    .then(() => {
      if (author !== undefined) return selectUser(author);
    })
    .then(() => {
      return selectArticles(sort_by, order, topic, author);
    })
    .then(articles => {
      res.send({ articles: articles });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  return removeArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
