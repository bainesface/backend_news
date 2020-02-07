exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code !== undefined) {
    const PSQLcodes = {
      '22P02': { status: 400, msg: 'invalid id input' },
      '23502': { status: 400, msg: 'please add a comment' },
      '42703': { status: 400, msg: 'invalid query, column does not exist' }
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
