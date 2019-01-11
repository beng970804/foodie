import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableHighlight, StyleSheet, Alert} from 'react-native';
import { Button } from 'react-native-elements';

import Swipeout from 'react-native-swipeout';
import firebase, { firestore } from 'react-native-firebase';
import Modal from 'react-native-modal';
import { fonts, colors } from '../../theme';
import Spinner from '../Spinner';
import Input from '../Input';

const {height, width} = Dimensions.get('window')

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
  marginHorizontal: 10
},
container: {
  height: 600,
  backgroundColor: "#FFFFFF",
  alignItems: "center",
  justifyContent: "center"
},
inputContainer: {
  marginTop: 10,
  justifyContent: 'center',
  paddingHorizontal: 15,
}  
})

class RestaurantCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRowKey: null,
      activeImage: null,
      isModalVisible: false,
      isBookingVisible: false,
      loading: false,
      restaurantName: '',
      restaurantDescription: '',
      restaurantAddress: '',
      restaurantArea: '',
      restaurantEmail: '',
      restaurantPhone: '',
      restaurantState: '',
      restaurantType: '',
      restaurantZipCode: '',
    };
    this.ref = firebase.firestore().collection('restaurants');
    this.ref2 = firebase.firestore().collection('reservation');
    this.model = this.model.bind(this);  
    this.openModel = this.openModel.bind(this);
    this.navigateBooking = this.navigateBooking.bind(this);
    this.confirmation = this.confirmation.bind(this);
    // this.makeBooking = this.makeBooking.bind(this);
    // this.bookedFailed = this.bookedFailed.bind(this);
    this.bookedSuccessful = this.bookedSuccessful.bind(this);
  }

model(activeRow, activeImage) {
  this.ref.doc(activeRow)
  .get()
  .then((doc) => {
    const { 
      restaurantName,
      restaurantDescription,
      restaurantAddress,
      restaurantArea,
      restaurantEmail,
      restaurantPhone,
      restaurantState,
      restaurantType,
      restaurantZipCode,
     } = doc.data();
    this.setState({
      restaurantName: restaurantName, 
      restaurantDescription: restaurantDescription,
      restaurantAddress: restaurantAddress,
      restaurantArea: restaurantArea,
      restaurantEmail: restaurantEmail,
      restaurantPhone: restaurantPhone,
      restaurantState: restaurantState,
      restaurantType: restaurantType,
      restaurantZipCode: restaurantZipCode,
    })
    this.openModel();
  })
  .catch((error) => console.log(error));
}

handleOnScroll = event => {
  this.setState({
    scrollOffset: event.nativeEvent.contentOffset.y
  });
};

// handleScrollTo = p => {
// if (this.scrollViewRef) {
//   this.scrollViewRef.scrollTo(p);
// }
// };

openModel() {
  this.setState({
    isModalVisible: !this.state.isModalVisible 
  })
}

navigateBooking = () => {
  // this.setState({isBookingVisible: true})
  // return(
  //   <Modal 
  //     isVisible={this.state.isBookingVisible}
  //     onSwipe={() => this.setState({ isBookingVisible: false })}
  //     swipeDirection="down"
  //     // scrollTo={this.handleScrollTo}
  //     scrollOffset={this.state.scrollOffset}
  //     scrollOffsetMax={400 - 300} // content height - ScrollView height
  //     style={styles.bottomModal}>
    
  //   </Modal>
  // )
  Alert.alert(
    'Confirmation',
    'Do you confirm to make the reservation on tonight 8pm?',
    [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'Confirm', onPress: () => this.confirmation()},
    ],
    { cancelable: false }
  )
}

confirmation() {
  let userEmail = firebase.auth().currentUser.email;
  this.ref2.add({
    customerEmail: userEmail,
    restaurantEmail: this.state.restaurantEmail
  })
  .then(() => this.bookedSuccessful())
  .catch((error) => console.log(error))
}

