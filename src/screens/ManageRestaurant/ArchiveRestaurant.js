import React, { Component } from 'react';
import { View, FlatList, TextInput, StyleSheet, Platform, StatusBar } from 'react-native';
import firebase, { firestore } from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Spinner from '../../components/Spinner';
import ArchiveList from '../../components/Restaurant/ArchiveList';
import SearchBar from '../../components/SearchBar';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 40,
      backgroundColor: '#FFFFFF'
  }
})

class ArchiveRestaurant extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('archive');
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
      const { restaurantName, restaurantDescription, restaurantImageUrl } = doc.data();
      restaurants.push({
        key: doc.id,
        id: doc.id,
        doc, // DocumentSnapshot
        restaurantName,
        restaurantDescription,
        restaurantImageUrl
      });
    });
    this.setState({ 
      restaurants,
      loading: false,
   });
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
            renderItem={({ item, index }) => <ArchiveList {...item} index={index} />}
          />
      </View>
    );
  }
}

export default ArchiveRestaurant;
