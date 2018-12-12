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

class AdminRestaurantList extends Component {
    // toggle a todo as completed or not via update()
    // toggleComplete() {
    //     this.props.doc.ref.update({
    //         complete: !this.props.complete,
    //     });
    // }
    constructor(props) {
        super(props);   
        this.state = {
            activeRowKey: null,
            activeImage: null
        };   
        this.ref = firebase.firestore().collection('restaurants');
        this.sto = firebase.storage();
        this.confirmation = this.confirmation.bind(this);  
        this.deleteRestaurant = this.deleteRestaurant.bind(this);  
        this.deleteSuccessful = this.deleteSuccessful.bind(this);
        this.deleteFailed = this.deleteFailed.bind(this);   
        this.deleteImage = this.deleteImage.bind(this);      
    }

    confirmation(deletingRow, deletingImage) {
        Alert.alert(
            'Alert',
            'Are you sure you want to delete?',
            [
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => {        
                  this.deleteRestaurant(deletingRow, deletingImage);
                }},
            ],
            { cancelable: true }
        );
    }

    deleteSuccessful() {
        Alert.alert(
            'Successful',
            'The restaurant has been deleted successfully'
        );
    }

    deleteFailed() {
        Alert.alert(
            'Failed',
            'The restaurant is failed to be delete'
        );
    }

    deleteRestaurant(deletingRow, deletingImage) {
        this.ref.doc(deletingRow)
        .delete()
        .then(() => this.deleteImage(deletingImage))
        .catch(() => this.deleteFailed());
    }

    deleteImage(deletingImage) {
        this.sto.refFromURL(deletingImage)
        .delete()
        .then(() => this.deleteSuccessful())
        .catch(() => this.deleteFailed());
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
                this.setState({ activeRowKey: this.props.id, activeImage: this.props.restaurantImageUri });
            },      
            right: [
                {   
                    onPress: () => {
                        const deletingRow = this.state.activeRowKey;  
                        const deletingImage = this.state.activeImage;    
                        this.confirmation(deletingRow, deletingImage);
                    },
                    text: 'Delete', type: 'delete' 
                }
            ], 
            rowId: this.props.index, 
            sectionId: 1   
        }; 
        return (
        //   <TouchableHighlight
        //     onPress={() => this.toggleComplete()}
        //   >
        <Swipeout {...swipeSettings}>
            <View style={styles.columeContainer}>
                <View style={styles.rowContainer}>
                    <Image
                        source={{uri: this.props.restaurantImageUrl}}
                        style={styles.imageContainer}
                    />

                    <View style={styles.textContainer}>
                        <Text style={styles.titleContainer}>{this.props.restaurantName}</Text>
                        <Text style={styles.subtitleContainer}>{this.props.restaurantDescription}</Text>
                    </View>
                </View>
            </View>
        </Swipeout>
        //</TouchableHighlight>
        );
    }
}

export default AdminRestaurantList;