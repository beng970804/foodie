import React from 'react'
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, StatusBar } from 'react-native'
import { fonts, colors } from '../theme'
import Button from '../components/Button'
import Input from '../components/Input'
import Spinner from '../components/Spinner'
import firebase, { firestore } from 'react-native-firebase'

class SignUp extends React.Component {
  state = {username: '', email: '', password: '',password2: '', error: '', loading: false }

  handleSignUp = () => {
    const {username, email, password, password2 } = this.state;

    this.setState({error: '', loading: true});

    this.ref = firebase.firestore().collection('users');

    if (!username || !email || !password || !password2){
      return this.setState({error: 'Please fill in all the fields.', loading: false});
    }
    else if (password != password2){
      return this.setState({error: 'Please enter the same password.', loading: false});
    }
    return(
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(this.onSignUpSuccess.bind(this))
      .catch(this.onSignUpFail.bind(this))
    );
  }

  renderButton() {
    if (this.state.loading){
      return(
        <Spinner size="small"/>
      )
    }
    return(
      <Button onPress={this.handleSignUp.bind(this)}>
          Sign Up
      </Button>
    );
  }

  componentWillUnmount() {
    this.isSuccussful = true;
    this.isFailed = true;
  }

  onSignUpSuccess() {
    let uid = firebase.auth().currentUser.uid;
    this.ref.add({
      username : this.state.username,
      email : this.state.email,
      uid : uid
    });

    !this.isSuccussful && this.setState({
      username: '',
      email: '',
      password: '',
      password2: '',
      loading: false,
      error: ''
    });

    this.props.navigator.push({
      component: Main
    });
  }

  onSignUpFail() {
    !this.isFailed && this.setState({error: 'Sign Up Failed', loading:false});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.heading}>
          <Image
            source={require('../assets/shape.png')}
            style={styles.headingImage}
            resizeMode="contain"
          />
        </View>
        
        <Text style={[styles.greeting]}>
          Welcome to Foodie,
        </Text>

        <Text style={[styles.greeting2]}>
          sign up to continue
        </Text>

        <View style={styles.inputContainer}>
          <Input
            placeholder="UserName"
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
          />
          <Input
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <Input
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            secureTextEntry
          />
          <Input
            placeholder="Confirm Password"
            onChangeText={password2 => this.setState({ password2 })}
            value={this.state.password2}
            secureTextEntry
          />
        </View>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>
          
        {this.renderButton()}

        <Button styleButton={styles.loginStyle} onPress={() => this.props.navigation.navigate('Login')}>
          Have an account? Sign In
        </Button>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row'
  },
  headingImage: {
    width: 38,
    height: 38
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF'
  },
  greeting: {
    marginTop: 20,
    fontSize: 24,
    fontFamily: fonts.light
  },
  greeting2: {
    color: '#666',
    fontSize: 24,
    marginTop: 5,
    fontFamily: fonts.light
  },
  errorTextStyle: {
    color: '#E64A19',
    paddingTop: 3,
    paddingBottom: 3
  },
  inputContainer: {
    marginTop: 20
  },
  loginStyle: {
    color: '#F5F5F5',
    fontFamily: fonts.light,
    fontSize: 12,
    letterSpacing: 0.5
  }
})

export default SignUp;