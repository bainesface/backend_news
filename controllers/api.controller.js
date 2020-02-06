const { fetchEndpoints } = require('../models/api.model');

exports.getEndpoints = (req, res, next) => {
  return fetchEndpoints()
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      next(err);
    });
};
