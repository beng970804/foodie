import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, Picker, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import ButtonComponent, { CircleButton, RoundButton, RectangleButton } from 'react-native-button-component';
import firebase from 'react-native-firebase';

import Input from '../../components/Input';
import { fonts, colors } from '../../theme';
import Spinner from '../../components/Spinner';

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  imageContainer: {
    flex:1 , 
    width: deviceWidth, 
    height: 300,
  },
  container: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  title: {
    color: '#666',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  restaurantName: {
    color: colors.primary,
    fontSize: 25,
    fontFamily: fonts.bold,
    fontWeight: 'bold'
  },
  lineStyle:{
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginTop: 10,
  },
})

class ReservationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '2019-02-01',
      time: '',
      pax: '1',
      remarks: '',
      loading: false,
      restaurantName: this.props.navigation.state.params.restaurantName,
      restaurantEmail: this.props.navigation.state.params.restaurantEmail,
    };
    this.ref = firebase.firestore().collection('reservation');
    this.makeBooking = this.makeBooking.bind(this);
    this.bookedSuccessful = this.bookedSuccessful.bind(this);
  }

  makeBooking() {
    this.setState({
      loading: true
    })
    let userEmail = firebase.auth().currentUser.email;
    this.ref.add({
      customerEmail: userEmail,
      restaurantEmail: this.state.restaurantEmail,
      reservationDate: this.state.date,
      reservationTime: this.state.time,
      reservationPax: this.state.pax,
      reservationRemarks: this.state.remarks
    })
    .then(this.bookedSuccessful())
    .catch((error) => console.log(error))
  }

  bookedSuccessful() {
    this.setState({
      loading: false
    })
    Alert.alert(
      'Successful',
      'You had make the reservation successfully',
    )
  }

  render() {
    return (
      <ScrollView>
        <Image 
          source={require('../../assets/reservation.png')}
          style={styles.imageContainer}
        />

        <View style={styles.container}>
          <Text style={styles.restaurantName}>
            {this.state.restaurantName}
          </Text>
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Date
          </Text>
          <DatePicker 
            style={{width: 350, marginTop: 10}}
            date={this.state.date}
            mode="date"
            placeholder="Choose Date"
            format="YYYY-MM-DD"
            minDate="2019-02-01"
            maxDate="3000-12-31"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date) => {this.setState({date: date});}}
          />
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Time
          </Text>
          <DatePicker 
            style={{width: 350, marginTop: 10}}
            date={this.state.time}
            mode="time"
            placeholder="Choose Time"
            format="HH:mm"
            minuteInterval={10}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(time) => {this.setState({time: time});}}
          />
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Number of Person
          </Text>
          <Picker
            selectedValue={this.state.pax}
            style={{ height: 60, width: '100%' }}
            onValueChange={(itemValue, itemIndex) => this.setState({pax: itemValue})}>
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
            <Picker.Item label="7" value="7" />
            <Picker.Item label="8" value="8" />
            <Picker.Item label="9" value="9" />
            <Picker.Item label="10" value="10" />
          </Picker>
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Remarks
          </Text>
          <Input
            placeholder="Need a baby chair"
            onChangeText={remarks => this.setState({ remarks })}
            value={this.state.remarks}
          />
        </View>

        <View style={styles.container}>
          <ButtonComponent
            buttonStyle={{marginTop: 15}}
            text="Confirm Reservation"
            type="primary"
            shape="round"
            backgroundColors={['#ff1493', '#ff72be']}
            gradientStart={{ x: 0.5, y: 1 }}
            gradientEnd={{ x: 1, y: 1 }}
            height={65}
            onPress={() => this.makeBooking()}
          >
          </ButtonComponent>
        </View>
        
      </ScrollView>
    );
  }
}

export default ReservationDetails;
