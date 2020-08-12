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

export const getUserContributions = async (params: listUserReposParameters) => {
  const res = await octokit.repos.get(params);

  const { contributors_url } = res.data;

  return axios.get(contributors_url);
};
