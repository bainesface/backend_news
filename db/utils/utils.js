exports.formatDates = list => {
  if (list.length === 0) return [];

  const newArr = list.map(object => {
    let newOb = { ...object };
    let jsDate = new Date(newOb.created_at);
    newOb.created_at = jsDate;
    return newOb;
  });

  return newArr;
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

  const newArr = comments.map(object => {
    const newObj = { ...object };
    newObj.author = newObj.created_by;
    delete newObj.created_by;
    newObj.article_id = articleRef[object.belongs_to];
    delete newObj.belongs_to;

    newObj.created_at = new Date(newObj.created_at);
    return newObj;
  });
  return newArr;
};
