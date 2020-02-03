const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');
const articlesArray = require('../db/data/test-data/articles');

describe('formatDates', () => {
  //take an array of objects
  //return new array of object
  //change the timestamp to be a javascript date
  //dont change anything else
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

    const jsDate = new Date(1542284514171);
    const actual = formatDates(input);
    const expected = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: jsDate,
        votes: 100
      }
    ];
    expect(actual).to.deep.equal(expected);
  });
  it('returns an array of objects, converting each created_at value into a JavaScript date object, when passed an array of objects', () => {
    const input = articlesArray;
    const actual = formatDates(input);
    actual.forEach(object => {
      expect(object.created_at).to.deep.equal(new Date(object.created_at));
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

describe('makeRefObj', () => {});

describe('formatComments', () => {});
