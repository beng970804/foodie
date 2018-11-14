import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Tile, List, ListItem} from 'react-native-elements';

import Spinner from '../components/Spinner';
import firebase from 'react-native-firebase';

class Profile extends Component {
  state = { currentUser: null, loading: false }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }
  
  render() {
    const { currentUser } = this.state
    return (
      <ScrollView>
        <Tile
          imageSrc={require('../assets/surface.jpg')}
          featured
          // title={`${name.first.toUpperCase()} ${name.last.toUpperCase()}`}
          title="Welcome"
          caption={currentUser && currentUser.email}
        />  

        <List>
          <ListItem
          title="Email"
          rightTitle={currentUser && currentUser.email}
          hideChevron />
        </List>

      </ScrollView>
    );
  }
}

export default Profile;
