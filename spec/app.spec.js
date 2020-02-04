process.env.NODE_ENV = 'test';
const app = require('../app');
const { expect } = require('chai');
const request = require('supertest');
const connection = require('../connection');

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe('/topics', () => {
    it('GET: returns status 200 and an object containing an array of topic objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an('object');
          expect(response.body.topics[0]).to.contain.keys(
            'description',
            'slug'
          );
        });
    });
  });
  describe('/users:username', () => {
    it('GET: returns a status 200 and an object containing user information', () => {
      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body).to.contain.keys('username', 'avatar_url', 'name');
        });
    });
    it('GET: returns status 404 and relevant error message when the username inputted cannot be found', () => {
      return request(app)
        .get('/api/users/boblahbla')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('username not found');
        });
    });
  });
  describe('/articles/:article_id', () => {
    it('GET: returns a status 200 and an object containing the article object', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body).to.contain.keys(
            'author',
            'title',
            'article_id',
            'body',
            'topic',
            'created_at',
            'votes',
            'comment_count'
          );
        });
    });
    it('GET: returns a status 404 and relevant error message when the article id is valid but not found', () => {
      return request(app)
        .get('/api/articles/8000')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('article id not found');
        });
    });
    it('GET: returns a status 400 and the relevant error message when the article id is an invalid input', () => {
      return request(app)
        .get('/api/articles/hola')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid article id input');
        });
    });
    it('PATCH: returns a status 202, updating the number of votes for the article id passed, and returning the updated object', () => {
      const patchInput = { inc_votes: 55 };
      return request(app)
        .patch('/api/articles/1')
        .send(patchInput)
        .expect(202)
        .then(({ body }) => {
          expect(body.votes).to.equal(155);
          expect(body.author).to.equal('butter_bridge');
        });
    });
    it('PATCH: returns a status 406 and relevant error message when the input value in non-numerical', () => {
      const patchInput = { inc_votes: 'more votes' };
      return request(app)
        .patch('/api/articles/1')
        .send(patchInput)
        .expect(406)
        .then(({ body }) => {
          expect(body.msg).to.equal('votes need to be numerical');
        });
    });
    it('PATCH: returns status 404 and relevant error message when the article id is valid but does not exist', () => {
      const patchInput = { inc_votes: 55 };
      return request(app)
        .patch('/api/articles/867')
        .send(patchInput)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('article id not found');
        });
    });
  });
  describe('/articles/:article_id/comments', () => {
    it('POST: returns status 201 and returns the comment added', () => {
      const postInput = { butter_bridge: 'very informative' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(postInput)
        .expect(201)
        .then(({ body }) => {
          expect(body.msg).to.equal('very informative');
        });
    });
    it('POST: returns 404 and a relevant message when the article id is valid but not found', () => {
      const postInput = { butter_bridge: 'very informative' };
      return request(app)
        .post('/api/articles/879/comments')
        .send(postInput)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('article id not found');
        });
    });
    it('POST: returns 400 and a relevant message when the article id is an invalid input', () => {
      const postInput = { butter_bridge: 'very informative' };
      return request(app)
        .post('/api/articles/hello/comments')
        .send(postInput)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid article id input');
        });
    });
    it('POST: returns 400 and a relevant error message when the author in the input object cannot be found', () => {
      const postInput = { dogface: 'very informative' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(postInput)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid username input');
        });
    });
    it('POST: returns 404 and a relevant error message when the comment in the input object is null', () => {
      const postInput = { butter_bridge: null };
      return request(app)
        .post('/api/articles/1/comments')
        .send(postInput)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('please add a comment');
        });
    });
  });
});
