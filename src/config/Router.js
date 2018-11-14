import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Restaurant from '../screens/Restaurant';
import Profile from '../screens/Profile';
import Food from '../screens/Food';
import { colors } from '../theme';

export const Tabs = createBottomTabNavigator({
    Restaurant: {
        screen: Restaurant,
        navigationOptions: {
            tabBarLabel: 'Restaurant',
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name= "ios-restaurant" size={24} color={tintColor}/>
            )
        }
    },
    Food: {
        screen: Food,
        navigationOptions: {
            tabBarLabel: 'Food',
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name= "ios-pizza" size={24} color={tintColor}/>
            )
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarLabel: 'Profile',
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name= "ios-contact" size={24} color={tintColor}/>
            )
        }
    }
}, {
    tabBarOptions: {
      activeTintColor: colors.primary,
      inactiveTintColor: colors.grey,
    }
});
