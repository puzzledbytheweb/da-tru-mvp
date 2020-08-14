import * as faker from 'faker';
import { random } from 'faker';

export function buildUser(overrides?: object) {
  return {
    login: faker.name.firstName(),
    id: faker.random.number(),
    node_id: faker.random.uuid(),
    avatar_url: faker.random.image(),
    gravatar_id: '',
    url: faker.internet.domainName(),
    html_url: faker.internet.domainName(),
    followers_url: faker.internet.domainName(),
    following_url: faker.internet.domainName(),
    gists_url: faker.internet.domainName(),
    starred_url: faker.internet.domainName(),
    subscriptions_url: faker.internet.domainName(),
    organizations_url: faker.internet.domainName(),
    repos_url: faker.internet.domainName(),
    events_url: faker.internet.domainName(),
    received_events_url: faker.internet.domainName(),
    type: 'User',
    site_admin: false,
    contributions: random.number(),
    ...overrides,
  };
}
