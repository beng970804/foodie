import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import { fonts, colors } from '../theme';

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    flexDirection: 'row'
  },
  buttonText: {
    color: colors.primary,
    fontFamily: fonts.light,
    fontSize: 22,
    letterSpacing: 0.5
  }
})

const Button = ({onPress, children, styleButton}) => {
  return(
  <TouchableOpacity style={styleButton} onPress={onPress}>
    <View style={styles.button}>
      <Text style={[styles.buttonText]}>{children}</Text>
    </View>
  </TouchableOpacity>
  );
};

export default Button;