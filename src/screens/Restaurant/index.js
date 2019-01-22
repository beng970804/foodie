import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Platform, StatusBar, Dimensions, ImageBackground, FlatList } from 'react-native';
import firebase from 'react-native-firebase';

import SearchBar from '../../components/SearchBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 20,
  },
  GridViewContainer: {
    flex:1,    
    height: 200,
    marginRight: 5,
    paddingBottom: 5,
  },
  GridViewTextLayout: {
    // fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 25
  },
  imageContainer: {
    flexGrow:1,
    height:null,
    width:null,
    alignItems: 'center',
    justifyContent:'center',
  },
  imageStyles: {
    opacity: 0.9,
    borderRadius: 10,
  },
  textContainer: {
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,.5)'
  }
});

const {height, width} = Dimensions.get('window')

class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.unsubscribe = null;
    this.ref = firebase.firestore().collection('restaurants');
    this.viewRestaurant = this.viewRestaurant.bind(this);
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
    const items = [];
    querySnapshot.forEach((doc) => {
      const { 
        restaurantName, 
        restaurantImageUrl 
      } = doc.data();
      items.push({
        key: doc.id,
        id: doc.id,
        doc, // DocumentSnapshot
        restaurantName,
        restaurantImageUrl
      });
    });
    this.setState({ 
      items
   });
  }

  searchFilterFunction = search => {
    const newData = this.state.items.filter(item => {
    const itemData = `${item.restaurantName.toUpperCase()}`;
    const textData = search.toUpperCase();
    return itemData.indexOf(textData) > -1;
    });
    this.setState({
      items: newData,
    });
  };

  viewRestaurant(item) {
    this.props.navigation.navigate('RestaurantDetails', {restaurantName: item})
  }

  render() {
    return (
      <ScrollView>
        <SearchBar
          onChangeText={search => this.searchFilterFunction(search)}
        />  

        <View style={{marginTop: 10, paddingHorizontal: 20}}>
          <Text style={{fontSize: 24, fontWeight: '700'}}>
            Introducing FoodieReservation
          </Text>
          <Text style={{fontWeight: '100', marginTop: 10}}>
            Reserve your desired restaurant before you reach
          </Text> 
        </View> 

        <View  style={styles.container}>
          <FlatList
            data={ this.state.items }
            renderItem={ ({item}) =>
              <View style={styles.GridViewContainer}>
                <ImageBackground
                  source={{uri: item.restaurantImageUrl}}
                  style={styles.imageContainer}
                  imageStyle={styles.imageStyles}>

                    <View style={styles.textContainer} >
                      <Text 
                        style={styles.GridViewTextLayout} 
                        onPress={this.viewRestaurant.bind(this, item.restaurantName)} > {item.restaurantName} 
                      </Text>
                    </View>

                </ImageBackground>
              </View> 
            }
            numColumns={2}
          />
        </View>
 
      </ScrollView>
    );
  }
}

export default Restaurant;