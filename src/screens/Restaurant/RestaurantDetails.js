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
  restaurantName: {
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

class RestaurantDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantAddress: '',
      restaurantArea: '',
      restaurantZipCode: '',
      restaurantState: '',
      restaurantPhone: '',
      restaurantType: '',
      restaurantEmail: '',
      restaurantDescription: '',
      restaurantImageUrl: '',
      restaurantName: this.props.navigation.state.params.restaurantName,
    };
    this.ref = firebase.firestore().collection('restaurants');
    this.navigateReservation = this.navigateReservation.bind(this);
  }

  componentDidMount() {
    this.ref.where("restaurantName","==",this.state.restaurantName)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const {
            restaurantAddress,
            restaurantArea,
            restaurantZipCode,
            restaurantState,
            restaurantPhone,
            restaurantType,
            restaurantEmail,
            restaurantDescription,
            restaurantImageUrl,
          } = doc.data();

          this.setState({ 
            restaurantAddress: restaurantAddress,
            restaurantArea: restaurantArea,
            restaurantZipCode: restaurantZipCode,
            restaurantState: restaurantState,
            restaurantPhone: restaurantPhone,
            restaurantType: restaurantType,
            restaurantEmail: restaurantEmail,
            restaurantDescription: restaurantDescription,
            restaurantImageUrl: restaurantImageUrl
          });
        });
      })
      .catch((error) => console.log(error))
  }

  navigateReservation() {
    this.props.navigation.navigate('ReservationDetails', {restaurantName: this.state.restaurantName, restaurantEmail: this.state.restaurantEmail})
  }

  render() {
    return(
      <ScrollView>
        <Image 
          source={{uri: this.state.restaurantImageUrl}}
          style={styles.imageContainer}
        />
        
        <View style={styles.container}>
          <Text style={styles.restaurantName}>
            {this.state.restaurantName}
          </Text>
          <Text style={styles.title}>
            Location: {this.state.restaurantState}
          </Text>
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Description {'\n'}
          </Text>
          <Text style={styles.body}>
            {this.state.restaurantDescription}
          </Text>
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Address {'\n'}
          </Text>
          <Text style={styles.body}>
            {this.state.restaurantAddress},{this.state.restaurantArea},{this.state.restaurantZipCode},{this.state.restaurantState}
          </Text>
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Email {'\n'}
          </Text>
          <Text style={styles.body}>
            {this.state.restaurantEmail}
          </Text>
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Phone Number {'\n'}
          </Text>
          <Text style={styles.body}>
            {this.state.restaurantPhone}
          </Text>

          <ButtonComponent
            buttonStyle={{marginTop: 15}}
            text="Make Reservation"
            type="primary"
            shape="round"
            backgroundColors={['#ff1493', '#ff72be']}
            gradientStart={{ x: 0.5, y: 1 }}
            gradientEnd={{ x: 1, y: 1 }}
            height={65}
            onPress={() => this.navigateReservation()}
          >
          </ButtonComponent>
        </View>

      </ScrollView>
    );
  }
}

export default RestaurantDetails;
