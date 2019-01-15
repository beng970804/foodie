import React from 'react'
import {
  StyleSheet,
  TextInput,
  View,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, fonts } from '../theme';

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        height: this.startHeaderHeight
    },
    searchBar: {
        flexDirection: 'row',
        padding: 1,
        backgroundColor: 'white',
        marginHorizontal: 20,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 0},
        elevation: 1,
        marginTop: Platform.OS == 'android' ? 15 : null,
        marginBottom: Platform.OS == 'android' ? 10 : null
    },
    searchIcon: {
        marginRight: 15,
        marginLeft: 15,
        marginTop: 8
    },
    searchInput: {
        flex: 1,
        fontWeight: '700',
        backgroundColor: 'white'
    }
})

const SearchBar = ({ onChangeText, ...props }) => (
    <View style={[styles.headerContainer]}>
        <View style={[styles.searchBar]}>
            <Ionicons name="ios-search" size={30} style={[styles.searchIcon]}/>
            <TextInput
                underlineColorAndroid="transparent"
                placeholder="Search Here"
                placeholderTextColor="grey"
                style={[styles.searchInput]}
                onChangeText={text => onChangeText(text)}
                autoCorrect={false}
                {...props}
            />
        </View>
    </View>
)

export default SearchBar;