//not working but successfully save to database
bookedSuccessful() {
  Alert.alert(
    'Successful',
    'You had make the reservation successfully',
    { cancelable: false }
  )
}

// bookedFailed() {
//   Alert.alert(
//     'Failed',
//     'The system is unable to proceed with the reservation',
//     { cancelable: false }
//   )
// }

render() {
  // return (
    //version1
      // <View>
      //   <TouchableHighlight onPress={this.props.carouselPressed} style={{width: width - 40, height: 200, marginTop: 20}}>
      //     <Image style={{flex: 1, height: null, width: null, resizeMode: 'cover',
      //     borderRadius: 5, borderWidth: 1, borderColor: '#dddddd'}}
      //     source={this.props.carouselImage}/>
      //   </TouchableHighlight>
      // </View>
  // );

    //version2
  const swipeSettings = {
    autoClose: true,
    backgroundColor: '#FFFFFF',
    onClose: (secId, rowId, direction) => {
        if(this.state.activeRowKey != null) {
            this.setState({ activeRowKey: null, activeImage: null });
        } 
    },          
    onOpen: (secId, rowId, direction) => {
        this.setState({ activeRowKey: this.props.id, activeImage: this.props.restaurantImageUrl });
    },      
    right: [
        {   
            onPress: () => {
                const activeRow = this.state.activeRowKey;  
                const activeImage = this.state.activeImage;    
                this.model(activeRow, activeImage);
            },
            text: 'View', 
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
              // scrollTo={this.handleScrollTo}
              scrollOffset={this.state.scrollOffset}
              scrollOffsetMax={400 - 300} // content height - ScrollView height
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
                    placeholder="Name"
                    onChangeText={restaurantName => this.setState({ restaurantName })}
                    value={this.state.restaurantName}
                  />
                  <Input
                    editable = {false}
                    placeholder="Address"
                    onChangeText={restaurantAddress => this.setState({ restaurantAddress })}
                    value={this.state.restaurantAddress}
                  />
                  <Input
                    editable = {false}
                    placeholder="Area"
                    onChangeText={restaurantArea => this.setState({ restaurantArea })}
                    value={this.state.restaurantArea}
                  />
                  <Input
                    editable = {false}
                    placeholder="Zip Code"
                    onChangeText={restaurantZipCode => this.setState({ restaurantZipCode })}
                    value={this.state.restaurantZipCode}
                  />
                  <Input
                    editable = {false}
                    placeholder="State"
                    onChangeText={restaurantState => this.setState({ restaurantState })}
                    value={this.state.restaurantState}
                  />
                  <Input
                    editable = {false}
                    placeholder="Phone Number"
                    onChangeText={restaurantPhone => this.setState({ restaurantPhone })}
                    value={this.state.restaurantPhone}
                  />
                  <Input
                    editable = {false}
                    placeholder="Type"
                    onChangeText={restaurantType => this.setState({ restaurantType })}
                    value={this.state.restaurantType}
                  />
                  <Input
                    editable = {false}
                    placeholder="Description"
                    onChangeText={restaurantDescription => this.setState({ restaurantDescription })}
                    value={this.state.restaurantDescription}
                  />
                  <Input
                    editable = {false}
                    placeholder="Email"
                    onChangeText={restaurantEmail => this.setState({ restaurantEmail })}
                    value={this.state.restaurantEmail}
                  />
                </View>

                <Button 
                  title = "Reserve Place"
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
                  onPress={() => this.navigateBooking()}
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
                      source={{uri: this.props.restaurantImageUrl}}
                      style={styles.imageContainer}
                  />

                  <View style={styles.textContainer}>
                      <Text style={styles.titleContainer}>{this.props.restaurantName}</Text>
                      <Text style={styles.subtitleContainer}>{this.props.restaurantType}</Text>
                  </View>
              </View>
          </View>
      </Swipeout>
      );
    }
  }
}

export default RestaurantCarousel;
