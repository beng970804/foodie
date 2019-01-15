import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF'
  }
})

class MyFavourite extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text> MyFavourite </Text>
      </View>
    );
  }
}

export default MyFavourite;
