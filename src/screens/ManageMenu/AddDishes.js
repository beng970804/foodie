import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Keyboard, Platform } from 'react-native';
import firebase, { firestore } from 'react-native-firebase';
import { Tile, Button } from 'react-native-elements';
import ImagePicker, { showImagePicker } from 'react-native-image-picker';

import { fonts, colors } from '../../theme';
import Input from '../../components/Input';
import Spinner from '../../components/Spinner';

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

class AddDishes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: null, 
      dishesName: '', 
      dishesDescription: '',
      dishesPrice: '',
      dishesIngredients: '',
      error: '',
      loading: false
    };
    this.addMenu = this.addMenu.bind(this);
    this.showImagePicker = this.showImagePicker.bind(this);
    this.addData = this.addData.bind(this);
    this.addSuccessful = this.addSuccessful.bind(this);
    this.addFailed = this.addFailed.bind(this);
  }

  uploadPhoto = async (response, mime='application/octet-stream') => {
    const imageURI = Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri;
    const imageRef = firebase.storage().ref('menuImage').child(response.fileName);
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

  addMenu() {
    Keyboard.dismiss();
    this.setState({loading: true});
    if (
      !this.state.dishesName || 
      !this.state.dishesDescription ||
      !this.state.dishesIngredients ||
      !this.state.dishesPrice ){
      return this.setState({error: 'Please fill in all the fields.', loading: false});
    }else if (this.state.imageSource === null){
      return this.setState({error: "Please select a dishes's images.", loading: false});
    }return (
      this.uploadPhoto(this.state.imageSource, mime = 'image/jpg')
    );
  }

  addSuccessful() {
    !this.isSuccussful && this.setState({
      dishesName: '',
      dishesDescription: '',
      dishesPrice: '',
      dishesIngredients: '',
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
    let uid = firebase.auth().currentUser.uid;
    this.ref = firebase.firestore().collection('menu'); //addToDatabase
    this.ref.add({
      userId: uid,
      dishesName : this.state.dishesName,
      dishesDescription : this.state.dishesDescription,
      dishesPrice : this.state.dishesPrice,
      dishesIngredients : this.state.dishesIngredients,
      dishesImageUrl : url
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
        title = "Add Dishes"
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
        onPress={() => this.addMenu()}
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
          title = "Select Dishes's Image"
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
            onChangeText={dishesName => this.setState({ dishesName })}
            value={this.state.dishesName}
          />
          <Input
            placeholder="Description"
            onChangeText={dishesDescription => this.setState({ dishesDescription })}
            value={this.state.dishesDescription}
          />
          <Input
            placeholder="Ingredients"
            onChangeText={dishesIngredients => this.setState({ dishesIngredients })}
            value={this.state.dishesIngredients}
          />
          <Input
            placeholder="Price"
            onChangeText={dishesPrice => this.setState({ dishesPrice })}
            value={this.state.dishesPrice}
          />
        </View>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>
          
        {this.renderButton()}

      </ScrollView>
    );
  }
}

export default AddDishes;
