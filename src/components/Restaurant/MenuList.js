import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import Swipeout from 'react-native-swipeout';
import firebase, { firestore } from 'react-native-firebase';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';

import Input from '../Input';
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
        
    },
    //Modal Style
    bottomModal: {
        margin: 0,
        marginHorizontal: 15
    },
    container: {
        height: 400,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center"
    },
    inputContainer: {
        marginTop: 10,
        justifyContent: 'center',
    }  
})

class MenuList extends Component {
    constructor(props) {
        super(props);   
        this.state = {
            activeRowKey: null,
            activeImage: null,
            isModalVisible: false,
            restaurantUserId: '',
            restaurantName: '',
            restaurantEmail: '',
            dishesName: '',
            dishesPrice: '',
            dishesIngredients: '',
            dishesDescription: '',
        };   
        this.ref = firebase.firestore().collection('menu');
        this.ref2 = firebase.firestore().collection('restaurants');
        this.ref3 = firebase.firestore().collection('users');
        this.ref4 = firebase.firestore().collection('foodOrder');
        this.viewMenu = this.viewMenu.bind(this);   
        this.getRestaurantEmail = this.getRestaurantEmail.bind(this);
        this.getRestaurantName = this.getRestaurantName.bind(this); 
        this.openModel = this.openModel.bind(this);
        this.navigateOrdering = this.navigateOrdering.bind(this);
        this.confirmation = this.confirmation.bind(this);
        this.orderedSuccessful = this.orderedSuccessful.bind(this);
    }

    viewMenu(menuRow, menuImage) {
        this.ref.doc(menuRow)
        .get()
        .then((doc) => {
            const { 
                dishesName,
                dishesPrice,
                dishesIngredients,
                dishesDescription,
                userId 
            } = doc.data();
            this.setState({
                dishesName: dishesName,
                dishesDescription: dishesDescription,
                dishesPrice: dishesPrice,
                dishesIngredients: dishesIngredients,
                restaurantUserId: userId, 
            })
            this.getRestaurantEmail();
        })
        .catch((error) => console.log(error));
    }

    getRestaurantEmail() {
        this.ref3.doc(this.state.restaurantUserId)
        .get()
        .then((doc) => {
            const { 
                userEmail, 
            } = doc.data();
            this.setState({
                restaurantEmail: userEmail
            })
            this.getRestaurantName();
        })
        .catch((error) => console.log(error))
    }

    getRestaurantName() {
        this.ref2.where('restaurantEmail','==',this.state.restaurantEmail )
        .get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
            const { 
                restaurantName, 
            } = doc.data();
            this.setState({
                restaurantName: restaurantName
            })
            this.openModel();
            })
        })
        .catch((error) => console.log(error))
    }

    openModel() {
        this.setState({
            isModalVisible: !this.state.isModalVisible 
        })  
    }

    handleOnScroll = event => {
        this.setState({
          scrollOffset: event.nativeEvent.contentOffset.y
        });
    };

    navigateOrdering = () => {
        Alert.alert(
          'Confirmation',
          'Do you confirm to order the food?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Confirm', onPress: () => this.confirmation()},
          ],
          { cancelable: false }
        )
    }

    confirmation() {
        let userEmail = firebase.auth().currentUser.email;
        this.ref4.add({
            customerEmail: userEmail,
            orderedFood: this.state.dishesName,
            restaurantEmail: this.state.restaurantEmail
        })
        .then(() => this.orderedSuccessful())
        .catch((error) => console.log(error))
        // .get()
        // .then((querySnapshot) => {
        //   querySnapshot.forEach((doc) => {
        //       this.makeOrdering(doc);
        //     });   
        //   })
        // .catch((error) => console.log(error));
    }

    //not working but successfully save to database
    orderedSuccessful() {
        Alert.alert(
            'Successful',
            'You had make the order successfully',
            { cancelable: false }
        )
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
                        const menuRow = this.state.activeRowKey;  
                        const menuImage = this.state.activeImage;    
                        this.viewMenu(menuRow, menuImage);
                    },
                    text: 'View',
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
                    scrollOffsetMax={400 - 100} // content height - ScrollView height
                    style={styles.bottomModal}
                >

                    <View style={styles.container}>
                        <View 
                        ref={ref => (this.scrollViewRef = ref)}
                        onScroll={this.handleOnScroll}
                        scrollEventThrottle={16}
                        >

                            <View style={styles.inputContainer}>
                                <Input
                                    editable = {false}
                                    onChangeText={restaurantName => this.setState({ restaurantName })}
                                    value={this.state.restaurantName}
                                />
                                <Input
                                    editable = {false}
                                    onChangeText={dishesName => this.setState({ dishesName })}
                                    value={this.state.dishesName}
                                />
                                <Input
                                    editable = {false}
                                    onChangeText={dishesDescription => this.setState({ dishesDescription })}
                                    value={this.state.dishesDescription}
                                />
                                <Input
                                    editable = {false}
                                    onChangeText={dishesIngredients => this.setState({ dishesIngredients })}
                                    value={this.state.dishesIngredients}
                                />
                                <Input
                                    editable = {false}
                                    onChangeText={dishesPrice => this.setState({ dishesPrice })}
                                    value={this.state.dishesPrice}
                                />
                            </View>

                            <Button 
                                title = "Order"
                                textStyle = {{
                                    color: colors.grey,
                                    fontWeight: '100',
                                }}
                                buttonStyle={{
                                    backgroundColor: "#FFFFFF",
                                    borderColor: "#FF1493",
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    marginTop: 30,
                                    marginHorizontal: 70
                                }}
                                onPress={() => this.navigateOrdering()}
                            />

                        </View>
                    </View>
                </Modal>
            )
        } else {
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
                                <Text style={styles.subtitleContainer}>RM {this.props.dishesPrice}</Text>
                            </View>
                        </View>
                    </View>
                </Swipeout>
            );
        } 
    }
}

export default MenuList;