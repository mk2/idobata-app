import React from "react";
import { Alert, View } from "react-native";
import { SecureStore } from "expo";
import { Divider, Image, Header, ListItem, Icon } from "react-native-elements";
import { Constants } from "expo";

export default class Settings extends React.Component {
  logout = () => {
    Alert.alert(
      "ログアウトしますか？",
      "",
      [
        {
          text: "はい",
          onPress: async () => {
            await SecureStore.deleteItemAsync("auth");
          },
        },
        { text: "いいえ" },
      ],
      { cancelable: false },
    );
  };

  renderSettingsMenuList = () => {
    return (
      <View>
        <ListItem
          topDivider={true}
          bottomDivider={true}
          title="アプリバージョン"
          rightTitle={Constants.manifest.version}
        />
        <Divider style={{ height: 10 }} />
        <ListItem topDivider={true} bottomDivider={true} title="ログアウト" onPress={this.logout} />
      </View>
    );
  };

  render() {
    return (
      <>
        <Header centerComponent={{ text: "Settings" }} />
        {this.renderSettingsMenuList()}
      </>
    );
  }
}
