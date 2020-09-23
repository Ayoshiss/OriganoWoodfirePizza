import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import CardView from 'react-native-cardview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGrad from '../../components/LinearGrad';
import {RNToasty} from 'react-native-toasty';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
class AccountVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      password: '',
      phone: '',
      errorMessage: null,
      isLoading: false,
      emailVerified: false,
      btnVerifyLoading: false,
    };
  }
  componentDidMount() {
    const {emailVerified, phoneVerified} = this.props.route.params;
    this.setState({
      emailVerified,
      phoneVerified,
    });

    // this.setState({fname: displayName, email});
  }

  verifyEmail = () => {
    this.setState({btnVerifyLoading: true});
    var user = auth().currentUser;
    // var actionCodeSettings = {
    //   url:
    //     'https://origanofirewood.firebaseapp.com/?email=' +
    //     auth().currentUser.email,
    //   // iOS: {
    //   //   bundleId: 'com.example.ios',
    //   // },
    //   android: {
    //     packageName: 'com.origano',
    //     installApp: true,
    //     // minimumVersion: '12',
    //   },
    //   handleCodeInApp: true,
    //   // When multiple custom dynamic link domains are defined, specify which
    //   // one to use.
    //   dynamicLinkDomain: 'https://origanofirewood.firebaseapp.com',
    // };
    user
      .sendEmailVerification()
      .then(() => {
        RNToasty.Show({
          title: 'Code Sent.Please Check your email.',
        });
        this.setState({btnVerifyLoading: false});
      })
      .catch((error) => {
        this.setState({
          errorMessage: 'Email has already been sent.Please check your email.',
          btnVerifyLoading: false,
        });
      });
  };
  render() {
    const {emailVerified} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View style={styles.loginTextView}>
            <View style={styles.back}>
              <Ionicons
                name="ios-arrow-round-back"
                color="white"
                size={40}
                onPress={() => this.props.navigation.goBack()}
              />
            </View>
            <Text style={styles.loginText}>Verify Account</Text>
          </View>
          <CardView
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={20}
            style={styles.cardView}>
            <View style={styles.errorMessageView}>
              {this.state.errorMessage && (
                <Text style={styles.errorMessage}>
                  {this.state.errorMessage}
                </Text>
              )}
            </View>
            {!this.state.phoneVerified && (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('PhoneVerification', {
                    previousScreen: 'AccountVerify',
                  })
                }>
                <LinearGrad
                  width={{width: wp('70%')}}
                  animating={this.state.btnVerifyLoading}
                  activityStyles={{
                    position: 'absolute',
                    paddingLeft: wp('35%'),
                  }}
                  text="Verify Phone"
                />
              </TouchableOpacity>
            )}

            {!this.state.emailVerified && (
              <TouchableOpacity onPress={this.verifyEmail}>
                <LinearGrad
                  width={{width: wp('70%')}}
                  animating={this.state.btnVerifyLoading}
                  activityStyles={{
                    position: 'absolute',
                    paddingLeft: wp('35%'),
                  }}
                  text="Verify Email"
                />
              </TouchableOpacity>
            )}
          </CardView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
export default AccountVerify;

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
    minHeight: hp('30%'),
    width: wp('90%'),
    alignSelf: 'center',
    position: 'absolute',
    marginTop: hp('25%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
  },
  back: {
    position: 'absolute',
    paddingBottom: hp('20%'),
    paddingRight: wp('85%'),
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
});
