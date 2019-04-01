import React from "react";
import { createBottomTabNavigator, createStackNavigator, NavigationScreenProp } from "react-navigation";
import { Icon } from "react-native-elements";
import { Constants, SecureStore } from "expo";
import Chat from "./chat/Chat";
import Rooms from "./room/Rooms";
import Settings from "./Settings";
import Loading from "./Loading";
import Theme from "../../styles/theme";

type tabBarIconArgs = { focused: boolean; horizontal: boolean; tintColor: string };

const HomeNavigator = createBottomTabNavigator(
  {
    Rooms: {
      screen: Rooms,
      navigationOptions: { tabBarIcon: ({ tintColor }: tabBarIconArgs) => <Icon color={tintColor} name="people" /> },
    },
    Chat: {
      screen: Chat,
      navigationOptions: { tabBarIcon: ({ tintColor }: tabBarIconArgs) => <Icon color={tintColor} name="chat" /> },
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        tabBarIcon: ({ tintColor }: tabBarIconArgs) => <Icon color={tintColor} name="more-horiz" />,
      },
    },
  },
  {
    initialRouteName: "Rooms",
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      activeTintColor: "#FFF",
      inactiveTintColor: "#666",
      style: {
        backgroundColor: Theme.colors.primary,
      },
    },
  },
);

const WithLoadingHomeNavigator = createStackNavigator(
  {
    Home: HomeNavigator,
    Loading,
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
    mode: "modal",
  },
);

export default WithLoadingHomeNavigator;
