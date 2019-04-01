import React from "react";
import { Alert, KeyboardAvoidingView, View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import { NavigationScreenProp } from "react-navigation";
import { SecureStore } from "expo";
import Theme from "../styles/theme";

type Props = {
  navigation: NavigationScreenProp<any>;
};

type State = {
  username: string;
  password: string;
};

export default class Login extends React.Component<Props, State> {
  state = {
    username: "",
    password: "",
  };

  onPressLogin = async () => {
    let authInfo: any = null;
    try {
      const result = await fetch("https://idobata.io/oauth/token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "password",
          username: this.state.username,
          password: this.state.password,
        }),
      });
      authInfo = await result.json();
    } catch (e) {
      Alert.alert("接続エラー", e.toString());
    }

    try {
      await SecureStore.setItemAsync("auth", JSON.stringify(authInfo));
      console.log("auth 情報保存完了");
    } catch (e) {
      Alert.alert("機密エラー", e.toString());
    }

    this.props.navigation.navigate("Splash");
  };

  onChangeUsername = (username: string) => {
    this.setState({
      username,
    });
  };

  onChangePassword = (password: string) => {
    this.setState({
      password,
    });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled={true}>
        <Input
          containerStyle={styles.input}
          onChangeText={this.onChangeUsername}
          keyboardType="email-address"
          placeholder="User Name"
        />
        <Input
          containerStyle={styles.input}
          onChangeText={this.onChangePassword}
          placeholder="Password"
          secureTextEntry={true}
        />
        <Button onPress={this.onPressLogin} title="Login" />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.primary,
  },
  input: {
    margin: 5,
  },
});
