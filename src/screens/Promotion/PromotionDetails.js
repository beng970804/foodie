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
  promotionName: {
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

class PromotionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerId: '',
      restaurantName: '',
      restaurantEmail: '',
      promotionDescription: '',
      promotionImageUrl: '',
      promotionName: this.props.navigation.state.params.promotionName,
    };
    this.ref = firebase.firestore().collection('promotion');
    this.ref2 = firebase.firestore().collection('users');
    this.ref3 = firebase.firestore().collection('restaurants');
    this.getEmail = this.getEmail.bind(this);
    this.getName = this.getName.bind(this);
    this.navigateRestaurant = this.navigateRestaurant.bind(this);
  }

  componentDidMount() {
    this.ref.where("promotionName","==",this.state.promotionName)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const {
            userId,
            promotionDescription,
            promotionImageUrl,
          } = doc.data();

          this.setState({ 
            ownerId: userId,
            promotionDescription: promotionDescription,
            promotionImageUrl: promotionImageUrl,
          });
        });

        this.getEmail()
      })
      .catch((error) => console.log(error))
  }

  getEmail() {
    this.ref2.where("userId","==",this.state.ownerId)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const {
            userEmail
          } = doc.data();

          this.setState({ 
            restaurantEmail: userEmail
          });
        });

        this.getName()
      })
      .catch((error) => console.log(error))
  }

  getName() {
    this.ref3.where("restaurantEmail","==",this.state.restaurantEmail)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const {
            restaurantName
          } = doc.data();

          this.setState({ 
            restaurantName: restaurantName
          });
        });
      })
      .catch((error) => console.log(error))
  }

  navigateRestaurant() {
    this.props.navigation.navigate('RestaurantDetails', {restaurantName: this.state.restaurantName, restaurantEmail: this.state.restaurantEmail})
  }

  render() {
    return(
      <ScrollView>
        <Image 
          source={{uri: this.state.promotionImageUrl}}
          style={styles.imageContainer}
        />
        
        <View style={styles.container}>
          <Text style={styles.promotionName}>
            {this.state.promotionName}
          </Text>
          <Text style={styles.title}>
            Location: {this.state.restaurantName}
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
            {this.state.promotionDescription}
          </Text>
        </View>
        <View style = {styles.lineStyle} />

      </ScrollView>
    );
  }
}

export default PromotionDetails;
