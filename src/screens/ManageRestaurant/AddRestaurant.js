import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Keyboard, Platform } from 'react-native'
import firebase, { firestore } from 'react-native-firebase'
import { Tile } from 'react-native-elements'
import ImagePicker, { showImagePicker } from "react-native-image-picker"
import ButtonComponent, { CircleButton, RoundButton, RectangleButton } from 'react-native-button-component';

import { fonts, colors } from '../../theme'
import Input from '../../components/Input'
import Spinner from '../../components/Spinner'

const options = {
  title: 'Select Image'
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF'
  },
  errorTextStyle: {
    color: '#E64A19',
    paddingTop: 5,
    paddingHorizontal: 40
  },
  inputContainer: {
    marginTop: 20,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  inputContainer2: {
    justifyContent: 'center',
    paddingHorizontal: 40,
  }
})

class AddRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: null, 
      restaurantName: '', 
      restaurantAddress: '',
      restaurantArea: '',
      restaurantZipCode: '',
      restaurantState: '',
      restaurantPhone: '',
      restaurantType: '',
      restaurantEmail: '',
      restaurantDescription: '',
      error: '',
      loading: false
    };
    this.addRestaurant = this.addRestaurant.bind(this);
    this.showImagePicker = this.showImagePicker.bind(this);
    this.addData = this.addData.bind(this);
    this.addSuccessful = this.addSuccessful.bind(this);
    this.addFailed = this.addFailed.bind(this);
  }

  uploadPhoto = async (response, mime='application/octet-stream') => {
    const imageURI = Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri;
    const imageRef = firebase.storage().ref('restaurantImage').child(response.fileName);
    await imageRef.put(imageURI, {contentType: mime}).then(() => {
      let url = imageRef.getDownloadURL().then((url) => {
        this.addData(url)
      })
    }).catch(error => {
      console.log(error);
    });
  }

  showImagePicker() {
    ImagePicker.launchImageLibrary (options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        this.setState({imageSource: response})
      }
    })
  }

  addRestaurant() {
    Keyboard.dismiss();
    this.setState({loading: true});
    if (
      !this.state.restaurantName || 
      !this.state.restaurantAddress ||
      !this.state.restaurantArea ||
      !this.state.restaurantZipCode ||
      !this.state.restaurantState ||
      !this.state.restaurantPhone || 
      !this.state.restaurantType || 
      !this.state.restaurantDescription ||
      !this.state.restaurantEmail){
      return this.setState({error: 'Please fill in all the fields.', loading: false});
    }else if (this.state.imageSource === null){
      return this.setState({error: "Please select a restaurant's images.", loading: false});
    }return (
      this.uploadPhoto(this.state.imageSource, mime = 'image/jpg')
    );
  }

  addSuccessful() {
    !this.isSuccussful && this.setState({
      restaurantName: '',
      restaurantAddress: '',
      restaurantArea: '',
      restaurantZipCode: '',
      restaurantState: '',
      restaurantPhone: '',
      restaurantType: '',
      restaurantEmail: '',
      restaurantDescription: '',
      imageSource: null,
      loading: false
    });

    Alert.alert(
      'Added successfully'
    )
  }

  addFailed() {
    Alert.alert(
      'Operation failed. Please try again later.'
    )
  }

  addData(url) {
    this.ref = firebase.firestore().collection('restaurants'); //addToDatabase
    this.ref.add({
      restaurantName : this.state.restaurantName,
      restaurantAddress : this.state.restaurantAddress,
      restaurantArea : this.state.restaurantArea,
      restaurantZipCode : this.state.restaurantZipCode,
      restaurantState : this.state.restaurantState,
      restaurantPhone : this.state.restaurantPhone,
      restaurantType : this.state.restaurantType,
      restaurantEmail : this.state.restaurantEmail,
      restaurantDescription : this.state.restaurantDescription,
      restaurantImageUrl : url
    })
    .then(() => this.addSuccessful())
    .catch(() => this.addFailed());
  }

  componentWillUnmount() {
    this.isSuccussful = true;
  }

  renderButton() {
    if (this.state.loading){
      return(
        <Spinner size="small"/>
      )
    }
    return(
      <ButtonComponent
        buttonStyle={{marginTop: 15}}
        text="Add Restaurant"
        type="primary"
        shape="round"
        backgroundColors={['#ff1493', '#ff72be']}
        gradientStart={{ x: 0.5, y: 1 }}
        gradientEnd={{ x: 1, y: 1 }}
        height={65}
        onPress={() => this.addRestaurant()}
      >
      </ButtonComponent>
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Tile
          imageSrc={this.state.imageSource != null ? this.state.imageSource : require('../../assets/xImage.png')}
          featured
          containerStyle = {{height: 320}}
          imageContainerStyle = {{height: 340}}
        /> 

        <View style={styles.inputContainer}>
          <ButtonComponent
              buttonStyle={{marginTop: 15,}}
              text="Select Restaurant's Image"
              type="primary"
              shape="round"
              backgroundColors={['#ff1493', '#ff72be']}
              gradientStart={{ x: 0.5, y: 1 }}
              gradientEnd={{ x: 1, y: 1 }}
              height={65}
              onPress={() => this.showImagePicker()}
            >
          </ButtonComponent>
        </View> 

        <View style={styles.inputContainer}>     
          <Input
            placeholder="Name"
            onChangeText={restaurantName => this.setState({ restaurantName })}
            value={this.state.restaurantName}
          />
          <Input
            placeholder="Address"
            onChangeText={restaurantAddress => this.setState({ restaurantAddress })}
            value={this.state.restaurantAddress}
          />
          <Input
            placeholder="Area"
            onChangeText={restaurantArea => this.setState({ restaurantArea })}
            value={this.state.restaurantArea}
          />
          <Input
            placeholder="Zip Code"
            onChangeText={restaurantZipCode => this.setState({ restaurantZipCode })}
            value={this.state.restaurantZipCode}
          />
          <Input
            placeholder="State"
            onChangeText={restaurantState => this.setState({ restaurantState })}
            value={this.state.restaurantState}
          />
          <Input
            placeholder="Phone Number"
            onChangeText={restaurantPhone => this.setState({ restaurantPhone })}
            value={this.state.restaurantPhone}
          />
          <Input
            placeholder="Type"
            onChangeText={restaurantType => this.setState({ restaurantType })}
            value={this.state.restaurantType}
          />
          <Input
            placeholder="Description"
            onChangeText={restaurantDescription => this.setState({ restaurantDescription })}
            value={this.state.restaurantDescription}
          />
          <Input
            placeholder="Email"
            onChangeText={restaurantEmail => this.setState({ restaurantEmail })}
            value={this.state.restaurantEmail}
          />
        </View>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>
          
        <View style={styles.inputContainer2}>
          {this.renderButton()}
        </View>

      </ScrollView>
    );
  }
}

export default AddRestaurant;
