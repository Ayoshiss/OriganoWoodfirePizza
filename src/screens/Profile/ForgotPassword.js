import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import InputTextField from '../../components/profile/InputTextField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {RNToasty} from 'react-native-toasty';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errorMessage: null,
      isLoading: false,
    };
  }

  handleEmailSubmit = () => {
    const {email} = this.state;
    this.setState({isLoading: true});
    if (email === '') {
      this.setState({
        errorMessage: 'Please enter your registered email.',
        isLoading: false,
      });
      return;
    }
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        this.setState({
          isLoading: false,
        });
        RNToasty.Show({
          title: 'Password Reset Email Sent.',
        });
        this.props.navigation.goBack();
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          this.setState({
            errorMessage: 'User Not Found.Please Try Again',
            isLoading: false,
          });
        }
        if (error.code === 'auth/invalid-email') {
          this.setState({
            isLoading: false,
            errorMessage: 'Invalid Email.',
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
            {/* <Image
              source={require('../../asset/origanologo.jpg')}
              style={{height: hp('20%'), width: wp('70%')}}
            /> */}
            <View style={styles.back}>
              <MaterialIcons
                name="arrow-back"
                color="white"
                size={35}
                onPress={() => this.props.navigation.goBack()}
              />
            </View>
            <Text style={styles.loginText}>Password Reset</Text>
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
              icon="email-outline"
              placeholderText="Registered Email"
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

            <TouchableOpacity onPress={this.handleEmailSubmit}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#F47621', '#F89919']}
                style={styles.button}>
                <Text style={styles.textSignup}>Email Me</Text>
                <ActivityIndicator
                  animating={this.state.isLoading}
                  size="small"
                  color="white"
                  style={{position: 'absolute', paddingLeft: wp('25%')}}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Card>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
export default ForgotPassword;

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
    fontWeight: 'bold',
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
    color: 'red',
    fontSize: hp('2%'),
    textAlign: 'center',
  },

  textSignup: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('80%'),
    alignSelf: 'center',
    paddingVertical: hp('1.6%'),
    marginVertical: hp('1.5%'),
    borderRadius: 100,
  },
});
