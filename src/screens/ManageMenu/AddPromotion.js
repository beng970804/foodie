import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Keyboard, Platform } from 'react-native';
import firebase, { firestore } from 'react-native-firebase';
import { Tile } from 'react-native-elements';
import ImagePicker, { showImagePicker } from "react-native-image-picker";
import ButtonComponent, { CircleButton, RoundButton, RectangleButton } from 'react-native-button-component';

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

class AddPromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: null, 
      promotionName: '', 
      promotionDescription: '',
      error: '',
      loading: false
    };
    this.addPromotion = this.addPromotion.bind(this);
    this.showImagePicker = this.showImagePicker.bind(this);
    this.addData = this.addData.bind(this);
    this.addSuccessful = this.addSuccessful.bind(this);
    this.addFailed = this.addFailed.bind(this);
  }

  uploadPhoto = async (response, mime='application/octet-stream') => {
    const imageURI = Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri;
    const imageRef = firebase.storage().ref('promotionImage').child(response.fileName);
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

  addPromotion() {
    Keyboard.dismiss();
    this.setState({loading: true});
    if (
      !this.state.promotionName || 
      !this.state.promotionDescription ){
      return this.setState({error: 'Please fill in all the fields.', loading: false});
    }else if (this.state.imageSource === null){
      return this.setState({error: "Please select a promotion's images.", loading: false});
    }return (
      this.uploadPhoto(this.state.imageSource, mime = 'image/jpg')
    );
  }

  addSuccessful() {
    !this.isSuccussful && this.setState({
      promotionName: '',
      promotionDescription: '',
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
    this.ref = firebase.firestore().collection('promotion'); //addToDatabase
    this.ref.add({
      userId: uid,
      promotionName : this.state.promotionName,
      promotionDescription : this.state.promotionDescription,
      promotionImageUrl : url
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
        text="Add Promotion"
        type="primary"
        shape="round"
        backgroundColors={['#ff1493', '#ff72be']}
        gradientStart={{ x: 0.5, y: 1 }}
        gradientEnd={{ x: 1, y: 1 }}
        height={65}
        onPress={() => this.addPromotion()}
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

        <View style={{marginTop: 15, marginHorizontal: 20}}>
          <ButtonComponent
            buttonStyle={{marginTop: 15}}
            text="Select Promotion's Image"
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
            placeholder="Promotion"
            onChangeText={promotionName => this.setState({ promotionName })}
            value={this.state.promotionName}
          />
          <Input
            placeholder="Description"
            onChangeText={promotionDescription => this.setState({ promotionDescription })}
            value={this.state.promotionDescription}
          />
        </View>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>
          
        <View style={{ marginHorizontal: 20}}>
          {this.renderButton()}
        </View>

      </ScrollView>
    );
  }
}

export default AddPromotion;
