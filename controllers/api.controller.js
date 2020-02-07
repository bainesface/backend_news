const endPoints = require('../endpoints.json');

exports.getEndpoints = (req, res, next) => {
  res.send(endPoints).catch(next);
};
