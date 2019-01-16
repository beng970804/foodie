import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, SafeAreaView, FlatList, TextInput, Platform, StatusBar, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';

import SearchBar from '../../components/SearchBar';
import MenuList from '../../components/Restaurant/MenuList';

const {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    height: this.startHeaderHeight
  },
  searchBar: {
    flexDirection: 'row',
    padding: 1,
    backgroundColor: 'white',
    marginHorizontal: 20,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 0},
    elevation: 1,
    marginTop: Platform.OS == 'android' ? 15 : null,
    marginBottom: Platform.OS == 'android' ? 10 : null
  },
  searchIcon: {
    marginRight: 15,
    marginLeft: 15,
    marginTop: 8
  },
  searchInput: {
    flex: 1,
    fontWeight: '700',
    backgroundColor: 'white'
  },
  titleStyle: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 20
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20
  }
})

class Food extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.unsubscribe = null;
    this.ref = firebase.firestore().collection('menu');
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
    const menu = [];
    querySnapshot.forEach((doc) => {
      const { 
        dishesName,
        dishesPrice,
        dishesImageUrl
      } = doc.data();
      menu.push({
        key: doc.id,
        id: doc.id,
        doc, // DocumentSnapshot
        dishesName,
        dishesPrice,
        dishesImageUrl
      });
    });
    this.setState({ 
      menu
   });
  }

  searchFilterFunction = search => {
    const newData = this.state.menu.filter(item => {
    const itemData = `${item.dishesName.toUpperCase()}`;
    const textData = search.toUpperCase();
    return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dishes: newData,
    });
  };

  render() {
    return (
      <View>
        <SearchBar
          onChangeText={search => this.searchFilterFunction(search)}
        />  

        <View style={{marginVertical: 20, paddingHorizontal: 20}}>
          <Text style={{fontSize: 24, fontWeight: '700'}}>
            Introducing FoodieOrdering
          </Text>
          <Text style={{fontWeight: '100', marginTop: 10}}>
            Order your desired food before you reach
          </Text> 
        </View> 

        <FlatList 
          data={this.state.menu}
          renderItem={({ item, index }) => <MenuList {...item} index={index} />}
        />
      </View>
    );
  }
}

export default Food;
