import React from 'react';
import { StyleSheet, Text, View, Image, Alert, Keyboard } from 'react-native';
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

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.onSignUpFail = this.onSignUpFail.bind(this);
    this.onSignUpSuccess = this.onSignUpSuccess.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
  }
  
  state = {username: '', email: '', password: '',password2: '', error: '', loading: false, userType: ''}

  handleSignUp = () => {
    Keyboard.dismiss();
    const {username, email, password, password2} = this.state;

    this.setState({error: '', loading: true});

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
      .then(() => this.checkEmail())
      .catch(() => this.onSignUpFail())
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
          text="Sign Up"
          type="primary"
          shape="round"
          backgroundColors={['#ff1493', '#ff72be']}
          gradientStart={{ x: 0.5, y: 1 }}
          gradientEnd={{ x: 1, y: 1 }}
          height={65}
          onPress={() => this.handleSignUp()}
        >
      </ButtonComponent>
    );
  }

  componentWillUnmount() {
    this.isSuccussful = true;
    this.isFailed = true;
  }

  checkEmail() {
    var resRef = firebase.firestore().collection('restaurants');
    var resEmail = this.state.email;
    var query = resRef.where("restaurantEmail", "==", resEmail)
    query.get()
    .then((doc) => {
      if (doc.empty){
        this.setState({userType: 'Customer'});
        this.onSignUpSuccess();
        return this.props.navigation.navigate('Restaurant')
      } else {
        this.setState({userType: 'Restaurant Owner'})
        this.onSignUpSuccess();
        return this.props.navigation.navigate('ManageMenu')
      }
    })
    .catch((error) => console.log(error))
  }

  onSignUpSuccess() {
    let uid = firebase.auth().currentUser.uid;
    this.ref = firebase.firestore().collection('users').doc(uid);
    this.ref.set({
      userName : this.state.username,
      userEmail : this.state.email,
      userId : uid,
      userType : this.state.userType
    });

    !this.isSuccussful && this.setState({
      username: '',
      email: '',
      password: '',
      password2: '',
      loading: false,
      error: ''
    });

    Alert.alert(
      'Signup Successfully',
      'Welcome to be part of Foodie Family'
  );
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

        <ButtonComponent
          buttonStyle={{marginTop: 15}}
          text="Have an account? Sign In"
          type="primary"
          shape="round"
          backgroundColors={['#ff1493', '#ff72be']}
          gradientStart={{ x: 0.5, y: 1 }}
          gradientEnd={{ x: 1, y: 1 }}
          height={65}
          onPress={() => this.props.navigation.navigate('Login')}
        >
        </ButtonComponent>

      </View>
    )
  }
}

export default SignUp;