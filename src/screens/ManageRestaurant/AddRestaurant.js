import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Keyboard, Platform } from 'react-native'
import firebase, { firestore } from 'react-native-firebase'
import { Tile, Button } from 'react-native-elements'
import ImagePicker, { showImagePicker } from "react-native-image-picker"

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
  }
})

class AddRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: null, 
      imageUrl: '',
      restaurantName: '', 
      restaurantAddress: '',
      restaurantArea: '',
      restaurantZipCode: '',
      restaurantState: '',
      restaurantPhone: '',
      restaurantType: '',
      restaurantEmail: '',
      error: '',
      loading: false
    };
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
        this.setState({imageUrl: url})
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
        this.uploadPhoto(response, mime = 'image/jpg')
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
      !this.state.restaurantEmail){
      return this.setState({error: 'Please fill in all the fields.', loading: false});
    }else if (this.state.imageSource === null){
      return this.setState({error: "Please select a restaurant's images.", loading: false});
    }return (
      this.addData()
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
      imageSource: null,
      loading: false,
      imageUrl: ''
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

  addData() {
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
      restaurantImageUri : this.state.imageUrl
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
      <Button 
        title = "ADD RESTAURANT"
        textStyle = {{
          color: colors.grey,
          fontWeight: '100',
        }}
        buttonStyle={{
          backgroundColor: "#FFFFFF",
          borderColor: "#FF1493",
          borderWidth: 2,
          borderRadius: 5,
          marginTop: 30,
          marginHorizontal: 70
        }}
        onPress={() => this.addRestaurant()}
      />
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

        <Button 
          title = "Select Restaurant's Image"
          textStyle = {{
            color: colors.grey,
            fontWeight: '100',
          }}
          buttonStyle={{
            backgroundColor: "#FFFFFF",
            borderColor: "#FF1493",
            borderWidth: 2,
            borderRadius: 5,
            marginTop: 30,
            marginHorizontal: 70
          }}
          onPress={() => this.showImagePicker()}
          />

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
            placeholder="Email"
            onChangeText={restaurantEmail => this.setState({ restaurantEmail })}
            value={this.state.restaurantEmail}
          />
        </View>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>
          
        {this.renderButton()}

      </ScrollView>
    );
  }
}

export default AddRestaurant;
