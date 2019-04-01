import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text } from "react-native-elements";
import HTMLView from "react-native-htmlview";
import { DateTime } from "luxon";

type Sender = {
  iconUrl: string;
  name: string;
};

type Props = {
  sender: Sender;
  body: string;
  createdAt: string;
};

export default class MessageItem extends React.Component<Props> {
  createdAt = () => {
    if (!this.props.createdAt) {
      return "";
    }
    const createdAt = DateTime.fromISO(this.props.createdAt);
    return createdAt.toFormat("yyyy/MM/dd HH:mm");
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "row", padding: 5, borderTopWidth: 1, borderTopColor: "#DDD" }}>
        <View style={{ flex: 0.1, marginRight: 3 }}>
          <Avatar source={{ uri: this.props.sender.iconUrl }} />
        </View>
        <View style={{ flex: 0.9, flexDirection: "column" }}>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.senderName}>{this.props.sender.name}</Text>
            <Text style={styles.createdAt}>{this.createdAt()}</Text>
          </View>
          <View>
            <HTMLView value={this.props.body} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  senderName: {
    fontSize: 11,
    fontWeight: "bold",
  },
  createdAt: {
    fontSize: 10,
  },
});
