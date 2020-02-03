const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');
const articlesArray = require('../db/data/test-data/articles');

describe('formatDates', () => {
  it('returns an empty array when an empty array is passed', () => {
    expect(formatDates([])).to.deep.equal([]);
  });
  it('returns an array of one object with the created_at value changed to a JavaScript date object, when passed a single object array', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = formatDates(input);
    expect(actual[0].created_at instanceof Date).to.be.true;
  });
  it('returns an array of objects, converting each created_at value into a JavaScript date object, when passed an array of objects', () => {
    const input = articlesArray;
    formatDates(input).forEach(object => {
      expect(object.created_at instanceof Date).to.be.true;
    });
  });
  it('returns a new array, without mutating the input array', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    formatDates(input);
    const check = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(input).to.deep.equal(check);
  });
});

describe('makeRefObj', () => {
  it('returns an empty object when an empty array is passed', () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it('returns a single key value pair object when passed a single object array', () => {
    const input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = makeRefObj(input, 'title', 'article_id');
    const expected = { 'Living in the shadow of a great man': 1 };
    expect(actual).to.deep.equal(expected);
  });
  it('returns a multiple key value object when passed a multiple object array', () => {
    const input = [
      {
        article_id: 1,
        title: 'Seven inspirational thought leaders from Manchester UK',
        topic: 'mitch',
        author: 'rogersop',
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: 406988514171
      },
      {
        article_id: 2,
        title: 'Am I a cat?',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
        created_at: 280844514171
      },
      {
        article_id: 3,
        title: 'Moustache',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'Have you seen the size of that thing?',
        created_at: 154700514171
      }
    ];
    const actual = makeRefObj(input, 'title', 'article_id');
    const expected = {
      'Seven inspirational thought leaders from Manchester UK': 1,
      'Am I a cat?': 2,
      Moustache: 3
    };
    expect(actual).to.deep.equal(expected);
  });
});

describe('formatComments', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatComments([])).to.deep.equal([]);
  });
  it('returns an signle formatted object array when passed a single object array and reference object', () => {
    const inputArr = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to: "They're not exactly dogs, are they?",
          created_by: 'butter_bridge',
          votes: 16,
          created_at: 1511354163389
        }
      ],
      dateObj = new Date(1511354163389);

    const refObj = { "They're not exactly dogs, are they?": 1 };
    const actual = formatComments(inputArr, refObj);
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: 'butter_bridge',
        votes: 16,
        created_at: dateObj
      }
    ];
    expect(actual[0]).to.deep.equal(expected[0]);
  });
  it('returns a new array of formatted objects when passed a multiple object array', () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389
      }
    ];

    const refObj = {
      "They're not exactly dogs, are they?": 1,
      'Living in the shadow of a great man': 2,
      'doop de doo': 3
    };

    const actual = formatComments(input, refObj);
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: 'butter_bridge',
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        article_id: 2,
        author: 'butter_bridge',
        votes: 14,
        created_at: new Date(1479818163389)
      },
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        article_id: 2,
        author: 'icellusedkars',
        votes: 100,
        created_at: new Date(1448282163389)
      }
    ];
    expect(actual).to.deep.equal(expected);
  });
  it('objects within input array are not mutated', () => {
    const inputArr = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const inputRefObj = { "They're not exactly dogs, are they?": 1 };
    const actual = formatComments(inputArr, inputRefObj);
    expect(actual[0]).to.not.equal(inputArr[0]);
  });
  it('does not mutate the original array', () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const refObj = { "They're not exactly dogs, are they?": 1 };
    formatComments(input, refObj);
    const check = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(input).to.deep.equal(check);
  });
});
