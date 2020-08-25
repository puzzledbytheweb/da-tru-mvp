import { DaTruMvp } from '../src';
import { buildUser } from './utils';

const levels = [
  { name: 'Rookie', description: 'Rookie Level', threshold: 1 },
  { name: 'Adept', description: 'Adept Level', threshold: 10 },
  { name: 'Padawan', description: 'Padawan Level', threshold: 30 },
];

describe('DaTruMvp', () => {
  it('Throws an error if the Github Access Token is not provided or is an empty string', () => {
    expect(
      () =>
        new DaTruMvp({
          githubAccessToken: '',
        })
    ).toThrowErrorMatchingInlineSnapshot(
      `"You need to define a Github Access Token"`
    );

    // TODO: Create test to check if it throws error when githubAccessToken is not passed
  });

  it("Returns the correct first level that has a lesser or equal threshold than the user's contributions", () => {
    const user1 = buildUser({ contributions: 29 });
    const user2 = buildUser({ contributions: 30 });

    const myTruMvp = new DaTruMvp({
      levels,
      githubAccessToken: 'FAKE GITHUB ACCESS TOKEN',
    });

    const level1 = myTruMvp.getLevelForGivenUser(user1);
    const level2 = myTruMvp.getLevelForGivenUser(user2);

    expect(level1).toBe(levels.find(level => level.name === 'Padawan'));
    expect(level2).toBe(levels.find(level => level.name === 'Padawan'));
  });

  it('Returns the the level with the highest threshold if contributions go over the llast level threshold', () => {
    const user = buildUser({ contributions: 100 });

    const myTruMvp = new DaTruMvp({
      levels,
      githubAccessToken: 'FAKE GITHUB ACCESS TOKEN',
    });

    const level = myTruMvp.getLevelForGivenUser(user);

    expect(level).toBe(levels.find(level => level.name === 'Padawan'));
  });
});
