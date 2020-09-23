import { Octokit } from '@octokit/rest';
import { Endpoints } from '@octokit/types';
import axios from 'axios';

const octokit = new Octokit();

type listForOrgParameters = Endpoints['GET /orgs/:org/repos']['parameters'];
export const getOrgRepos = async (options: listForOrgParameters | any) => {
  console.log('YO');
  return octokit.repos.listForOrg(options);
};

type listUserReposParameters = Endpoints['GET /repos/:owner/:repo']['parameters'];

export interface GithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  contributions: number;
}

export const getUserContributions = async (params: listUserReposParameters) => {
  const res = await octokit.repos.get(params);

  const { contributors_url } = res.data;

  return axios.get(contributors_url);
};

export const getPullRequestContributors = async () => {};

export const getRateLimit = () => octokit.request('GET /rate_limit');
