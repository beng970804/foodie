import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import firebase, { firestore } from 'react-native-firebase';
import Swipeout from 'react-native-swipeout';

import { fonts, colors } from '../../theme';

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
    textContainer: {
        flex: 1, 
        flexDirection:'column', 
        height: 100
    },
    titleContainer: {
        fontSize: 25,
    },
    subtitleContainer: {
        
    } 
})

var screen = Dimensions.get('window');
class OrderingList extends Component {
    constructor(props) {
        super(props);   
        this.state = {
            activeRowKey: null,
        };
        this.deleteOrdering = this.deleteOrdering.bind(this);
        this.confirmation = this.confirmation.bind(this);
        this.deleteSuccessful = this.deleteSuccessful.bind(this);
        this.deleteFailed = this.deleteFailed.bind(this); 
    }

    confirmation(deletingRow) {
        Alert.alert(
            'Alert',
            'Are you sure you want to delete?',
            [
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => {        
                  this.deleteOrdering(deletingRow);
                }},
            ],
            { cancelable: true }
        );
    }

    deleteOrdering(deletingRow) {
        this.ref = firebase.firestore().collection('foodOrder')
        this.ref.doc(deletingRow)
        .delete()
        .then(() => this.deleteSuccessful())
        .catch(() => this.deleteFailed());
    }

    deleteSuccessful() {
        Alert.alert(
            'Successful',
            'The ordering has been deleted successfully'
        );
    }

    deleteFailed() {
        Alert.alert(
            'Failed',
            'The ordering is failed to be delete'
        );
    }

    render() { 
        const swipeSettings = {
            autoClose: true,
            backgroundColor: '#FFFFFF',
            onClose: (secId, rowId, direction) => {
                if(this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                } 
            },          
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.id });
            },      
            right: [
                {   
                    onPress: () => {
                        const deletingRow = this.state.activeRowKey;     
                        this.confirmation(deletingRow);
                    },
                    text: 'Delete', type: 'delete' 
                }
            ], 
            rowId: this.props.index, 
            sectionId: 1   
        }; 
      return (
        <Swipeout {...swipeSettings}>
            <View style={styles.columeContainer}>
                <View style={styles.rowContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.titleContainer}>{this.props.customerEmail}</Text>
                        <Text style={styles.subtitleContainer}>{this.props.orderedFood}</Text>
                    </View>
                </View>
            </View>
        </Swipeout>
      );
    }
}

export default OrderingList;