import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, StatusBar } from 'react-native';
import firebase, { firestore } from 'react-native-firebase';

import Spinner from '../../components/Spinner';
import BookingList from '../../components/Restaurant/BookingList';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 40,
      backgroundColor: '#FFFFFF'
  }
})

class ManageBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: '',
      loading: false,
      booking: []
    };
    this.ref = firebase.firestore().collection('reservation');
  }

  componentDidMount() {
    let userEmail = firebase.auth().currentUser.email;
    this.unsubscribe = this.ref.where('restaurantEmail', '==', userEmail).onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
      this.unsubscribe();
      this.startHeaderHeight = 80;
      if(Platform.OS == 'android'){
        this.startHeaderHeight = 100 + StatusBar.currentHeight
      }
  } 

  onCollectionUpdate = (querySnapshot) => {
    const reservation = [];
    querySnapshot.forEach((doc) => {
      const { customerEmail } = doc.data();
      reservation.push({
        key: doc.id,
        id: doc.id,
        doc, // DocumentSnapshot
        customerEmail
      });
    });
    this.setState({ 
      reservation,
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
            <Spinner size="large"/>
        </View>
      );
    } return (
      <View>      
        <FlatList 
          data={this.state.reservation}
          renderItem={({ item, index }) => <BookingList {...item} index={index} />}
        />
      </View>
    );
  }
}

export default ManageBooking;
