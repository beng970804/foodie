import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import Swipeout from 'react-native-swipeout';
import firebase, { firestore } from 'react-native-firebase';
import Modal from 'react-native-modal';

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
    height: 200,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center"
  },
  inputContainer: {
    marginTop: 10,
    justifyContent: 'center',
  }  
})

class PromotionList extends Component {
    constructor(props) {
        super(props);   
        this.state = {
            activeRowKey: null,
            activeImage: null,
            isModalVisible: false,
            restaurantUserId: '',
            restaurantEmail: '',
            restaurantName: '',
            promotionName: '',
            promotionDescription: ''
        };   
        this.ref = firebase.firestore().collection('promotion');
        this.ref2 = firebase.firestore().collection('restaurants');
        this.ref3 = firebase.firestore().collection('users');
        this.model = this.model.bind(this);  
        this.openModel = this.openModel.bind(this);
        this.getRestaurantEmail = this.getRestaurantEmail.bind(this);
        this.getRestaurantName = this.getRestaurantName.bind(this); 
    }

    model(promotionRow, promotionImage) {
        this.ref.doc(promotionRow)
        .get()
        .then((doc) => {
            const { 
                promotionName, 
                promotionDescription, 
                userId 
            } = doc.data();
            this.setState({
                promotionName: promotionName,
                promotionDescription: promotionDescription,
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
                this.setState({ activeRowKey: this.props.id, activeImage: this.props.promotionImageUrl });
            },      
            right: [
                {   
                    onPress: () => {
                        const promotionRow = this.state.activeRowKey;  
                        const promotionImage = this.state.activeImage;    
                        this.model(promotionRow, promotionImage);
                    },
                    text: 'View'
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
                                    onChangeText={promotionName => this.setState({ promotionName })}
                                    value={this.state.promotionName}
                                />
                                <Input
                                    editable = {false}
                                    onChangeText={promotionDescription => this.setState({ promotionDescription })}
                                    value={this.state.promotionDescription}
                                />
                            </View>

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
                                source={{uri: this.props.promotionImageUrl}}
                                style={styles.imageContainer}
                            />
        
                            <View style={styles.textContainer}>
                                <Text style={styles.titleContainer}>{this.props.promotionName}</Text>
                                <Text style={styles.subtitleContainer}>{this.props.promotionDescription}</Text>
                            </View>
                        </View>
                    </View>
                </Swipeout>
            );
        }
    }
}

export default PromotionList;