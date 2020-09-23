import { DaTruMvp } from './lib';
import { createLogger } from './utils/logger';

const main = async () => {
  const owner = 'reach4help';
  const repo = 'reach4help';

  const daTruMvp = new DaTruMvp(
    {
      githubAccessToken: process.env.GH_TOKEN || '',
      baseUrl: process.env.BASE_URL,
    },
    createLogger()
  );

  const pull_number = 986;

  const contributtingUsersForPullRequest = await daTruMvp.getContributtingUsersForPullRequest(
    {
      owner,
      repo,
      pull_number,
    }
  );

  const userContributions = await Promise.all(
    contributtingUsersForPullRequest.map(
      async user =>
        await daTruMvp.getUserContributions({
          username: user.author.login,
          owner,
          repo,
        })
    )
  );

  console.log(userContributions);
};

main();
