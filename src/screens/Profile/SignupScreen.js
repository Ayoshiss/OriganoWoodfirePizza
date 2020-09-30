import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import InputTextField from '../../components/profile/InputTextField';
import LinearGrad from '../../components/LinearGrad';
import {RNToasty} from 'react-native-toasty';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: null,
      isLoading: false,
      token: null,
    };
  }
  handleSignUp = () => {
    Keyboard.dismiss();
    this.setState({isLoading: true});
    const {fname, email, password, confirmPassword} = this.state;
    if (fname === '') {
      this.setState({
        errorMessage: 'Please enter your full name.',
        isLoading: false,
      });
      return;
    }

    if (email === '') {
      this.setState({
        errorMessage: 'Please enter your email.',
        isLoading: false,
      });
      return;
    }
    if (password === '' || confirmPassword === '') {
      this.setState({
        errorMessage: 'Please enter your password.',
        isLoading: false,
      });
      return;
    }
    if (password !== confirmPassword) {
      this.setState({
        errorMessage: 'Passwords do not match',
        isLoading: false,
      });
      return;
    }

    auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredentials) => {
        userCredentials.user
          .updateProfile({
            displayName: this.state.fname,
          })
          .then(() => {
            RNToasty.Show({
              title: 'User has been registered.Please Log in.',
            });
            auth()
              .signOut()
              .then(() => {
                this.props.navigation.navigate('Login');
                this.setState({isLoading: false});
              });
          });
        this.setState({isLoading: false});
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          this.setState({
            errorMessage: 'Email is already registered.Please Log In.',
          });
        }
        if (error.code === 'auth/invalid-email') {
          this.setState({
            errorMessage: 'Invalid Email. Please provide valid email address.',
          });
        }
        if (error.code === 'auth/weak-password') {
          this.setState({
            errorMessage: 'Password must be atleast 6 characters',
          });
        }

        this.setState({isLoading: false});
      });
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        
        <View style={styles.loginTextView}>
      
          <Text style={styles.loginText}>Register</Text>
        </View>
        <Card
          elevation={2}
          cornerRadius={20}
          style={styles.cardView}>
          <View style={styles.errorMessageView}>
            {this.state.errorMessage && (
              <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
            )}
          </View>

          <InputTextField
            icon="account-circle-outline"
            placeholderText="Full Name"
            title={'Full Name'}
            onChange={(fname) => {
              this.setState({fname});
            }}
            autoCapitalize="words"
            value={this.state.fname}
            autoCompleteType="off"
          />
          <InputTextField
            icon="email-outline"
            placeholderText="Email"
            title={'Email'}
            style={{marginTop: hp('2%')}}
            onChange={(email) => {
              this.setState({email});
            }}
            autoCapitalize="none"
            autoCompleteType="off"
            type="email-address"
            value={this.state.email}
          />
          <InputTextField
            icon="lock-outline"
            placeholderText="Password"
            style={{marginTop: hp('2%')}}
            title={'Password'}
            isSecure={true}
            autoCapitalize="none"
            onChange={(password) => {
              this.setState({password});
            }}
            value={this.state.password}
          />
          <InputTextField
            icon="lock-outline"
            placeholderText="Confirm Password"
            style={{marginTop: hp('2%')}}
            title={'Confirm Password'}
            isSecure={true}
            autoCapitalize="none"
            onChange={(confirmPassword) => {
              this.setState({confirmPassword});
            }}
            value={this.state.confirmPassword}
          />
          <TouchableOpacity onPress={this.handleSignUp}>
            <LinearGrad
              width={{width: wp('80%')}}
              text="Register"
              animating={this.state.isLoading}
              activityStyles={{position: 'absolute', paddingLeft: wp('25%')}}
            />
          </TouchableOpacity>
        </Card>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
            position: 'absolute',
            marginTop: hp('85%'),
            // marginBottom: hp('6%'),
          }}>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: hp('2%'),
              color: '#ABB4BD',
              textAlign: 'center',
            }}>
            Already Have an Account?
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Login');
            }}>
            <Text style={{color: '#EC942A',fontSize: hp('2%'), fontFamily: 'Lato-Regular'}}>
              {' '}
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    );
  }
}
export default SignupScreen;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('30%'),
    backgroundColor: '#EC942A',
  },
  loginText: {
    fontSize: hp('5%'),
    fontFamily: 'Lato-Black',
    color: '#fbfbfb',
  },
  cardView: {
    minHeight: hp('50%'),
    width: wp('90%'),
    alignSelf: 'center',
    position: 'absolute',
    marginTop: hp('25%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
  },
  errorMessageView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('4%'),
  },
  errorMessage: {
    fontFamily: 'Lato-Regular',
    color: 'red',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
  // backToLoginView: {
  //   flexDirection: 'row',
  //   alignSelf: 'center',
  //   position: 'absolute',
  //   marginTop: hp('80%'),
  // },

  link: {
    color: '#EC942A',
    fontSize: hp('2%'),
    paddingTop: hp('2%'),
  },
  cardView1: {
    height: hp('76%'),
    width: wp('100%'),
    alignSelf: 'center',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1%'),
  },
  label: {
    paddingHorizontal: wp('1%'),
    paddingVertical: hp('0.5%'),
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: 'grey',
  },
});
