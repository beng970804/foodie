import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Spinner = ({ size }) => {
    return (
        <View>
            <ActivityIndicator size={size || 'large'} />
        </View>
    );
}

export default Spinner;
