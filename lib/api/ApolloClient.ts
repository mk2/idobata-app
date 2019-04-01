import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

export default function getClient(accessToken: string) {
  console.log({accessToken});
  return new ApolloClient({
    uri: 'https://api.idobata.io/graphql',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
