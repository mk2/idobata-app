import React from "react";
import { SectionList, SectionListData, ListRenderItemInfo, Alert, View, Text } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { Query, QueryResult } from "react-apollo";
import gql from "graphql-tag";
import { Image, Icon, Header, ListItem } from "react-native-elements";
import _ from "lodash";

type Props = {
  navigation: NavigationScreenProp<any>;
};

type State = {};

const query = gql`
  {
    viewer {
      organizations(last: 100) {
        edges {
          node {
            name
            slug
            id
          }
        }
      }

      rooms(last: 100) {
        edges {
          node {
            id
            name
            organization {
              id
            }
          }
        }
      }
    }
  }
`;

export default class Rooms extends React.Component<Props, State> {
  onPressRoom = (room: any) => {
    return () => {
      console.log({ room });
      this.props.navigation.navigate("Chat", { room });
    };
  };

  keyExtractor = (item: any, index: number) => "" + item.title + index;

  renderRoom = ({ item: room }: { item: { id: string; name: string } }) => {
    return (
      <ListItem
        containerStyle={{ backgroundColor: "#36312f" }}
        topDivider={true}
        title={room.name}
        titleStyle={{ color: "white" }}
        onPress={this.onPressRoom(room)}
        rightElement={<Icon name="keyboard-arrow-right" />}
      />
    );
  };

  renderOrganization = (info: { section: SectionListData<any> }) => {
    return (
      <ListItem
        containerStyle={{ backgroundColor: "#524946" }}
        topDivider={true}
        title={info.section.title}
        titleStyle={{ color: "white" }}
      />
    );
  };

  renderList = (result: QueryResult) => {
    if (result.loading) {
      return null;
    }
    const organizations = result.data.viewer.organizations.edges.map((org: any) => org.node);
    const rooms = result.data.viewer.rooms.edges.map((room: any) => room.node);
    const data = organizations.map((org: any) => {
      return {
        title: org.name,
        data: _.filter(rooms, (room: any) => room.organization.id === org.id),
      };
    });
    return (
      <SectionList
        style={{ backgroundColor: "#36312f" }}
        renderItem={this.renderRoom}
        renderSectionHeader={this.renderOrganization}
        sections={data}
        keyExtractor={this.keyExtractor}
      />
    );
  };

  render() {
    return (
      <>
        <Header centerComponent={{ text: "Rooms" }} />
        <Query query={query}>{result => this.renderList(result)}</Query>
      </>
    );
  }
}
