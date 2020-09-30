import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import InputTextField from '../../components/profile/InputTextField';
import {RNToasty} from 'react-native-toasty';
import LinearGrad from '../../components/LinearGrad';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import {notificationManager} from '../../NotificationManager';
class PhoneVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      code: '',
      codeInput: '',
      verificationId: '',
      errorMessage: null,
      isLoading: false,
      codeSent: false,
      isVerifying: false,
      credential: null,
      isLoading: true,
      isLoggingOut: false,
      notifyToken: null,
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getNotifyToken();
    });
  }
  getNotifyToken = async () => {
    try {
      const notifyToken = await AsyncStorage.getItem('notifyToken');
      if (notifyToken !== null) {
        this.setState({
          notifyToken,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  signOutUser = () => {
    this.setState({isLoggingOut: true});
    auth()
      .signOut()
      .then(() => {
        setTimeout(() => {
          RNToasty.Show({
            title: 'Logged Out Successfully',
          });
          this.setState({
            isLoggingOut: false,
          });
        }, 1000);
      });
  };

  handleVerification = () => {
    this.setState({isVerifying: true});
    const {verificationId, codeInput, phone} = this.state;
    if (codeInput.length !== 6) {
      this.setState({errorMessage: 'Invalid Code', isVerifying: false});
      return;
    }
    if (codeInput.length === 0) {
      this.setState({
        errorMessage: 'Please provide verification code sent to your phone.',
        isVerifying: false,
      });
      return;
    }
    const {uid, displayName, email} = auth().currentUser;
    const credential = auth.PhoneAuthProvider.credential(
      verificationId,
      codeInput,
    );
    auth()
      .currentUser.linkWithCredential(credential)
      .then(() => {
        RNToasty.Show({title: 'Phone Verification Success'});
        firestore()
          .collection('Users')
          .doc(uid)
          .set({
            uid,
            displayName,
            email,
            phoneNumber: phone,
            notifyToken: this.state.notifyToken,
          })
          .then(() => {
            this.props.navigation.navigate('Profile');
            this.setState({isLoading: false});
          });
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-verification-code') {
          this.setState({
            errorMessage: 'Invalid Code.Please Try Again.',
            isVerifying: false,
          });
        }
        if (error.code === 'auth/credential-already-in-use') {
          this.setState({
            errorMessage:
              'Phone Number already linked to another account.Please provide another phone number.',
            isVerifying: false,
          });
        } else {
          this.setState({
            errorMessage: error.message,
            isVerifying: false,
          });
        }
      });

    this.setState({isLoading: false});
  };

  handleUpdateProfile = () => {
    Keyboard.dismiss();
    this.setState({isLoading: true});
    const {phone} = this.state;
    const {uid, displayName, email} = auth().currentUser;
    if (phone == '') {
      this.setState({errorMessage: 'Please Enter a Valid Phone Number'});
      return;
    }

    auth()
      .verifyPhoneNumber(phone)
      .on(
        'state_changed',
        (phoneAuthSnapshot) => {
          const {verificationId, code} = phoneAuthSnapshot;
          const credential = auth.PhoneAuthProvider.credential(
            verificationId,
            code,
          );
          this.setState({verificationId, code, credential});

          switch (phoneAuthSnapshot.state) {
            case auth.PhoneAuthState.CODE_SENT:
              RNToasty.Show({
                title: 'Code Sent',
              });
              this.setState({codeSent: true, errorMessage: null});
              break;
            case auth.PhoneAuthState.ERROR:
              this.setState({
                errorMessage: 'Some error occured.Please try again later.',
              });

              break;
            case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT:
              break;
            case auth.PhoneAuthState.AUTO_VERIFIED:
              const {credential} = this.state;
              auth()
                .currentUser.linkWithCredential(credential)
                .then(() => {
                  RNToasty.Show({title: 'Verification Success'});
                  firestore()
                    .collection('Users')
                    .doc(uid)
                    .set({
                      uid,
                      displayName,
                      email,
                      phoneNumber: phone,
                      notifyToken: this.state.notifyToken,
                    })
                    .then(() => {
                      this.props.navigation.navigate('Profile');
                      this.setState({isLoading: false});
                    });
                })
                .catch((error) => {
                  error.code === 'auth/credential-already-in-use'
                    ? this.setState({
                        errorMessage:
                          'Phone number is already linked with another account.',
                        isVerifying: false,
                        isLoading: false,
                      })
                    : this.setState({
                        errorMessage:
                          'Something went wrong.Please try again later.',
                        isVerifying: false,
                        isLoading: false,
                      });
                });

              break;
          }
        },
        (error) => {
          if (error.code === 'auth/unknown') {
            this.setState({
              errorMessage: 'Too many attempts.Please try again later.',
              isVerifying: false,
            });
          }
        },
      );
  };
  renderUpdateUI() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View style={styles.loginTextView}>
            <Text style={styles.loginText}>Phone Verification</Text>
          </View>
          <Card elevation={2} cornerRadius={20} style={styles.cardView}>
            <View style={styles.errorMessageView}>
              {this.state.errorMessage && (
                <Text style={styles.errorMessage}>
                  {this.state.errorMessage}
                </Text>
              )}
            </View>
            <InputTextField
              icon="cellphone-iphone"
              placeholderText="Phone Number"
              title={'Phone Number'}
              onChange={(phone) => {
                this.setState({phone});
              }}
              type={'phone-pad'}
              value={this.state.phone}
              autoCompleteType="off"
            />

            <TouchableOpacity onPress={this.handleUpdateProfile}>
              <LinearGrad
                text="Send Code"
                animating={this.state.isLoading}
                width={{width: wp('80%')}}
                activityStyles={{position: 'absolute', paddingLeft: wp('30%')}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.signOutUser}>
              <LinearGrad
                text="Logout"
                animating={this.state.isLoggingOut}
                width={{width: wp('80%')}}
                activityStyles={{position: 'absolute', paddingLeft: wp('30%')}}
              />
            </TouchableOpacity>
          </Card>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  renderCodeField() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View style={styles.loginTextView}>
            <Text style={styles.loginText}>Verification Code</Text>
          </View>
          <Card elevation={2} cornerRadius={20} style={styles.cardView}>
            <View style={styles.errorMessageView}>
              {this.state.errorMessage && (
                <Text style={styles.errorMessage}>
                  {this.state.errorMessage}
                </Text>
              )}
            </View>

            <InputTextField
              icon="account-circle-outline"
              placeholderText="6-Digit Code"
              type="numeric"
              title={'6-Digit Code'}
              onChange={(codeInput) => {
                this.setState({codeInput});
              }}
              autoCapitalize="words"
              value={this.state.codeInput}
              autoCompleteType="off"
            />
            <TouchableOpacity onPress={this.handleVerification}>
              <LinearGrad
                text="Verify"
                animating={this.state.isVerifying}
                width={{width: wp('80%')}}
                activityStyles={{position: 'absolute', paddingLeft: wp('30%')}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({codeSent: false, codeInput: ''});
              }}>
              <LinearGrad
                text="Change Phone Number"
                animating={false}
                width={{width: wp('80%')}}
                activityStyles={{position: 'absolute', paddingLeft: wp('30%')}}
              />
            </TouchableOpacity>
          </Card>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  render() {
    const {codeSent, isLoading} = this.state;
    setTimeout(() => {
      this.setState({isLoading: false});
    }, 3000);
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            animating={this.state.isLoading}
            color="#EC942A"
          />
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          {!codeSent && this.renderUpdateUI()}
          {codeSent && this.renderCodeField()}
        </View>
      );
    }
  }
}

export default PhoneVerification;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('30%'),
    backgroundColor: '#EC942A',
  },
  loginText: {
    fontSize: hp('5%'),
    fontWeight: 'bold',
    color: '#fbfbfb',
  },
  cardView: {
    minHeight: hp('30%'),
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
    color: 'red',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
});
