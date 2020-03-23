exports.handlePSQLErrors = (err, req, res, next) => {
  console.log(err);
  if (err.code !== undefined) {
    const PSQLcodes = {
      '22P02': { status: 400, msg: 'invalid id input' },
      '23502': { status: 400, msg: 'please add a body of text' },
      '42703': { status: 400, msg: 'invalid query, column does not exist' }
      //'23503': { status: 404, msg: 'username not found' }
    };
    const statusToSend = PSQLcodes[err.code].status;
    const messageToSend = PSQLcodes[err.code].msg;

    res.status(statusToSend).send({ msg: messageToSend });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: 'method not allowed' });
};
