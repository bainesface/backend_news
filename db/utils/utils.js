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

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
