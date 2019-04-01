import React from "react";
import { Asset, SecureStore, AppLoading } from "expo";
import { NavigationScreenProp } from "react-navigation";
import ApolloClient from "../api/ApolloClient";

type Props = {
  navigation: NavigationScreenProp<any>;
};

export default class Splash extends React.Component<Props> {
  onStartLoading = async () => {
    try {
      const auth = JSON.parse((await SecureStore.getItemAsync("auth")) || "");
      if (!auth.access_token) {
        throw new Error();
      }
      const client = ApolloClient(auth.access_token);
      await Asset.fromModule(require("../assets/idobata-logo-simple.png")).downloadAsync();
      this.props.navigation.navigate("Home", { client });
    } catch (e) {
      this.props.navigation.navigate("Login");
    }
  };

  onFinishLoading = () => {};

  render() {
    return <AppLoading startAsync={this.onStartLoading} onFinish={this.onFinishLoading} onError={console.error} />;
  }
}
