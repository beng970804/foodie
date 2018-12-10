import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Keyboard, Platform } from 'react-native'
import firebase, { firestore } from 'react-native-firebase'
import { Tile, Button } from 'react-native-elements'
import ImagePicker, { showImagePicker } from "react-native-image-picker"

import { fonts, colors } from '../../theme'
import Input from '../../components/Input'
import Spinner from '../../components/Spinner'

const styles = StyleSheet.create({

})

class DeleteRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <ScrollView>
        
      </ScrollView>
    );
  }
}

export default DeleteRestaurant;
