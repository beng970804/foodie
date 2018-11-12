import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import SplashScreen from 'react-native-splash-screen';

export default class Loading extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Main' : 'Login')
    })
    SplashScreen.hide()
  }

  render() {
    return (
      <View>

      </View>
    )
  }
}