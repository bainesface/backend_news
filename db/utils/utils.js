exports.formatDates = list => {
  if (list.length === 0) return [];

  const formattedArticlesList = list.map(object => {
    let formattedArticle = { ...object };
    let jsDate = new Date(formattedArticle.created_at);
    formattedArticle.created_at = jsDate;
    return formattedArticle;
  });

  return formattedArticlesList;
};

exports.makeRefObj = (list, key, value) => {
  if (list.length === 0) return {};

  return list.reduce((refObj, currObj) => {
    const refKey = currObj[key];
    const refValue = currObj[value];
    refObj[refKey] = refValue;
    return refObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  if (comments.length === 0) return [];

  const formattedCommentsList = comments.map(object => {
    const formattedComment = { ...object };
    formattedComment.author = formattedComment.created_by;
    delete formattedComment.created_by;
    formattedComment.article_id = articleRef[object.belongs_to];
    delete formattedComment.belongs_to;

    formattedComment.created_at = new Date(formattedComment.created_at);
    return formattedComment;
  });
  return formattedCommentsList;
};
