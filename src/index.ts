import { GithubUser } from './octokit';

interface Level {
  name: string;
  description: string;
  image?: string;
  threshold: number;
}

interface DaTruMvpOptions {
  levels: Level[];
  githubAccessToken: string;
}

class DaTruMvp {
  levels: Level[];
  constructor(options: DaTruMvpOptions) {
    this.levels = options.levels;
  }

  getLevelForGivenUser(user: GithubUser): Level | null {
    if (user.type !== 'User') return null;

    const foundLevel = this.levels.find(
      level => level.threshold >= user.contributions
    );

    // Get the highest threshold level
    if (!foundLevel)
      return this.levels.sort(
        (levelA, levelB) => levelB.threshold - levelA.threshold
      )[0];

    return foundLevel;
  }
}

const testUser = {
  login: 'luisFilipePT',
  id: 9373787,
  node_id: 'MDQ6VXNlcjkzNzM3ODc=',
  avatar_url: 'https://avatars0.githubusercontent.com/u/9373787?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/luisFilipePT',
  html_url: 'https://github.com/luisFilipePT',
  followers_url: 'https://api.github.com/users/luisFilipePT/followers',
  following_url:
    'https://api.github.com/users/luisFilipePT/following{/other_user}',
  gists_url: 'https://api.github.com/users/luisFilipePT/gists{/gist_id}',
  starred_url:
    'https://api.github.com/users/luisFilipePT/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/luisFilipePT/subscriptions',
  organizations_url: 'https://api.github.com/users/luisFilipePT/orgs',
  repos_url: 'https://api.github.com/users/luisFilipePT/repos',
  events_url: 'https://api.github.com/users/luisFilipePT/events{/privacy}',
  received_events_url:
    'https://api.github.com/users/luisFilipePT/received_events',
  type: 'User',
  site_admin: false,
  contributions: 100,
};

const yo = new DaTruMvp({
  levels: [
    {
      name: 'yo',
      description: 'That',
      threshold: 2,
    },
    {
      name: 'Hey',
      description: 'That',
      threshold: 30,
    },
    {
      name: 'Great',
      description: 'That',
      threshold: 40,
    },
  ],
  githubAccessToken: '',
});

const thatLevel = yo.getLevelForGivenUser(testUser);

console.log(thatLevel);

// getUserContributions({ repo: 'reach4help', owner: 'reach4help' }).then(res =>
//   console.log(res.data)
// );
