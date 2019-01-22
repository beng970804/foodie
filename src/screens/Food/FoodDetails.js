import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import firebase from 'react-native-firebase';
import ButtonComponent, { CircleButton, RoundButton, RectangleButton } from 'react-native-button-component';

import { fonts, colors } from '../../theme';

const styles = StyleSheet.create({
  imageContainer: {
    height: 300
  },
  container: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  dishesName: {
    color: colors.primary,
    fontSize: 25,
    fontFamily: fonts.bold,
    fontWeight: 'bold'
  },
  title: {
    color: '#666',
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
  },
  lineStyle:{
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginTop: 10,
  },
  body: {
    marginTop: -10,
  },
});

class FoodDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerId: '',
      dishesPrice: '',
      dishesIngredients: '',
      dishesDescription: '',
      dishesImageUrl: '',
      restaurantEmail: '',
      restaurantName: '',
      dishesName: this.props.navigation.state.params.dishesName,
    };
    this.ref = firebase.firestore().collection('menu');
    this.ref2 = firebase.firestore().collection('users');
    this.ref3 = firebase.firestore().collection('restaurants');
    this.getRestaurantEmail = this.getRestaurantEmail.bind(this);
    this.getRestaurantName = this.getRestaurantName.bind(this); 
    this.navigateOrdering = this.navigateOrdering.bind(this);
  }

  componentDidMount() {
    this.ref.where("dishesName","==",this.state.dishesName)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const {
            userId,
            dishesPrice,
            dishesIngredients,
            dishesDescription,
            dishesImageUrl,
          } = doc.data();

          this.setState({ 
            dishesImageUrl: dishesImageUrl,
            dishesDescription: dishesDescription,
            dishesIngredients: dishesIngredients,
            dishesPrice: dishesPrice,
            ownerId: userId,
          });
        });
        this.getRestaurantEmail();
      })
      .catch((error) => console.log(error))
  }

  getRestaurantEmail() {
    this.ref2.doc(this.state.ownerId)
    .get()
    .then((doc) => {
        const { 
            userEmail, 
        } = doc.data();
        this.setState({
            restaurantEmail: userEmail
        })
        this.getRestaurantName();
    })
    .catch((error) => console.log(error))
}

  getRestaurantName() {
    this.ref3.where('restaurantEmail','==',this.state.restaurantEmail )
    .get()
    .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const { 
              restaurantName, 
          } = doc.data();
          this.setState({
              restaurantName: restaurantName
          })
        })
    })
    .catch((error) => console.log(error))
  }

  navigateOrdering() {
    this.props.navigation.navigate(
      'OrderingDetails', 
      {restaurantName: this.state.restaurantName, dishesName: this.state.dishesName, restaurantEmail: this.state.restaurantEmail})
  }

  navigateRestaurant() {
    this.props.navigation.navigate('RestaurantDetails', {restaurantName: this.state.restaurantName, restaurantEmail: this.state.restaurantEmail})
  }

  render() {
    return(
      <ScrollView>
        <Image 
          source={{uri: this.state.dishesImageUrl}}
          style={styles.imageContainer}
        />

        <View style={styles.container}>
          <Text style={styles.dishesName}>
            {this.state.dishesName}
          </Text>
          <Text style={styles.title}>
            Restaurant: {this.state.restaurantName}
          </Text>    

          <ButtonComponent
            buttonStyle={{marginTop: 15}}
            text="Restaurant Details"
            type="primary"
            shape="round"
            backgroundColors={['#ff1493', '#ff72be']}
            gradientStart={{ x: 0.5, y: 1 }}
            gradientEnd={{ x: 1, y: 1 }}
            height={65}
            onPress={() => this.navigateRestaurant()}
          >
          </ButtonComponent>   
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Description {'\n'}
          </Text>
          <Text style={styles.body}>
            {this.state.dishesDescription}
          </Text>
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Ingredients {'\n'}
          </Text>
          <Text style={styles.body}>
            {this.state.dishesIngredients}
          </Text>
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Price {'\n'}
          </Text>
          <Text style={styles.body}>
            RM {this.state.dishesPrice}
          </Text>

          <ButtonComponent
            buttonStyle={{marginTop: 15}}
            text="Make Order"
            type="primary"
            shape="round"
            backgroundColors={['#ff1493', '#ff72be']}
            gradientStart={{ x: 0.5, y: 1 }}
            gradientEnd={{ x: 1, y: 1 }}
            height={65}
            onPress={() => this.navigateOrdering()}
          >
          </ButtonComponent>
        </View>

      </ScrollView>
    );
  }
}

export default FoodDetails;
