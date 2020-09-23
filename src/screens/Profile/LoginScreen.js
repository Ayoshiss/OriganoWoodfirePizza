import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  StatusBar,
  ScrollView,
} from 'react-native';
import {Card } from 'react-native-shadow-cards';
import InputTextField from '../../components/profile/InputTextField';
import LinearGrad from '../../components/LinearGrad';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';
import {RNToasty} from 'react-native-toasty';
import Icon from 'react-native-vector-icons/FontAwesome';

export class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
      isLoading: false,
      isFbLoading: false,
      isGoogleLoading: false,
    };
  }
  componentDidMount() {
    GoogleSignin.configure({
      webClientId:
        '180464438307-6vfj1a40qklt9qaf0pvr4p5csg22k6ej.apps.googleusercontent.com',

      forceCodeForRefreshToken: true,
    });
  }
  handleLogin = () => {
    Keyboard.dismiss();
    this.setState({isLoading: true});
    const {email, password} = this.state;
    if (email === '') {
      this.setState({
        errorMessage: 'Please enter your email.',
        isLoading: false,
      });
      return;
    }
    if (password === '') {
      this.setState({
        errorMessage: 'Please enter your password.',
        isLoading: false,
      });
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        RNToasty.Show({
          title: 'Logged In',
        });
        this.setState({
          email: '',
          password: '',
          errorMessage: null,
          isLoading: false,
        });
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password') {
          this.setState({
            errorMessage: 'Incorrect Password.Please Try Again.',
          });
        }
        if (error.code === 'auth/invalid-email') {
          this.setState({
            errorMessage: 'Invalid Email.Please provide valid email address',
          });
        }
        if (error.code === 'auth/user-not-found') {
          this.setState({
            errorMessage: 'User does not exist.Please Register.',
          });
        }
        console.log(error);

        this.setState({isLoading: false});
      });
  };
  onFacebookButtonPress = async () => {
    this.setState({isFbLoading: true});
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    return auth()
      .signInWithCredential(facebookCredential)
      .then(() => {
        RNToasty.Show({
          title: 'Logged in with Facebook',
        });
        this.setState({isFbLoading: false});
      })
      .catch((error) => {
        if (error.code == 'auth/account-exists-with-different-credential') {
          this.setState({
            errorMessage:
              `It seems you've logged in with different provider. Please login with the correct provider`,
            isFbLoading: false,
          });
        } else {
          this.setState({
            errorMessage: 'Login with facebook failed. Please Try Again.',
            isFbLoading: false,
          });
        }
      });
  };

  onGoogleButtonPress = async () => {
    this.setState({isGoogleLoading: true});
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth()
      .signInWithCredential(googleCredential)
      .then(() => {
        RNToasty.Show({
          title: 'Logged in with Gmail',
        });
        this.setState({isGoogleLoading: false});
      })
      .catch((error) => {
        if (error.code == 'auth/account-exists-with-different-credential') {
          this.setState({
            errorMessage:
              `It seems you've logged in with different provider. Please login with the correct provider`,
            isGoogleLoading: false,
          });
        } else {
          this.setState({
            errorMessage: 'Login with google failed. Please Try Again.',
            isGoogleLoading: false,
          });
        }
      });
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View style={styles.loginTextView}>
            <Text style={styles.loginText}>Login</Text>
          </View>
          <Card
            elevation={2}
            cornerRadius={20}
            style={styles.cardView}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: hp('4%'),
              }}>
              {this.state.errorMessage && (
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    color: 'red',
                    fontSize: hp('2%'),
                    textAlign: 'center',
                  }}>
                  {this.state.errorMessage}
                </Text>
              )}
            </View>

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
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.navigate('ForgotPassword')}>
              <Text
                style={{
                  textAlign: 'right',
                  fontFamily: 'Lato-Regular',
                  color: '#EC942A',
                }}>
                Forgot Password?
              </Text>
            </TouchableWithoutFeedback>

            <TouchableOpacity onPress={this.handleLogin}>
              <LinearGrad
                text="Login"
                animating={this.state.isLoading}
                width={{width: wp('80%')}}
                activityStyles={{position: 'absolute', paddingLeft: wp('25%')}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onFacebookButtonPress}
              style={[
                styles.button,
                {
                  backgroundColor: '#3b5998',
                  paddingVertical: hp('2%'),
                },
              ]}>
              <Icon
                name="facebook-f"
                size={22}
                color="white"
                style={{paddingHorizontal: wp('3%')}}
              />
              <Text style={styles.socialButtonText}>Sign In With Facebook</Text>
              <ActivityIndicator
                animating={this.state.isFbLoading}
                size="small"
                color="white"
                style={{position: 'absolute', paddingLeft: wp('55%')}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onGoogleButtonPress}
              style={[
                styles.button,
                {
                  backgroundColor: '#db3236',
                  paddingRight: wp('2%'),
                  paddingVertical: hp('2%'),
                },
              ]}>
              <Icon
                name="google"
                size={22}
                color="white"
                style={{paddingHorizontal: wp('3%')}}
              />
              <Text style={styles.socialButtonText}>Sign In With Google</Text>
              <ActivityIndicator
                animating={this.state.isGoogleLoading}
                size="small"
                color="white"
                style={{position: 'absolute', paddingLeft: wp('55%')}}
              />
            </TouchableOpacity>


          </Card>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
              position: 'absolute',
              marginTop: hp('80%'),
              // marginBottom: hp('6%'),
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                fontSize: hp('2%'),
                color: '#ABB4BD',
                textAlign: 'center',
              }}>
              Don't have an account yet?
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Signup');
              }}>
              <Text style={{color: '#EC942A',fontSize: hp("2%"), fontFamily: 'Lato-Regular'}}>
                {' '}
                Register Now
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
export default LoginScreen;
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('25%'),
    backgroundColor: '#EC942A',
  },
  loginText: {
    fontFamily: 'Lato-Black',
    fontSize: hp('5%'),
    color: '#fbfbfb',
  },
  cardView: {

    minHeight: hp('50%'),
    width: wp('90%'),
    alignSelf: 'center',
    position: 'absolute',
    marginTop: hp('20%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('80%'),
    paddingVertical: hp('1.6%'),
    marginVertical: hp('1.5%'),
    borderRadius: 100,
  },
  socialButtonText: {
    fontFamily: 'Lato-Black',
    color: '#FBFBFB',
    fontSize: hp('2%'),
  },
});
