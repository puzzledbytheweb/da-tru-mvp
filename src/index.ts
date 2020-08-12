import { getUserContributions } from './octokit';

// const defaultOptions = {
//   levels: [
//     {
//       name: 'First Level',
//       description: 'First Level Description',
//       image: 'ImageURL',
//       threshold: 1,
//     },
//     {
//       name: 'Second Level',
//       description: 'Second Level Description',
//       image: 'ImageURL',
//       threshold: 2,
//     },
//   ],
//   githubAccessToken: null,
// };

getUserContributions({ owner: 'reach4help', repo: 'reach4help' }).then(res =>
  console.log(res)
);
