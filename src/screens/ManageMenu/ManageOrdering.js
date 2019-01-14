import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, StatusBar } from 'react-native';
import firebase, { firestore } from 'react-native-firebase';

import Spinner from '../../components/Spinner';
import OrderingList from '../../components/Restaurant/OrderingList';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 40,
      backgroundColor: '#FFFFFF'
  }
})

class ManageOrdering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: '',
      loading: false,
      order: []
    };
    this.ref = firebase.firestore().collection('foodOrder');
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
    const order = [];
    querySnapshot.forEach((doc) => {
      const { customerEmail, orderedFood } = doc.data();
      order.push({
        key: doc.id,
        id: doc.id,
        doc, // DocumentSnapshot
        customerEmail,
        orderedFood
      });
    });
    this.setState({ 
      order,
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
          data={this.state.order}
          renderItem={({ item, index }) => <OrderingList {...item} index={index} />}
        />
      </View>
    );
  }
}

export default ManageOrdering;
