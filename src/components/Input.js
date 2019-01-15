import React from 'react'
import {
  StyleSheet,
  TextInput
} from 'react-native';

import { colors, fonts } from '../theme';

const styles = StyleSheet.create({
  input: {
    height: 45,
    marginBottom: 15,
    borderBottomWidth: 1.5,
    fontSize: 16,
    borderBottomColor: colors.primary,
    fontFamily: fonts.light
  }
})

const Input = ({ placeholder, onChangeText, type, ...props }) => (
  <TextInput
    editable = {true}
    autoCapitalize='none'
    autoCorrect={false}
    style={[styles.input]}
    placeholder={placeholder}
    placeholderTextColor="#a0a0a0"
    onChangeText={value => onChangeText(value)}
    underlineColorAndroid='transparent'
    {...props}
  />
)

export default Input;