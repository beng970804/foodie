import React, { Component } from 'react';
import { View, FlatList, TextInput, StyleSheet, Platform, StatusBar } from 'react-native';
import firebase, { firestore } from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Spinner from '../../components/Spinner';
import AdminRestaurantList from '../../components/Restaurant/AdminRestaurantList';
import SearchBar from '../../components/SearchBar';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 40,
      backgroundColor: '#FFFFFF'
  }
})

class DeleteRestaurant extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('restaurants');
    this.unsubscribe = null;

    this.state = {
      loading: true,
      restaurants: []
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
      this.unsubscribe();
      this.startHeaderHeight = 80;
      if(Platform.OS == 'android'){
        this.startHeaderHeight = 100 + StatusBar.currentHeight
      }
  } 

  onCollectionUpdate = (querySnapshot) => {
    const restaurants = [];
    querySnapshot.forEach((doc) => {
      const { restaurantName, restaurantEmail, restaurantImageUri } = doc.data();
      restaurants.push({
        key: doc.id,
        id: doc.id,
        doc, // DocumentSnapshot
        restaurantName,
        restaurantEmail,
        restaurantImageUri
      });
    });
    this.setState({ 
      restaurants,
      loading: false,
   });
   console.log(this.state.restaurants)
  }

  searchFilterFunction = search => {
    const newData = this.state.restaurants.filter(item => {
    const itemData = `${item.restaurantName.toUpperCase()}`;
    const textData = search.toUpperCase();
    return itemData.indexOf(textData) > -1;
    });
    this.setState({
      restaurants: newData,
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
            <Spinner size="large"/>
        </View>
      );
    } return (
      <View>
          <SearchBar
             onChangeText={search => this.searchFilterFunction(search)}
          />       
          <FlatList 
            data={this.state.restaurants}
            renderItem={({ item, index }) => <AdminRestaurantList {...item} index={index} />}
          />
      </View>
    );
  }
}

export default DeleteRestaurant;
