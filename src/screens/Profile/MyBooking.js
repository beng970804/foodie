import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class MyBooking extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text> MyBooking </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF'
  }
})

export default MyBooking;
