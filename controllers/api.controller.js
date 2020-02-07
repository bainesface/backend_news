const endPoints = require('../endpoints.json');

exports.getEndpoints = (req, res, next) => {
  res.send({ endpoints: endPoints }).catch(next);
};
