import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Dimensions, StatusBar, Platform } from 'react-native';
import firebase, { Firebase } from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SearchBar from '../../components/SearchBar';
import PromotionList from '../../components/Restaurant/PromotionList';

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

class Promotion extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.unsubscribe = null;
    this.ref = firebase.firestore().collection('promotion');
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
    const promotion = [];
    querySnapshot.forEach((doc) => {
      const { 
        promotionName, 
        promotionDescription, 
        promotionImageUrl,
      } = doc.data();
      promotion.push({
        key: doc.id,
        id: doc.id,
        doc, // DocumentSnapshot
        promotionName,
        promotionDescription,
        promotionImageUrl,
      });
    });
    this.setState({ 
      promotion
   });
  }

  searchFilterFunction = search => {
    const newData = this.state.promotion.filter(item => {
    const itemData = `${item.promotionName.toUpperCase()}`;
    const textData = search.toUpperCase();
    return itemData.indexOf(textData) > -1;
    });
    this.setState({
      promotion: newData,
    });
  };

  render() {
    return (
      <View>
        <SearchBar
          onChangeText={search => this.searchFilterFunction(search)}
        />   
        <FlatList 
          data={this.state.promotion}
          renderItem={({ item, index }) => <PromotionList {...item} index={index} />}
        />
      </View>
    );
  }
}

export default Promotion;
