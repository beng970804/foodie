import React, { Component } from 'react';
import { ScrollView, FlatList, Linking, Alert } from 'react-native';
import { Tile, List, ListItem} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase, { firestore } from 'react-native-firebase';

import Login from '../Login'
import { fonts,colors } from '../../theme';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
    this.onLogoutFail = this.onLogoutFail.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.logout = this.logout.bind(this);
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
    Alert.alert(
      'Are you sure?',
      'Do you want to logout?',
      [
        {text: 'Logout', onPress: () => this.logout()},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      ],
      { cancelable: false }
    )
  }

  logout = () => {
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
  
  render() {
    const { currentUser } = this.state
    return (
      <ScrollView>
        <Tile
          imageSrc={require('../../assets/surface.jpg')}
          featured
          containerStyle = {{height: 240}}
          imageContainerStyle = {{height: 259}}
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
            hideChevron />
            <ListItem
            containerStyle = {{paddingRight:42, paddingBottom:8, paddingTop: 8}}
            title="Restaurant suggestion"
            rightIcon={<Ionicons name= "ios-help" size={45} color='grey'/>}
            onPress={() => Linking.openURL('mailto:1151102173@student.mmu.edu.my?subject=Restaurant Suggestion')}
            />
            <ListItem
            containerStyle = {{paddingRight:35, paddingBottom:15, paddingTop: 15}}
            title="Give us feedback"
            rightIcon={<Ionicons name= "md-paper-plane" size={30} color='grey'/>}
            onPress={() => Linking.openURL('mailto:1151102173@student.mmu.edu.my?subject=Feedback on Foodie')}
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

export default Profile;
