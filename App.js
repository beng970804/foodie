/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import SplashScreen from 'react-native-splash-screen';
import { createSwitchNavigator } from 'react-navigation';
import firebase from 'react-native-firebase'

import Loading from './src/screens/Loading';
import SignUp from './src/screens/SignUp';
import Login from './src/screens/Login';
import Main from './src/screens/Main';

type Props = {};
export default class App extends Component<Props> {
  // componentDidMount() {
  //   var that = this;
  //   firebase.auth().onAuthStateChanged(user => {
  //     that.props.navigation.navigate(user ? 'Main' : 'SignUp')
  //   })
  //   SplashScreen.hide()
  // }

  render() {
    return (
      <AppSwitchNavigator/>
    );
  }
}

const AppSwitchNavigator = new createSwitchNavigator(
  {
    Loading,
    Login,
    SignUp,
    Main
  },
  {
    initialRouteName: 'Loading'
  },
  {
    Main: 'Main'
  },
  {
    Login: 'Login'
  },
  {
    SignUp: 'SignUp'
  }
)