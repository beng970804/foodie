import React, { Component } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Alert, Platform, Dimensions, Keyboard } from 'react-native';
import Swipeout from 'react-native-swipeout';
import firebase, { firestore } from 'react-native-firebase';
import Modal from 'react-native-modal';
import { Tile } from 'react-native-elements';
import ButtonComponent, { CircleButton, RoundButton, RectangleButton } from 'react-native-button-component';

import { fonts, colors } from '../../theme';
import Input from '../Input';
import Spinner from '../Spinner';

const options = {
    title: 'Select Image'
}

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
        color: colors.primary,
        fontSize: 25,
        fontFamily: fonts.bold,
        fontWeight: 'bold'
    },
    subtitleContainer: {
        color: colors.primary,
        fontSize: 18,
        marginTop: 5,
        fontWeight: 'bold',
        marginBottom: -20,
    },
    descriptionContainer: {
        color: '#666',
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
        height: 500,
        backgroundColor: "#FFFFFF",
    },
    modelContainer: {
        marginHorizontal: 20,
    },
    errorTextStyle: {
        color: '#E64A19',
        paddingTop: 5,
        paddingHorizontal: 40
    },
    inputContainer: {
        marginTop: 20,
        justifyContent: 'center',
        paddingHorizontal: 15,
    }  
})

var screen = Dimensions.get('window');
class MenuEditList extends Component {
    constructor(props) {
        super(props);   
        this.state = {
            activeRowKey: null,
            activeImage: null,
            isModalVisible: false,
            imageSource: null, 
            dishesName: '',
            dishesDescription: '',
            dishesImageUrl: '',
            dishesIngredients: '',
            dishesPrice: '',
            loading: false
        };   
        let uid = firebase.auth().currentUser.uid;
        this.ref = firebase.firestore().collection('menu');
        this.sto = firebase.storage();
        this.model = this.model.bind(this);  
        this.openModel = this.openModel.bind(this);
        this.editDishes = this.editDishes.bind(this);  
        this.editData = this.editData.bind(this);  
        this.editSuccessful = this.editSuccessful.bind(this);
        this.editFailed = this.editFailed.bind(this);   
    }

    model(editRow, editImage) {
        this.ref.doc(editRow)
        .get()
        .then((doc) => {
            const { dishesName, dishesDescription, dishesIngredients, dishesPrice } = doc.data();
            this.setState({
                dishesName: dishesName, 
                dishesDescription: dishesDescription,
                dishesIngredients: dishesIngredients,
                dishesPrice: dishesPrice
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

    renderButton() {
        if (this.state.loading){
          return(
            <Spinner size="small"/>
          )
        }
        return(
        <ButtonComponent
            buttonStyle={{marginTop: 15}}
            text="Update Dishes"
            type="primary"
            shape="round"
            backgroundColors={['#ff1493', '#ff72be']}
            gradientStart={{ x: 0.5, y: 1 }}
            gradientEnd={{ x: 1, y: 1 }}
            height={65}
            onPress={() => this.editDishes()}
        >
        </ButtonComponent>
    );
    }

    editDishes() {
        Keyboard.dismiss();
        this.setState({loading: true});
        if (!this.state.dishesDescription ||
            !this.state.dishesIngredients ||
            !this.state.dishesPrice )
            {
                return this.setState({error: 'Please fill in all the fields.', loading: false});
            } else {   
                return (
                    this.editData()
                );
            }
    }

    editData() {
        this.ref = firebase.firestore().collection('menu'); //addToDatabase
        this.ref.where("dishesName","==",this.state.dishesName)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.ref.doc(doc.id).update({
                    dishesDescription: this.state.dishesDescription,
                    dishesIngredients: this.state.dishesIngredients,
                    dishesPrice: this.state.dishesPrice,
                });
            });
            this.editSuccessful()
        })
        .catch(() => this.editFailed())
    }

    editSuccessful() {
        this.setState({loading: false})
        Alert.alert(
            'Successful',
            'The dishes has been edited successfully'
        );
    }

    editFailed() {
        Alert.alert( 
            'Failed',
            'The menu is failed to be edit'
        );
    }

    handleOnScroll = event => {
        this.setState({
          scrollOffset: event.nativeEvent.contentOffset.y
        });
      };
    
    handleScrollTo = p => {
    if (this.scrollViewRef) {
        this.scrollViewRef.scrollTo(p);
    }
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
                this.setState({ activeRowKey: this.props.id, activeImage: this.props.dishesImageUrl });
            },      
            right: [
                {   
                    onPress: () => {
                        const editRow = this.state.activeRowKey;  
                        const editImage = this.state.activeImage;    
                        this.model(editRow, editImage);
                    },
                    text: 'Edit', 
                    // type: 'edit' 
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
                    scrollTo={this.handleScrollTo}
                    scrollOffset={this.state.scrollOffset}
                    scrollOffsetMax={400 - 300} // content height - ScrollView height
                    style={styles.bottomModal}
                    >
                    <View style={styles.container}>
                        <View style={styles.modelContainer}>
                            <Text style={styles.subtitleContainer}>
                                Dishes Name {'\n'}
                            </Text>
                            <Input
                                editable = {false}
                                placeholder="Name"
                                onChangeText={dishesName => this.setState({ dishesName })}
                                value={this.state.dishesName}
                            />   
                        </View>

                        <View style={styles.modelContainer}>
                            <Text style={styles.subtitleContainer}>
                                Dishes Description {'\n'}
                            </Text>
                            <Input
                                onChangeText={dishesDescription => this.setState({ dishesDescription })}
                                value={this.state.dishesDescription}
                            /> 
                        </View>

                        <View style={styles.modelContainer}>
                            <Text style={styles.subtitleContainer}>
                                Dishes Ingredients {'\n'}
                            </Text>
                            <Input
                                onChangeText={dishesIngredients => this.setState({ dishesIngredients })}
                                value={this.state.dishesIngredients}
                            />  
                        </View>

                        <View style={styles.modelContainer}>
                            <Text style={styles.subtitleContainer}>
                                Dishes Price {'\n'}
                            </Text>
                            <Input
                                onChangeText={dishesPrice => this.setState({ dishesPrice })}
                                value={this.state.dishesPrice}
                            /> 
                        </View>

                        <Text style={styles.errorTextStyle}>{this.state.error}</Text>
        
                        <View style={{ marginHorizontal: 20}}>
                            {this.renderButton()}
                        </View>
                    </View>
                </Modal>
            )
        } else {
            return (
            <Swipeout {...swipeSettings}>
                <ScrollView>
                    <View style={styles.columeContainer}>
                        <View style={styles.rowContainer}>
                            <Image
                                source={{uri: this.props.dishesImageUrl}}
                                style={styles.imageContainer}
                            />

                            <View style={styles.textContainer}>
                                <Text style={styles.titleContainer}>{this.props.dishesName}</Text>
                                <Text style={styles.descriptionContainer}>{this.props.dishesDescription}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Swipeout>
            );
        }
    }
}

export default MenuEditList;