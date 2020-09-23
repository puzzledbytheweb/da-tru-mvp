import { Octokit } from '@octokit/rest';
import { retry } from '@octokit/plugin-retry';
import { throttling } from '@octokit/plugin-throttling';
import { GithubUser } from './octokit';
import { Logger } from '../utils/logger';
import prettyMs from 'pretty-ms';
import { Endpoints } from '@octokit/types';
import axios from 'axios';

interface Level {
  name: string;
  description: string;
  image?: string;
  threshold: number;
}

interface DaTruMvpOptions {
  levels?: Level[];
  githubAccessToken: string;
  baseUrl?: string;
}

interface ThrottleOpts {
  /** The request object */
  request: { /** What retry we are on */ retryCount: number };
  /** API method that was throttled */
  method: string;
  /** URL that was throttled */
  url: string;
}

// type listUserReposParameters = Endpoints['GET /repos/:owner/:repo']['parameters'];

type getUserParameters = Endpoints['GET /users/:username']['parameters'];

type getUserContributionsParameters = getUserParameters &
  Endpoints['GET /repos/:owner/:repo']['parameters'];

type getPullRequestParameters = Endpoints['GET /repos/:owner/:repo/pulls/:pull_number']['parameters'];

export class DaTruMvp {
  readonly github: Octokit;

  levels: Level[];
  baseUrl: string;
  logger: Logger;

  constructor(options: DaTruMvpOptions, logger: Logger) {
    this.levels = options.levels || defaultLevels;
    this.baseUrl = options.baseUrl || 'https://api.github.com';
    this.logger = logger;

    // https://github.com/intuit/auto/blob/5f3e936d5caa4adaef8939e478fa49c51850a45f/packages/core/src/git.ts#L132
    const GitHub = Octokit.plugin(retry, throttling);

    this.github = new GitHub({
      baseUrl: this.baseUrl,
      auth: options.githubAccessToken,
      previews: ['symmetra-preview'],
      throttle: {
        /** Add a wait once rate limit is hit */
        onRateLimit: (retryAfter: number, opts: ThrottleOpts) => {
          this.logger.log.warn(
            `Request quota exhausted for request ${opts.method} ${opts.url}`
          );

          if (opts.request.retryCount < 5) {
            this.logger.log.log(
              `Retrying after ${prettyMs(retryAfter * 1000)}!`
            );
            return true;
          }

          return false;
        },
        /** wait after abuse */
        onAbuseLimit: (retryAfter: number, opts: ThrottleOpts) => {
          this.logger.log.error(
            `Went over abuse rate limit ${opts.method} ${
              opts.url
            }, retrying in ${prettyMs(retryAfter * 1000)}.`
          );
          return true;
        },
      },
    });
  }

  getContributtingUsersForPullRequest = async (
    params: getPullRequestParameters
  ) => {
    const { data } = await this.github.pulls.listCommits(params);

    return data.map(({ commit, author }) => ({
      author,
      ...commit.author,
    }));
  };

  getUserContributions = async (params: getUserContributionsParameters) => {
    const {
      data: { login },
    } = await this.github.users.getByUsername(params);

    console.log(login);

    const res = await this.github.repos.get(params);

    const { contributors_url } = res.data;

    const contributorsData = axios.get(contributors_url);

    return contributorsData;
  };

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

const defaultLevels: Level[] = [
  {
    name: 'Apprentice',
    description:
      'An Apprentice of the arts of the Force. True potential in the form of a strong connection to the Force.',
    threshold: 1,
  },
  {
    name: 'Padawan',
    description: 'A fully-fledged Jedi at the beginning of their Journey.',
    threshold: 10,
  },
  {
    name: 'Knight',
    description:
      'An experienced Jedi capable of taking ownership of important and challenging missions.',
    threshold: 30,
  },
  {
    name: 'Master',
    description:
      'A true Master in the arts of the Force, capable of taking ownership of crucial missions and mentorship of lower stage Jedis.',
    threshold: 80,
  },
  {
    name: 'Legendary',
    description:
      'A legend whose history is taught in the records of the Jedi Archive. It is a priviledge to work with this individual, life-changing.',
    threshold: 200,
  },
];
