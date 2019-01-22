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
  dishesName: {
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

class OrderingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',
      option: 'Dine In',
      remarks: '',
      loading: false,
      dishesName: this.props.navigation.state.params.dishesName,
      restaurantName: this.props.navigation.state.params.restaurantName,
      restaurantEmail: this.props.navigation.state.params.restaurantEmail,
    };
    this.ref = firebase.firestore().collection('foodOrder');
    this.makeOrdering = this.makeOrdering.bind(this);
    this.orderedSuccessful = this.orderedSuccessful.bind(this);
  }

  makeOrdering() {
    this.setState({
      loading: true
    })
    let userEmail = firebase.auth().currentUser.email;
    this.ref.add({
      orderedFood: this.state.dishesName,
      customerEmail: userEmail,
      restaurantEmail: this.state.restaurantEmail,
      orderedTime: this.state.time,
      orderedOption: this.state.option,
      orderedRemarks: this.state.remarks
    })
    .then(this.orderedSuccessful())
    .catch((error) => console.log(error))
  }

  orderedSuccessful() {
    this.setState({
      loading: false
    })
    Alert.alert(
      'Successful',
      'You had make the ordering successfully',
    )
  }

  render() {
    return (
      <ScrollView>
        <Image 
          source={require('../../assets/order.jpg')}
          style={styles.imageContainer}
        />

        <View style={styles.container}>
          <Text style={styles.dishesName}>
            {this.state.dishesName}
          </Text>
          <Text style={styles.title}>
            Restaurant: {this.state.restaurantName}
          </Text>       
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Dine In or Take Away
          </Text>
          <Picker
            selectedValue={this.state.option}
            style={{ height: 60, width: '100%' }}
            onValueChange={(itemValue, itemIndex) => this.setState({option: itemValue})}>
            <Picker.Item label="Dine In" value="Dine In" />
            <Picker.Item label="Take Away" value="Take Away" />
          </Picker>
        </View>
        <View style = {styles.lineStyle} />

        <View style={styles.container}>
          <Text style={styles.title}>
            Expected Time Arrival
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
            Remarks
          </Text>
          <Input
            placeholder="No spicy"
            onChangeText={remarks => this.setState({ remarks })}
            value={this.state.remarks}
          />
        </View>

        <View style={styles.container}>
          <ButtonComponent
            buttonStyle={{marginTop: 15}}
            text="Confirm Order"
            type="primary"
            shape="round"
            backgroundColors={['#ff1493', '#ff72be']}
            gradientStart={{ x: 0.5, y: 1 }}
            gradientEnd={{ x: 1, y: 1 }}
            height={65}
            onPress={() => this.makeOrdering()}
          >
          </ButtonComponent>
        </View>
        
      </ScrollView>
    );
  }
}

export default OrderingDetails;
