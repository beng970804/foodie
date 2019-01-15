import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firebase, { firestore } from 'react-native-firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF'
  }
})

class MyOrdering extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text> MyOrdering </Text>
      </View>
    );
  }
}

export default MyOrdering;
