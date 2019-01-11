/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {} from 'react-native';
import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import firebase, { Firebase } from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

//initial
import SignUp from './src/screens/SignUp';
import Login from './src/screens/Login';
import Initial from './src/screens/Initial';

//customer
import Promotion from './src/screens/Promotion/index';
import Profile from './src/screens/Profile/index';
import Food from './src/screens/Food/index';
import Restaurant from './src/screens/Restaurant/index';

//Customer's profile
import MyBooking from './src/screens/Profile/MyBooking';
import MyHistory from './src/screens/Profile/MyHistory';
import MyFavourite from './src/screens/Profile/MyFavourite';

//Owner Menu Management
import ManageMenu from './src/screens/ManageMenu/index';
import AddDishes from './src/screens/ManageMenu/AddDishes';
import EditDishes from './src/screens/ManageMenu/EditDishes';
import DeleteDishes from './src/screens/ManageMenu/DeleteDishes';
import AddPromotion from './src/screens/ManageMenu/AddPromotion';
import DeletePromotion from './src/screens/ManageMenu/DeletePromotion';
import ManageOrdering from './src/screens/ManageMenu/ManageOrdering';
import ManageBooking from './src/screens/ManageMenu/ManageBooking';

//Admin Restaurant Managment
import ManageRestaurant from './src/screens/ManageRestaurant/index';
import AddRestaurant from './src/screens/ManageRestaurant/AddRestaurant';
import DeleteRestaurant from './src/screens/ManageRestaurant/DeleteRestaurant';

import { colors } from './src/theme';

const AuthState = new createStackNavigator ({
  Initial: Initial,
  Login: Login,
  SignUp: SignUp
},{
  navigationOptions: {
    header: null
  }
})

const ProfileScreen = new createSwitchNavigator ({
  MyBooking: MyBooking, 
  MyFavourite: MyFavourite,
  MyHistory: MyHistory
},{
  navigationOptions: {
    header: null
  },
})

const Customer = createBottomTabNavigator({
  Restaurant: {
      screen: Restaurant,
      navigationOptions: {
          tabBarLabel: 'RESTAURANT',
          tabBarIcon: ({ tintColor }) => (
              <Ionicons name= "ios-restaurant" size={24} color={tintColor}/>
          )
      }
  },
  Food: {
      screen: Food,
      navigationOptions: {
          tabBarLabel: 'FOOD',
          tabBarIcon: ({ tintColor }) => (
              <Ionicons name= "ios-pizza" size={24} color={tintColor}/>
          )
      }
  },
  Promotion: {
    screen: Promotion,
    navigationOptions: {
        tabBarLabel: 'PROMOTION',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name= "ios-pricetag" size={24} color={tintColor}/>
        )
    }
  },
  Profile: {
      screen: Profile,
      navigationOptions: {
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ tintColor }) => (
              <Ionicons name= "ios-contact" size={24} color={tintColor}/>
          )
      }
  }
}, {
  tabBarOptions: {
    activeTintColor: colors.primary,
    inactiveTintColor: colors.grey,
    style: {
      backgroundColor: 'white',
      borderTopWidth: 0,
      elevation: 5
    }
  }
})

const Owner = createBottomTabNavigator({
  ManageMenu: {
    screen: ManageMenu,
    navigationOptions: {
        tabBarLabel: 'ManageMenu',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name= "ios-restaurant" size={24} color={tintColor}/>
        )
    }
  }
}, {
  tabBarOptions: {
    activeTintColor: colors.primary,
    inactiveTintColor: colors.grey,
    style: {
      backgroundColor: 'white',
      borderTopWidth: 0,
      elevation: 5
    }
  } 
})

const OwnerScreen = new createSwitchNavigator ({
  AddDishes: AddDishes, 
  EditDishes: EditDishes,
  DeleteDishes: DeleteDishes,
  AddPromotion: AddPromotion,
  DeletePromotion: DeletePromotion,
  ManageBooking: ManageBooking,
  ManageOrdering: ManageOrdering,
},{
  navigationOptions: {
    header: null
  },
})


const Admin = createBottomTabNavigator({
  ManageRestaurant: {
    screen: ManageRestaurant,
    navigationOptions: {
        tabBarLabel: 'ManageRestaurant',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name= "ios-restaurant" size={24} color={tintColor}/>
        )
    }
  }
}, {
  tabBarOptions: {
    activeTintColor: colors.primary,
    inactiveTintColor: colors.grey,
    style: {
      backgroundColor: 'white',
      borderTopWidth: 0,
      elevation: 5
    }
  } 
})

const AdminScreen = new createSwitchNavigator ({
  AddRestaurant: AddRestaurant, 
  DeleteRestaurant: DeleteRestaurant,
},{
  navigationOptions: {
    header: null
  },
})

const AppStackNavigator = new createStackNavigator(
  {
    AuthState: AuthState,
    Owner: Owner,
    Admin: Admin,
    Customer: Customer,
    AdminScreen: AdminScreen,
    OwnerScreen: OwnerScreen,
    ProfileScreen: ProfileScreen
  },
  {
    initialRouteName: 'AuthState',
    navigationOptions: {
      header: null
    },
    cardStyle: { backgroundColor: '#FFFFFF' }
  }
)

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <AppStackNavigator/>
    );
  }
}