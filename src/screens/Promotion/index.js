import React, { Component } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import firebase, { Firebase } from 'react-native-firebase';
import ImagePicker, { showImagePicker } from "react-native-image-picker";

class Promotion extends Component {
  constructor(props) {
    super(props);
    this.state = {imageSource: null, imageName: null};
    this.uploadImage = this.uploadImage.bind(this);
    this.showImagePicker = this.showImagePicker.bind(this);
    this.retrieveImage = this.retrieveImage.bind(this);
  }

  uploadImage = (event, event2) => {
    let file = event.uri;
    let storageRef = firebase.storage().ref(); 
    var careerRef = storageRef.child("images/" + event2.name);
    let snapshot = careerRef.put(file);
    this.retrieveImage(snapshot);
    // let file = event.target.files[0];
    // let storageRef = firebase.storage().ref();
    // var careerRef = storageRef.child("images/" + file.name);
    // let snapshot = await careerRef.put(file);
    // let url = await storageRef.child(snapshot.ref.fullPath).getDownloadURL();
  }

  async retrieveImage(imageRetrieved){
    let url = await storageRef.child(snapshot.ref.fullPath).getDownloadURL();
    console.log(url);
  }

  showImagePicker() {
    ImagePicker.showImagePicker((response) => {
      if (!response.didCancel) {
        let source = {uri: response.uri}
        let name = {name: response.fileName}
        this.setState({imageSource: source, imageName: name})
        this.uploadImage(this.state.imageSource, this.state.imageName)
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={this.state.imageSource != null ? this.state.imageSource : require('../../assets/xImage.png')}/>
         <Button
          onPress={() => this.showImagePicker()}
          title="Select Image"
          />
          <Button
          onPress={() => this.uploadImage()}
          title="Upload Image"
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 30
  }
})

export default Promotion;
