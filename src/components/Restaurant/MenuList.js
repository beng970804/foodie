import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import Swipeout from 'react-native-swipeout';
import firebase, { firestore } from 'react-native-firebase';

const styles = StyleSheet.create({
    columeContainer: {
        flex: 1, 
        flexDirection:'column',
        borderWidth: 1,
        borderTopColor: '#FFFFFF',
        borderBottomColor: '#B9B9B9',
    },
    rowContainer: {
        flex: 1, 
        flexDirection:'row'
    },
    imageContainer: {
        width: 100, 
        height: 100, 
        margin: 1,
        margin: 5,
        borderRadius: 5,
    },
    textContainer: {
        flex: 1, 
        flexDirection:'column', 
        height: 100
    },
    titleContainer: {
        fontSize: 25
    },
    subtitleContainer: {
        
    }
})

class MenuList extends Component {
    constructor(props) {
        super(props);   
        this.state = {
            activeRowKey: null,
            activeImage: null
        };   
        let uid = firebase.auth().currentUser.uid;
        this.ref = firebase.firestore().collection('menu').doc(uid).collection('food');
        this.sto = firebase.storage();
        this.confirmation = this.confirmation.bind(this);   
    }

    confirmation(deletingRow, deletingImage) {
        Alert.alert(
            'Alert',
            'Are you sure you want to delete?',
            [
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => {        
                  this.deleteDishes(deletingRow, deletingImage);
                }},
            ],
            { cancelable: true }
        );
    }

    render() { 
        const swipeSettings = {
            autoClose: true,
            backgroundColor: '#FFFFFF',
            onClose: (secId, rowId, direction) => {
                if(this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null, activeImage: null });
                } 
            },          
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.id, activeImage: this.props.dishesImageUrl });
            },      
            right: [
                {   
                    onPress: () => {
                        const deletingRow = this.state.activeRowKey;  
                        const deletingImage = this.state.activeImage;    
                        this.confirmation(deletingRow, deletingImage);
                    },
                    text: 'View',
                }
            ], 
            rowId: this.props.index, 
            sectionId: 1   
        }; 
        return (
        <Swipeout {...swipeSettings}>
            <View style={styles.columeContainer}>
                <View style={styles.rowContainer}>
                    <Image
                        source={{uri: this.props.dishesImageUrl}}
                        style={styles.imageContainer}
                    />

                    <View style={styles.textContainer}>
                        <Text style={styles.titleContainer}>{this.props.dishesName}</Text>
                        <Text style={styles.subtitleContainer}>{this.props.dishesDescription}</Text>
                    </View>
                </View>
            </View>
        </Swipeout>
        );
    }
}

export default MenuList;