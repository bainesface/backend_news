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
  });
  describe('/users:username', () => {
    it('GET: returns a status 200 and an object containing user information', () => {
      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body.user[0]).to.contain.keys(
            'username',
            'avatar_url',
            'name'
          );
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
          expect(body.article[0]).to.contain.keys(
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
          expect(body.msg).to.equal('invalid id input');
        });
    });
    it('PATCH: returns a status 202, updating the number of votes for the article id passed, and returning the updated object', () => {
      const patchInput = { inc_votes: 55 };
      return request(app)
        .patch('/api/articles/1')
        .send(patchInput)
        .expect(202)
        .then(({ body }) => {
          expect(body.updatedArticle[0].votes).to.equal(155);
          expect(body.updatedArticle[0].author).to.equal('butter_bridge');
        });
    });
    it('PATCH: returns a status 202, decreasing number of votes for the article id passed when passed a negative number, returning the updated objects ', () => {
      const patchInput = { inc_votes: -55 };
      return request(app)
        .patch('/api/articles/1')
        .send(patchInput)
        .expect(202)
        .then(({ body }) => {
          expect(body.updatedArticle[0].votes).to.equal(45);
          expect(body.updatedArticle[0].author).to.equal('butter_bridge');
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
  });
  describe('/articles/:article_id/comments', () => {
    it('POST: returns status 201 and returns the comment added', () => {
      const postInput = { butter_bridge: 'very informative' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(postInput)
        .expect(201)
        .then(({ body }) => {
          expect(body.addedComment[0].body).to.equal('very informative');
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
          expect(body.msg).to.equal('invalid id input');
        });
    });
    it('POST: returns 404 and a relevant error message when the author in the input object cannot be found', () => {
      const postInput = { dogface: 'very informative' };
      return request(app)
        .post('/api/articles/1/comments')
        .send(postInput)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('username not found');
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
    it('GET: returns status 200 and the articles array filterd by username passed in the query', () => {
      return request(app)
        .get('/api/articles?username=butter_bridge')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article.author).to.equal('butter_bridge');
          });
        });
    });
    it('GET: returns status 200 and an object containing an empty array when the user exists but has posted no articles', () => {
      return request(app)
        .get('/api/articles?username=lurker')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.deep.equal([]);
        });
    });
    it('GET: returns status 404 and the appropriate error message when passed a username that does not exist', () => {
      return request(app)
        .get('/api/articles/?username=letmein')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('username does not exist');
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
  });
  describe('/comments/:comment_id', () => {
    it('PATCH: returns a status 202, updating the number of votes for the comment id passed, and returning the updated object', () => {
      const patchInput = { inc_votes: 1 };
      return request(app)
        .patch('/api/comments/1')
        .send(patchInput)
        .expect(202)
        .then(({ body }) => {
          expect(body.updatedComment[0].votes).to.equal(17);
          expect(body.updatedComment[0].author).to.equal('butter_bridge');
        });
    });
    it('PATCH: returns a status 202, decreasing the number of votes for the comment passed, and returning the updated object', () => {
      const patchInput = { inc_votes: -1 };
      return request(app)
        .patch('/api/comments/1')
        .send(patchInput)
        .expect(202)
        .then(({ body }) => {
          expect(body.updatedComment[0].votes).to.equal(15);
          expect(body.updatedComment[0].author).to.equal('butter_bridge');
        });
    });
    it('PATCH: returns status 406 and the relevant error message when the input value in non-numerical', () => {
      const patchInput = { inc_votes: 'addme' };
      return request(app)
        .patch('/api/comments/1')
        .send(patchInput)
        .expect(406)
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
  });
});
