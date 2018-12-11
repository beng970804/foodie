import React, { Component } from 'react';
import { View, Text, PermissionsAndroid, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import firebase, { firestore } from 'react-native-firebase';

import Spinner from '../components/Spinner';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 40,
      backgroundColor: '#FFFFFF'
  }
})

class Initial extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user == null){
        return this.props.navigation.navigate('Login');
      }else{
        var userId = firebase.auth().currentUser.uid;
        firebase.firestore().collection('users').doc(userId).get().then(snapshot => {
        var userType = (snapshot.data() && snapshot.data().userType);
          if (userType === 'Customer') {
            return this.props.navigation.navigate('Restaurant')
          }else if (userType === 'Admin') {
            return this.props.navigation.navigate('ManageRestaurant')
          }else {
            return this.props.navigation.navigate('Menu')
          }
        })
      }
    })
    SplashScreen.hide()
    async function requestPermission() {
      try {
        const granted = await PermissionsAndroid.requestMultiple(
          [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
           PermissionsAndroid.PERMISSIONS.CAMERA,
           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
        )
      } catch (err) {
        console.warn(err)
      }
    }
    requestPermission()
  }

  render() {
    return (
    <View style={styles.container}>
        <Spinner size="small"/>
    </View>
    );
  }
}

export default Initial;
