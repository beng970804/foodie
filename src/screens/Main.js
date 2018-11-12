import React from 'react'
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, StatusBar } from 'react-native'
import { fonts, colors } from '../theme'
import Button from '../components/Button'
import Input from '../components/Input'
import Spinner from '../components/Spinner'
import firebase from 'react-native-firebase'
import Login from './Login';

export default class Main extends React.Component {
  state = { currentUser: null, loading: false }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  componentWillUnmount() {
    this.isSuccussful = true;
    this.isFailed = true;
  }

  handleLogout = () => {
    this.setState({error: '', loading: true});

    firebase
      .auth()
      .signOut()
      .then(this.onLogoutSuccess.bind(this))
      .catch(this.onLogoutFail.bind(this));
  }

  onLogoutSuccess() {
    !this.isSuccussful && this.setState({
      loading: false,
      error: ''
    });
    this.props.navigator.push({
      component: Login
    });
  }

  onLogoutFail() {
    !this.isFailed && this.setState({error: 'Sign Out Failed', loading:false});
  }

  renderButton() {
    if (this.state.loading){
      return <Spinner size="small"/>
    }
    return(
      <Button onPress={this.handleLogout.bind(this)}>
          Sign Out
      </Button>
    );
  }

  render() {
    const { currentUser } = this.state

    return (
      <View style={styles.container}>
        <Text>
          Hi {currentUser && currentUser.email}!
        </Text>

        {this.renderButton()}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})