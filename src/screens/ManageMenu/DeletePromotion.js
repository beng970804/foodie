import React, { Component } from 'react';
import { ScrollView, View, FlatList, TextInput, StyleSheet, Platform, StatusBar } from 'react-native';
import firebase, { firestore } from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Spinner from '../../components/Spinner';
import PromotionDeleteList from '../../components/Restaurant/PromotionDeleteList';
import SearchBar from '../../components/SearchBar';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 40,
      backgroundColor: '#FFFFFF'
  }
})

class DeletePromotion extends Component {
  constructor(props) {
    super(props);
    let uid = firebase.auth().currentUser.uid;
    this.ref = firebase.firestore().collection('promotion');
    this.unsubscribe = null;

    this.state = {
      loading: true,
      promotion: []
    };
  }

  componentDidMount() {
    let uid = firebase.auth().currentUser.uid;
    this.unsubscribe = this.ref.where('userId', '==', uid).onSnapshot(this.onCollectionUpdate);
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
      const { promotionName, promotionDescription, promotionImageUrl } = doc.data();
      promotion.push({
        key: doc.id,
        id: doc.id,
        doc, // DocumentSnapshot
        promotionName,
        promotionDescription,
        promotionImageUrl
      });
    });
    this.setState({ 
      promotion,
      loading: false,
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
    if (this.state.loading) {
      return (
        <View style={styles.container}>
            <Spinner size="large"/>
        </View>
      );
    } return (
      <ScrollView>
          <SearchBar
             onChangeText={search => this.searchFilterFunction(search)}
          />       
          <FlatList 
            data={this.state.promotion}
            renderItem={({ item, index }) => <PromotionDeleteList {...item} index={index} />}
          />
      </ScrollView>
    );
  }
}

export default DeletePromotion;
