import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, SafeAreaView, TextInput, Platform, StatusBar, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SearchBar from '../../components/SearchBar';
import Category from '../../components/Restaurant/Category';
import ShowRestaurant from '../../components/Restaurant/ShowRestaurant';

const {height, width} = Dimensions.get('window')

class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount(){
    this.startHeaderHeight = 80
    if(Platform.OS == 'android'){
      this.startHeaderHeight = 100 + StatusBar.currentHeight
    }
  }

  searchFilterFunction = search => {
    // const newData = this.state.restaurants.filter(item => {
    // const itemData = `${item.restaurantName.toUpperCase()}`;
    // const textData = search.toUpperCase();
    // return itemData.indexOf(textData) > -1;
    // });
    // this.setState({
    //   restaurants: newData,
    // });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{flex: 1}}>

          <SearchBar
             onChangeText={search => this.searchFilterFunction(search)}
          />  

          <ScrollView scrollEventThrottle={16}>
            <View style={styles.mainContainer}>
              <Text style={styles.titleStyle}>
                What type of cuisine you wish to find?
              </Text>

              <View style={{height: 130, marginTop: 20}}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  <Category imageUri={require('../../assets/Food/malayFood.jpg')} name="Malay Cuisine"/>
                  <Category imageUri={require('../../assets/Food/chineseFood.jpg')} name="Chinese Cuisine"/>
                  <Category imageUri={require('../../assets/Food/indianFood.jpg')} name="Indian Cuisine"/>
                </ScrollView>
              </View>

              <View style={{marginTop: 30, paddingHorizontal: 20}}>
                <Text style={{fontSize: 24, fontWeight: '700'}}>
                  Introducing FoodieReservation
                </Text>
                <Text style={{fontWeight: '100', marginTop: 10}}>
                  Reserve your desired restaurant before you reach
                </Text>
                <View style={{width: width - 40, height: 200, marginTop: 20}}>
                  <Image style={{flex: 1, height: null, width: null, resizeMode: 'cover',
                    borderRadius: 5, borderWidth: 1, borderColor: '#dddddd'}}
                    source={require('../../assets/Restaurants/mamakPlace.jpg')}/>
                </View>
              </View>      

              <View style={{marginTop: 30}}>
                <Text style={{ fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
                  Restaurant around the world
                </Text>
                <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                  <ShowRestaurant 
                    imageUri = {require('../../assets/Restaurants/mamakPlace.jpg')}
                    width={width}
                    name="Mamak Palace"
                    type="Malay Cusine"
                    price={8}
                    // rating={4}
                  />
                  <ShowRestaurant
                    imageUri = {require('../../assets/Restaurants/mmuCorner.jpg')} 
                    width={width}
                    name="MMU Corner"
                    type="Chinese Cusine"
                    price={5}
                    // rating={4}
                  />
                  <ShowRestaurant 
                    imageUri = {require('../../assets/Restaurants/sugarMelon.jpg')}
                    width={width}
                    name="Sugar Melon"
                    type="Western Cusine"
                    price={15}
                    // rating={4}
                  />
                </View>
              </View>

            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

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

export default Restaurant;
