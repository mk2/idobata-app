import React from "react";
import { View } from "react-native";
import { createSwitchNavigator, createAppContainer, NavigationScreenProp } from "react-navigation";
import { Constants } from "expo";
import { ThemeProvider } from "react-native-elements";
import Splash from "./components/Splash";
import Login from "./components/Login";
import HomeNavigator from "./components/home/HomeNavigator";
import { ApolloProvider } from "react-apollo";
import theme from "./styles/theme";

type WithApolloHomeNavigatorProps = {
  navigation: NavigationScreenProp<any>;
};

class WithApolloHomeNavigator extends React.Component<WithApolloHomeNavigatorProps> {
  static router = HomeNavigator.router;
  render() {
    const client = this.props.navigation.getParam("client");
    return (
      <ApolloProvider client={client}>
        <HomeNavigator navigation={this.props.navigation} />
      </ApolloProvider>
    );
  }
}

const AppNavigator = createSwitchNavigator(
  {
    Splash,
    Login,
    Home: WithApolloHomeNavigator,
  },
  {
    initialRouteName: "Splash",
  },
);

const Root = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <Root />
        </View>
      </ThemeProvider>
    );
  }
}
