import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Tile, List, ListItem} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase, { firestore } from 'react-native-firebase';

class ManageMenu extends Component {
  constructor(props) {
    super(props);
    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
    this.onLogoutFail = this.onLogoutFail.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.addDishes = this.addDishes.bind(this);
    this.editDishes = this.editDishes.bind(this);
    this.deleteDishes = this.deleteDishes.bind(this);
    this.addPromotion = this.addPromotion.bind(this);
    this.deletePromotion = this.deletePromotion.bind(this);
  }
  state = { currentUser: null}

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  componentWillUnmount() {
    this.isSuccussful = true;
    this.isFailed = true;
  }

  handleLogout = () => {
    this.setState({error: ''});
    firebase
      .auth()
      .signOut()
      .then(() => this.onLogoutSuccess())
      .catch(() => this.onLogoutFail());
  }

  onLogoutSuccess() {
    !this.isSuccussful && this.setState({
      error: ''
    });
    this.props.navigation.navigate('Login');
  }

  onLogoutFail() {
    !this.isFailed && this.setState({error: 'Sign Out Failed'});
  }

  addDishes() {
    return this.props.navigation.navigate('AddDishes');
  }

  editDishes() {
    return this.props.navigation.navigate('EditDishes');
  }

  deleteDishes() {
    return this.props.navigation.navigate('DeleteDishes');
  }

  addPromotion() {
    return this.props.navigation.navigate('AddPromotion');
  }

  deletePromotion() {
    return this.props.navigation.navigate('DeletePromotion');
  }
  
  render() {
    const { currentUser } = this.state
    return (
      <ScrollView>
        <Tile
          imageSrc={require('../../assets/surface.jpg')}
          featured
          containerStyle = {{height: 240}}
          imageContainerStyle = {{height: 259}}
          // title={`${name.first.toUpperCase()} ${name.last.toUpperCase()}`}
          title="Welcome"
          titleStyle = {{ justifyContent: 'center', fontSize: 40}}
          caption={currentUser && currentUser.email}
          captionStyle = {{fontSize: 20}}
        />  

        <List containerStyle={{paddingHorizontal: 15}}>
          <ListItem
            containerStyle = {{paddingBottom:20, paddingTop: 20}}
            title="Email"
            rightTitle={currentUser && currentUser.email}
            hideChevron 
            />
            <ListItem
            containerStyle = {{paddingRight:35, paddingBottom:15, paddingTop: 15}}
            title="Add Dishes"
            rightIcon={<Ionicons name= "md-add-circle" size={30} color='grey'/>}
            onPress={() => this.addDishes()}
            />
            <ListItem
            containerStyle = {{paddingRight:39, paddingBottom:15, paddingTop: 15}}
            title="Edit Dishes"
            rightIcon={<Ionicons name= "ios-document" size={30} color='grey'/>}
            onPress={() => this.editDishes()}
            />
            <ListItem
            containerStyle = {{paddingRight:39, paddingBottom:15, paddingTop: 15}}
            title="Delete Dishes"
            rightIcon={<Ionicons name= "ios-trash" size={30} color='grey'/>}
            onPress={() => this.deleteDishes()}
            />
            <ListItem
            containerStyle = {{paddingRight:39, paddingBottom:15, paddingTop: 15}}
            title="Add Promotion"
            rightIcon={<Ionicons name= "md-add-circle" size={30} color='grey'/>}
            onPress={() => this.addPromotion()}
            />
            <ListItem
            containerStyle = {{paddingRight:39, paddingBottom:15, paddingTop: 15}}
            title="Delete Promotion"
            rightIcon={<Ionicons name= "ios-trash" size={30} color='grey'/>}
            onPress={() => this.deletePromotion()}
            />
            <ListItem
            containerStyle = {{paddingRight:35, paddingBottom:15, paddingTop: 15}}
            title="Log out"
            rightIcon={<Ionicons name= "md-log-out" size={30} color='grey'/>}
            onPress={() => this.handleLogout()}
            />
        </List>
      </ScrollView>
    );
  }
}

export default ManageMenu;
