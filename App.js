/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {} from 'react-native';
import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import firebase, { Firebase } from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SignUp from './src/screens/SignUp';
import Login from './src/screens/Login';

import Promotion from './src/screens/Promotion/index';
import Profile from './src/screens/Profile/index';
import Food from './src/screens/Food/index';
import Restaurant from './src/screens/Restaurant/index';

import MyBooking from './src/screens/Profile/MyBooking';
import MyHistory from './src/screens/Profile/MyHistory';
import MyFavourite from './src/screens/Profile/MyFavourite';

import Menu from './src/screens/Menu/index';

import { colors } from './src/theme';

const AuthState = new createStackNavigator ({
  Login: Login,
  SignUp: SignUp
},{
  navigationOptions: {
    header: null
  }
})

const ProfileScreen = new createSwitchNavigator ({
  MyBooking: MyBooking, 
  MyFavourite: MyFavourite,
  MyHistory: MyHistory
},{
  navigationOptions: {
    header: null
  },
})

const Tabs = createBottomTabNavigator({
  Restaurant: {
      screen: Restaurant,
      navigationOptions: {
          tabBarLabel: 'RESTAURANT',
          tabBarIcon: ({ tintColor }) => (
              <Ionicons name= "ios-restaurant" size={24} color={tintColor}/>
          )
      }
  },
  Food: {
      screen: Food,
      navigationOptions: {
          tabBarLabel: 'FOOD',
          tabBarIcon: ({ tintColor }) => (
              <Ionicons name= "ios-pizza" size={24} color={tintColor}/>
          )
      }
  },
  Promotion: {
    screen: Promotion,
    navigationOptions: {
        tabBarLabel: 'PROMOTION',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name= "ios-pricetag" size={24} color={tintColor}/>
        )
    }
  },
  Profile: {
      screen: Profile,
      navigationOptions: {
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ tintColor }) => (
              <Ionicons name= "ios-contact" size={24} color={tintColor}/>
          )
      }
  }
}, {
  tabBarOptions: {
    activeTintColor: colors.primary,
    inactiveTintColor: colors.grey,
    style: {
      backgroundColor: 'white',
      borderTopWidth: 0,
      elevation: 5
    }
  }
})

const Owner = createBottomTabNavigator({
  Menu: {
    screen: Menu,
    navigationOptions: {
        tabBarLabel: 'Menu',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name= "ios-restaurant" size={24} color={tintColor}/>
        )
    }
  }
}, {
  tabBarOptions: {
    activeTintColor: colors.primary,
    inactiveTintColor: colors.grey,
    style: {
      backgroundColor: 'white',
      borderTopWidth: 0,
      elevation: 5
    }
  } 
})

const AppStackNavigator = new createStackNavigator(
  {
    AuthState: AuthState,
    Owner: Owner,
    Tabs: Tabs
  },
  {
    initialRouteName: 'AuthState',
    navigationOptions: {
      header: null
    }
  }
)

type Props = {};
export default class App extends Component<Props> {
  componentWillMount() {
    const db = firebase.firestore();
    db.settings({timestampsInSnapshots: true})
  }

  render() {
    return (
      <AppStackNavigator/>
    );
  }
}