import React from "react";
import _ from "lodash";
import { Platform, FlatList, ScrollView, Alert, View, Text, KeyboardAvoidingView, StyleSheet } from "react-native";
import { NavigationEvents, NavigationScreenProp } from "react-navigation";
import { Header, Avatar, Button, Image, Icon, Input, Overlay, ListItem } from "react-native-elements";
import { Query, Mutation, QueryResult } from "react-apollo";
import HTMLView from "react-native-htmlview";
import gql from "graphql-tag";
import Submit from "./Submit";
import MessageItem from "./MessageItem";

const FETCH_MESSAGE_QUERY = gql`
  query data($id: ID!, $startCursor: String) {
    node(id: $id) {
      __typename
      ... on Room {
        messages(last: 20, before: $startCursor) {
          edges {
            node {
              body
              source
              createdAt
              sender {
                id
                name
                iconUrl
              }
            }
          }
          pageInfo {
            startCursor
            hasPreviousPage
          }
        }
      }
    }
  }
`;

type Props = {
  navigation: NavigationScreenProp<any>;
};

type State = {
  room: { id: string | null; name: string | null; description: string | null };
  visibleRoomDescriptionOverlay: boolean;
};

export default class Rooms extends React.Component<Props, State> {
  private submitFormInput: Input | null = null;
  private previousMessages: any[] = [];

  state = {
    room: { id: null, name: null, description: null },
    visibleRoomDescriptionOverlay: false,
  };

  renderListItem(info: any) {
    return <MessageItem sender={info.item.sender} body={info.item.body} createdAt={info.item.createdAt} />;
  }

  keyExtractor = (item: any, index: number) => "" + index;

  renderMessageList(result: QueryResult<any, any>) {
    const previousMessagesFlatList = (
      <FlatList
        style={{ flex: 1 }}
        inverted={true}
        keyExtractor={this.keyExtractor}
        data={this.previousMessages}
        renderItem={this.renderListItem}
      />
    );
    if (result.loading) {
      return previousMessagesFlatList;
    }

    if (result.error) {
      Alert.alert("GraphQLエラー", result.error.toString());
      return previousMessagesFlatList;
    }

    const refetch = result.refetch;
    const startPolling = result.startPolling;
    const stopPolling = result.stopPolling;
    const messages = result.data.node.messages.edges
      .map((m: any) => ({
        body: m.node.body,
        source: m.node.source,
        sender: m.node.sender,
        createdAt: m.node.createdAt,
      }))
      .slice()
      .reverse();
    this.previousMessages = messages.slice();
    const hasPreviousPage = result.data.node.messages.pageInfo.hasPreviousPage;
    const startCursor = result.data.node.messages.pageInfo.startCursor;
    const fetchMore = result.fetchMore;
    const updateFetchMore = () => {
      stopPolling();
      if (!hasPreviousPage) return;
      fetchMore({
        variables: {
          id: this.state.room.id,
          startCursor: hasPreviousPage ? startCursor : null,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          const merged = Object.assign({}, prev);
          merged.node.messages.edges = [...fetchMoreResult.node.messages.edges, ...prev.node.messages.edges];
          merged.node.messages.pageInfo = {
            ...fetchMoreResult.node.messages.pageInfo,
          };
          return merged;
        },
      });
    };
    const MoreButton = () => {
      if (!hasPreviousPage) {
        return <></>;
      }
      return (
        <Button
          containerStyle={{ margin: 5 }}
          onPress={updateFetchMore}
          icon={<Icon name="unfold-more" />}
          type="outline"
        />
      );
    };

    const refreshStatus = { refreshing: false };
    const restartPolling = async () => {
      refreshStatus.refreshing = true;
      await refetch();
      startPolling(500);
      refreshStatus.refreshing = false;
    };

    return (
      <FlatList
        style={{ flex: 1 }}
        ListFooterComponent={MoreButton}
        refreshing={refreshStatus.refreshing}
        onRefresh={restartPolling}
        inverted={true}
        keyExtractor={this.keyExtractor}
        data={messages}
        renderItem={this.renderListItem}
      />
    );
  }

  renderList() {
    if (!this.state.room.id) return <View style={{ flex: 1 }} />;
    return (
      <Query query={FETCH_MESSAGE_QUERY} variables={{ id: this.state.room.id, startCursor: null }} pollInterval={500}>
        {result => this.renderMessageList(result)}
      </Query>
    );
  }

  onDidFocus = () => {
    const room = this.props.navigation.getParam("room", {});
    if (!room.id || !room.name) return;
    this.setState({ room });
  };

  showRoomDescriptionOverlay = () => {
    this.setState({ visibleRoomDescriptionOverlay: true });
  };

  hideRoomDescriptionOverlay = () => {
    this.setState({ visibleRoomDescriptionOverlay: false });
  };

  render() {
    const room = this.state.room;
    return (
      <>
        <NavigationEvents onDidFocus={this.onDidFocus} />
        <Header
          centerComponent={{ text: room.name || "" }}
          rightComponent={{ icon: "settings", color: "#FFF", onPress: this.showRoomDescriptionOverlay }}
        />
        {this.renderList()}
        <KeyboardAvoidingView behavior="padding" enabled={true}>
          <Submit room={this.state.room} />
        </KeyboardAvoidingView>
        <Overlay
          isVisible={this.state.visibleRoomDescriptionOverlay}
          width="80%"
          height="75%"
          onBackdropPress={this.hideRoomDescriptionOverlay}>
          <ScrollView>
            <HTMLView value={this.state.room.description || ""} />
          </ScrollView>
        </Overlay>
      </>
    );
  }
}
