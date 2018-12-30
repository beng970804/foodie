import React, { Component } from 'react';
import { View, FlatList, TextInput, StyleSheet, Platform, StatusBar } from 'react-native';
import firebase, { firestore } from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Spinner from '../../components/Spinner';
import MenuDeleteList from '../../components/Restaurant/MenuDeleteList';
import SearchBar from '../../components/SearchBar';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 40,
      backgroundColor: '#FFFFFF'
  }
})

class DeleteDishes extends Component {
  constructor(props) {
    super(props);
    let uid = firebase.auth().currentUser.uid;
    this.ref = firebase.firestore().collection('menu').doc(uid).collection('food');
    this.unsubscribe = null;

    this.state = {
      loading: true,
      dishes: []
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
    const dishes = [];
    querySnapshot.forEach((doc) => {
      const { dishesName, dishesDescription, dishesImageUrl } = doc.data();
      dishes.push({
        key: doc.id,
        id: doc.id,
        doc, // DocumentSnapshot
        dishesName,
        dishesDescription,
        dishesImageUrl
      });
    });
    this.setState({ 
      dishes,
      loading: false,
   });
  }

  searchFilterFunction = search => {
    const newData = this.state.dishes.filter(item => {
    const itemData = `${item.dishesName.toUpperCase()}`;
    const textData = search.toUpperCase();
    return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dishes: newData,
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
            data={this.state.dishes}
            renderItem={({ item, index }) => <MenuDeleteList {...item} index={index} />}
          />
      </View>
    );
  }
}

export default DeleteDishes;
