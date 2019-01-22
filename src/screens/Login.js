import React from 'react';
import { StyleSheet, Text, View, Image, Alert, Keyboard} from 'react-native';
import firebase, { firestore } from 'react-native-firebase';
import ButtonComponent, { CircleButton, RoundButton, RectangleButton } from 'react-native-button-component';

import { fonts, colors } from '../theme';
import Input from '../components/Input';
import Spinner from '../components/Spinner';

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row'
  },
  headingImage: {
    width: 45,
    height: 45
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
    fontFamily: fonts.bold,
    color: colors.primary,
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
  }
})

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLoginFail = this.onLoginFail.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }
  state = { email: '', password: '', error: '', loading: false, currentUser: null}

  handleLogin = () => {
    Keyboard.dismiss();
    const { email, password } = this.state;
    this.setState({error: '', loading: true});

    if (!email || !password){
      return this.setState({error: 'Please fill in both fields.', loading: false});
    }
    return(
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.onLoginSuccess())
      .catch(() => this.onLoginFail())
    );
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
        text="Sign In"
        type="primary"
        shape="round"
        backgroundColors={['#ff1493', '#ff72be']}
        gradientStart={{ x: 0.5, y: 1 }}
        gradientEnd={{ x: 1, y: 1 }}
        height={65}
        onPress={() => this.handleLogin()}
      >
      </ButtonComponent>
    );
  }

  onLoginSuccess() {
    let uid = firebase.auth().currentUser.uid;
    this.ref = firebase.firestore().collection('users').doc(uid);
    var query = this.ref.get()
    query.then((doc) => {
      if (doc.exists) {
        const value = doc.data().userType;
        if (value == "Restaurant Owner") {
          return this.props.navigation.navigate('ManageMenu')
        } else if (value == "Customer") {
          return this.props.navigation.navigate('Restaurant')
        } else {
          return this.props.navigation.navigate('ManageRestaurant')
        }
      } else {
        console.log('No such doc exist')
      }
    })
    .catch((error) => console.log(error))

    !this.isSuccussful && this.setState({
      email: '',
      password: '',
      loading: false,
      error: ''
    });

    Alert.alert(
      'Login successfully'
    )
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

        <ButtonComponent
          buttonStyle={{marginTop: 15}}
          text="Don't have an account? Sign Up"
          type="primary"
          shape="round"
          backgroundColors={['#ff1493', '#ff72be']}
          gradientStart={{ x: 0.5, y: 1 }}
          gradientEnd={{ x: 1, y: 1 }}
          height={65}
          onPress={() => this.props.navigation.navigate('SignUp')}
        >
        </ButtonComponent>

      </View>
    )
  }
}

export default Login;