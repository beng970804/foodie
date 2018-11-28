import React from 'react'
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import firebase from 'react-native-firebase'

import { fonts, colors } from '../theme'
import Button from '../components/Button'
import Input from '../components/Input'
import Spinner from '../components/Spinner'

class Login extends React.Component {
  state = { email: '', password: '', error: '', loading: false }
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Restaurant' : 'Login')
    })
    SplashScreen.hide()
  }

  handleLogin = () => {
    const { email, password } = this.state;

    this.setState({error: '', loading: true});

    if (!email || !password){
      return this.setState({error: 'Please fill in both fields.', loading: false});
    }
    return(
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(this.onLoginFail.bind(this))
    );
  }

  renderButton() {
    if (this.state.loading){
      return(
        <Spinner size="small"/>
      )
    }
    return(
      <Button onPress={this.handleLogin.bind(this)}>
          Sign In
      </Button>
    );
  }

  onLoginSuccess() {
    !this.isSuccussful && this.setState({
      email: '',
      password: '',
      loading: false,
      error: ''
    });
    this.props.navigation.navigate({
      component: Main
    });
  }

  componentWillUnmount() {
    this.isSuccussful = true;
    this.isFailed = true;
  }

  onLoginFail() {
    !this.isFailed && this.setState({error: 'Authentication Failed', loading:false});
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
          Welcome back,
        </Text>

        <Text style={[styles.greeting2]}>
          sign in to continue
        </Text>

        <View style={styles.inputContainer}>
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
        </View>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>
          
        {this.renderButton()}

        <Button styleButton={styles.signUpStyle} onPress={() => this.props.navigation.navigate('SignUp')}>
          Don't have an account? Sign Up
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
  signUpStyle: {
    color: '#F5F5F5',
    fontFamily: fonts.light,
    fontSize: 12,
    letterSpacing: 0.5
  }
})

export default Login;