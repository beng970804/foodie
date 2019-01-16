import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableHighlight, StyleSheet, Alert} from 'react-native';

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
  height: 650,
  backgroundColor: "#FFFFFF",
  alignItems: "center",
  justifyContent: "center"
},
inputContainer: {
  marginTop: 10,
  justifyContent: 'center',
  paddingHorizontal: 0,
}  
})

class ArchiveList extends Component {
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
    this.ref = firebase.firestore().collection('archive');
    this.model = this.model.bind(this);  
    this.openModel = this.openModel.bind(this);
    this.deleteArchive = this.deleteArchive.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.deleteSuccessful = this.deleteSuccessful.bind(this);
    this.deleteFailed = this.deleteFailed.bind(this); 
    this.sto = firebase.storage();
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

deleteArchive(activeRow, activeImage) {
  this.ref.doc(activeRow)
  .delete()
  .then(() => this.deleteImage(activeImage))
  .catch(() => this.deleteFailed());
}

deleteImage(activeImage) {
  this.sto.refFromURL(activeImage)
  .delete()
  .then(() => this.deleteSuccessful())
  .catch(() => this.deleteFailed());
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
        },
        {   
          onPress: () => {
              const activeRow = this.state.activeRowKey;  
              const activeImage = this.state.activeImage;    
              this.deleteArchive(activeRow, activeImage);
          },
          text: 'Delete', 
          type: 'delete' 
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

export default ArchiveList;
