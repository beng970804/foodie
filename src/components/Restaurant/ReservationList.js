import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import firebase, { firestore } from 'react-native-firebase';
import Swipeout from 'react-native-swipeout';
import Modal from 'react-native-modal';

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
        color: colors.primary,
        fontSize: 25,
        fontFamily: fonts.bold,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    dateContainer: {
        color: '#666',
        fontSize: 18,
        marginTop: 5,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    subtitleContainer: {
        color: colors.primary,
        fontSize: 18,
        marginTop: 5,
        fontWeight: 'bold',
    },
    //Modal Style
    bottomModal: {
        margin: 0,
        marginHorizontal: 10
    },
    container: {
        height: 450,
        backgroundColor: "#FFFFFF",
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor: colors.grey,
        marginTop: 10,
    },
    body: {
        marginTop: -10,
    },
    modelContainer: {
        marginHorizontal: 20,
        marginTop: 10,
    },
})

var screen = Dimensions.get('window');
class ReservationList extends Component {
    constructor(props) {
        super(props);   
        this.state = {
            activeRowKey: null,
            isModalVisible: false,
            customerEmail: '',
            reservationDate: '',
            reservationPax: '',
            reservationRemarks: '',
            reservationTime: '',
        };
        this.ref = firebase.firestore().collection('reservation');
        this.deleteReservation = this.deleteReservation.bind(this);
        this.confirmation = this.confirmation.bind(this);
        this.deleteSuccessful = this.deleteSuccessful.bind(this);
        this.deleteFailed = this.deleteFailed.bind(this); 
        this.model = this.model.bind(this);
        this.openModel = this.openModel.bind(this);
    }

    confirmation(deletingRow) {
        Alert.alert(
            'Alert',
            'Are you sure you want to delete?',
            [
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => {        
                  this.deleteReservation(deletingRow);
                }},
            ],
            { cancelable: true }
        );
    }

    deleteReservation(deletingRow) {
        this.ref.doc(deletingRow)
        .delete()
        .then(() => this.deleteSuccessful())
        .catch(() => this.deleteFailed());
    }

    deleteSuccessful() {
        Alert.alert(
            'Successful',
            'The reservation has been deleted successfully'
        );
    }

    deleteFailed() {
        Alert.alert(
            'Failed',
            'The reservation is failed to be delete'
        );
    }

    model(viewRow) {
        this.ref.doc(viewRow)
        .get()
        .then((doc) => {
            const { 
                customerEmail,
                reservationDate,
                reservationPax,
                reservationRemarks,
                reservationTime 
            } = doc.data();
            this.setState({
                customerEmail: customerEmail,
                reservationDate: reservationDate,
                reservationPax: reservationPax,
                reservationRemarks: reservationRemarks,
                reservationTime: reservationTime, 
            })

            this.openModel();
        })
        .catch((error) => console.log(error));
    }

    openModel() {
        this.setState({
          isModalVisible: !this.state.isModalVisible 
        })
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
                        const viewRow = this.state.activeRowKey;     
                        this.model(viewRow);
                    },
                    text: 'Details', 
                    // type: 'edit' 
                },
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
        if (this.state.isModalVisible == true) {
            return (
                <Modal 
                    isVisible={this.state.isModalVisible}
                    onSwipe={() => this.setState({ isModalVisible: false })}
                    swipeDirection="down"
                    // scrollTo={this.handleScrollTo}
                    scrollOffset={this.state.scrollOffset}
                    scrollOffsetMax={400 - 300} // content height - ScrollView height
                    style={styles.bottomModal}>

                    <View style={styles.container}>
                        <View 
                            ref={ref => (this.scrollViewRef = ref)}
                            onScroll={this.handleOnScroll}
                            scrollEventThrottle={16}>

                        <View style={styles.modelContainer}>
                            <Text style={styles.subtitleContainer}>
                                Customer {'\n'}
                            </Text>
                            <Text style={styles.body}>
                                {this.state.customerEmail}
                            </Text>      
                        </View>
                        <View style = {styles.lineStyle} />

                        <View style={styles.modelContainer}>
                            <Text style={styles.subtitleContainer}>
                                Reserved Date {'\n'}
                            </Text>
                            <Text style={styles.body}>
                                {this.state.reservationDate}
                            </Text>      
                        </View>
                        <View style = {styles.lineStyle} />

                        <View style={styles.modelContainer}>
                            <Text style={styles.subtitleContainer}>
                                Reserved Time {'\n'}
                            </Text>
                            <Text style={styles.body}>
                                {this.state.reservationTime}
                            </Text>      
                        </View>
                        <View style = {styles.lineStyle} />

                        <View style={styles.modelContainer}>
                            <Text style={styles.subtitleContainer}>
                                Reserved Pax {'\n'}
                            </Text>
                            <Text style={styles.body}>
                                {this.state.reservationPax} person
                            </Text>      
                        </View>
                        <View style = {styles.lineStyle} />

                        <View style={styles.modelContainer}>
                            <Text style={styles.subtitleContainer}>
                                Remarks {'\n'}
                            </Text>
                            <Text style={styles.body}>
                                {this.state.reservationRemarks} 
                            </Text>      
                        </View>
                        <View style = {styles.lineStyle} />

                        </View>
                    </View>
                </Modal>
            );
        } else {
            return (
                <Swipeout {...swipeSettings}>
                    <ScrollView>
                        <View style={styles.columeContainer}>
                            <View style={styles.rowContainer}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.titleContainer}>{this.props.customerEmail}</Text>
                                    <Text style={styles.dateContainer}>{this.props.reservationDate}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </Swipeout>
            );
        };
    }
}

export default ReservationList;