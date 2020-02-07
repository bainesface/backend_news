process.env.NODE_ENV = 'test';
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sams-chai-sorted'));
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
    it('status: 405', () => {
      const invalidMethods = ['patch', 'put', 'post', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/topics')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/users/:username', () => {
    it('GET: returns a status 200 and an object containing user information', () => {
      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body.user).to.contain.keys('username', 'avatar_url', 'name');
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
    it('status: 405', () => {
      const invalidMethods = ['patch', 'put', 'post', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/users/:username')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/articles/:article_id', () => {
    it('GET: returns a status 200 and an object containing the article object', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body.article).to.be.an('object');
          expect(body.article).to.have.keys(
            'author',
            'title',
            'article_id',
            'body',
            'topic',
            'created_at',
            'votes',
            'comment_count'
          );
          expect(body.article.author).to.equal('butter_bridge');
          expect(body.article.comment_count).to.equal('13');
        });
    });
    it('GET: returns a status 200 and an object containing the article object, with the comment count set to zero when no comments found for specified article', () => {
      return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body.article).to.be.an('object');
          expect(body.article).to.have.keys(
            'author',
            'title',
            'article_id',
            'body',
            'topic',
            'created_at',
            'votes',
            'comment_count'
          );
          expect(body.article.comment_count).to.equal('0');
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
          expect(body.msg).to.equal('invalid id input');
        });
    });
    it('PATCH: returns a status 200, updating the number of votes for the article id passed, and returning the updated object', () => {
      const patchInput = { inc_votes: 55 };
      return request(app)
        .patch('/api/articles/1')
        .send(patchInput)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(155);
          expect(body.article.author).to.equal('butter_bridge');
        });
    });
    it('PATCH: returns a status 200, decreasing number of votes for the article id passed when passed a negative number, returning the updated objects ', () => {
      const patchInput = { inc_votes: -55 };
      return request(app)
        .patch('/api/articles/1')
        .send(patchInput)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(45);
          expect(body.article.author).to.equal('butter_bridge');
        });
    });
    it('PATCH: returns a status 200, returning the unchanged article object, when passed an input with no information', () => {
      const patchInput = {};
      return request(app)
        .patch('/api/articles/1')
        .send(patchInput)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(100);
          expect(body.article.author).to.equal('butter_bridge');
        });
    });
    it('PATCH: returns a status 400 and relevant error message when the input value in non-numerical', () => {
      const patchInput = { inc_votes: 'more votes' };
      return request(app)
        .patch('/api/articles/1')
        .send(patchInput)
        .expect(400)
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
    it('PATCH: returns status 400 and the relevant error message when the article id is an invalid input', () => {
      const patchInput = { inc_votes: 55 };
      return request(app)
        .patch('/api/articles/thisarticle')
        .send(patchInput)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid id input');
        });
    });
    it('status: 405', () => {
      const invalidMethods = ['put', 'post', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles/:article_id')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/articles/:article_id/comments', () => {
    it('POST: returns status 201 and returns the comment added', () => {
      const postInput = { username: 'butter_bridge', body: 'very informative' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(postInput)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.body).to.equal('very informative');
        });
    });
    it('POST: returns 404 and a relevant message when the article id is valid but not found', () => {
      const postInput = { username: 'butter_bridge', body: 'very informative' };
      return request(app)
        .post('/api/articles/879/comments')
        .send(postInput)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('article id not found');
        });
    });
    it('POST: returns 400 and a relevant message when the article id is an invalid input', () => {
      const postInput = { username: 'butter_bridge', body: 'very informative' };
      return request(app)
        .post('/api/articles/hello/comments')
        .send(postInput)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid id input');
        });
    });
    it('POST: returns 404 and a relevant error message when the author in the input object cannot be found', () => {
      const postInput = { username: 'dogface', body: 'very informative' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(postInput)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('username not found');
        });
    });
    it('POST: returns 400 and a relevant error message when the comment in the input object is null', () => {
      const postInput = { username: 'butter_bridge', body: null };
      return request(app)
        .post('/api/articles/1/comments')
        .send(postInput)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('please add a comment');
        });
    });
    it('GET: returns a status 200 with an object containing an array of comment objects', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          body.comments.forEach(comment =>
            expect(comment).to.contain.keys(
              'comment_id',
              'votes',
              'created_at',
              'author',
              'body'
            )
          );
        });
    });
    it('GET: returns status 200 and an object containing empty array when the article id is valid but no comments are found', () => {
      return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.deep.equal([]);
        });
    });
    it('GET: returns status 404 and the relevant error message when the input article id is valid but does not exists', () => {
      return request(app)
        .get('/api/articles/3670/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('article id not found');
        });
    });
    it('GET: returns status 400 when the article id is an invalid input', () => {
      return request(app)
        .get('/api/articles/favearticle/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid id input');
        });
    });
    it('GET: returns status 200 and orders the comments by most recent (or descending) by default', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy('created_at', {
            descending: true
          });
        });
    });
    it('GET: returns a status 200 and orders the comments based on the query passed, for this example alphabetically by author', () => {
      return request(app)
        .get('/api/articles/1/comments?sort_by=author&order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy('author');
        });
    });
    it('GET: returns status 400 and the appropriate error message when asked to sort by a column that does not exist', () => {
      return request(app)
        .get('/api/articles/1/comments?sort_by=ideas')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid query, column does not exist');
        });
    });
    it("GET returns 400 and a message telling the user to give correct input when order is set to something other than 'asc' or 'desc'", () => {
      return request(app)
        .get('/api/articles/1/comments?order=ascending')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("order must be 'asc' or 'desc'");
        });
    });
    it('status: 405', () => {
      const invalidMethods = ['put', 'patch', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles/:article_id/comments')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/articles', () => {
    it('GET: returns status 200 and an array of article objects', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).to.contain.keys(
              'author',
              'title',
              'article_id',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            );
          });
        });
    });
    it('GET: returns status 200 and the articles array sorted by the most recent created when no query is passed', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy('created_at', {
            descending: true
          });
        });
    });
    it("GET returns 400 and a message telling the user to give correct input when order is set to something other than 'asc' or 'desc'", () => {
      return request(app)
        .get('/api/articles?order=ascending')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("order must be 'asc' or 'desc'");
        });
    });

    it('GET: returns status 200 and the articles array filterd by author passed in the query', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article.author).to.equal('butter_bridge');
          });
        });
    });

    it('GET: returns status 200 and an object containing an empty array when the author exists but has posted no articles', () => {
      return request(app)
        .get('/api/articles?author=lurker')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.deep.equal([]);
        });
    });

    it('GET: returns status 404 and the appropriate error message when passed an author that does not exist', () => {
      return request(app)
        .get('/api/articles/?author=letmein')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('username not found');
        });
    });
    it('GET: returns status 200 and the articles array filtered by the topic value passed in the query', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article.topic).to.equal('mitch');
          });
        });
    });
    it('GET: returns status 200 and an object containing an empty array when a topic exists but no articles are written about it', () => {
      return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.deep.equal([]);
        });
    });
    it('GET: returns status 404 and the appropriate error message when passed a topic that does not exist', () => {
      return request(app)
        .get('/api/articles?topic=hiya')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('topic does not exist');
        });
    });
    it('status: 405', () => {
      const invalidMethods = ['patch', 'put', 'post', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/comments/:comment_id', () => {
    it('PATCH: returns a status 200, updating the number of votes for the comment id passed, and returning the updated object', () => {
      const patchInput = { inc_votes: 1 };
      return request(app)
        .patch('/api/comments/1')
        .send(patchInput)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(17);
          expect(body.comment.author).to.equal('butter_bridge');
        });
    });
    it('PATCH: returns a status 200, decreasing the number of votes for the comment passed, and returning the updated object', () => {
      const patchInput = { inc_votes: -1 };
      return request(app)
        .patch('/api/comments/1')
        .send(patchInput)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(15);
          expect(body.comment.author).to.equal('butter_bridge');
        });
    });
    it('PATCH: returns status 400 and the relevant error message when the input value in non-numerical', () => {
      const patchInput = { inc_votes: 'addme' };
      return request(app)
        .patch('/api/comments/1')
        .send(patchInput)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('votes need to be numerical');
        });
    });
    it('PATCH: returns status 404 and an approriate error message when the comment id is valid but does not exist', () => {
      const patchInput = { inc_votes: 1 };
      return request(app)
        .patch('/api/comments/87655')
        .send(patchInput)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('comment id does not exist');
        });
    });
    it('PATCH: returns status 400 and an appropriate error message when the comment id is an invalid input', () => {
      const patchInput = { inc_votes: 1 };
      return request(app)
        .patch('/api/comments/commentshere')
        .send(patchInput)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid id input');
        });
    });
    it('PATCH: returns status 200 and returns the unchanged comment when no information in the request body', () => {
      const patchInput = {};
      return request(app)
        .patch('/api/comments/1')
        .send(patchInput)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(16);
        });
    });
    it('PATCH: returns status 200 and returns the unchanged comment when inc_votes property specified in the request body', () => {
      const patchInput = { adme: 2 };
      return request(app)
        .patch('/api/comments/1')
        .send(patchInput)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(16);
        });
    });
    it('DELETE: returns status 204 and no content', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(response => {
          expect(response.body).to.deep.equal({});
        });
    });
    it('DELETE: returns status 404 and a relevant error messgae when the comment id is valid but does not exist', () => {
      return request(app)
        .delete('/api/comments/98787576')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('comment id not found');
        });
    });
    it('DELETE: returns status 400 and the relevant error message when the comment id is an invalid input', () => {
      return request(app)
        .delete('/api/comments/deleteme')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid id input');
        });
    });
    it('status: 405', () => {
      const invalidMethods = ['get', 'put', 'post'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/comments/:comment_id')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  it('GET: returns status 200 and returns a JSON object describing all available endpints on the api', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).to.be.an('object');
      });
  });
  it('status: 405', () => {
    const invalidMethods = ['patch', 'put', 'post', 'delete'];
    const methodPromises = invalidMethods.map(method => {
      return request(app)
        [method]('/api')
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('method not allowed');
        });
    });
    return Promise.all(methodPromises);
  });
});
