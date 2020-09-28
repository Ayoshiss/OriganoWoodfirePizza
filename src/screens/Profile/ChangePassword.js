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
import {Card} from 'react-native-shadow-cards';
import InputTextField from '../../components/profile/InputTextField';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGrad from '../../components/LinearGrad';
import {RNToasty} from 'react-native-toasty';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      confirmNewPassword: '',
      currentPassword: '',
      errorMessage: null,
      isUpdating: false,
    };
  }

  reauthenticate = (currentPassword) => {
    var user = auth().currentUser;
    var credential = auth.EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );

    return user.reauthenticateWithCredential(credential);
  };

  handleUpdatePassword = () => {
    this.setState({isUpdating: true});

    const {newPassword, confirmNewPassword} = this.state;
    if (newPassword === confirmNewPassword) {
      this.setState({
        finalPassword: newPassword,
      });
    } else {
      this.setState({
        errorMessage: 'Passwords do not match.Please Try Again.',
        isUpdating: false,
      });
      return;
    }
    Keyboard.dismiss();
    this.reauthenticate(this.state.currentPassword)
      .then(() => {
        var user = auth().currentUser;
        user
          .updatePassword(this.state.finalPassword)
          .then(() => {
            RNToasty.Show({
              title: 'Password Updated',
            });
            this.props.navigation.goBack();
            this.setState({
              isUpdating: false,
            });
          })
          .catch((error) => {
            this.setState({
              errorMessage: error.message,
              isUpdating: false,
            });
          });
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password') {
          this.setState({
            errorMessage: error.message,
            isUpdating: false,
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
            <View style={styles.back}>
              <Ionicons
                name={
                  Platform.OS === 'ios'
                    ? 'arrow-back-outline'
                    : 'ios-arrow-round-back'
                }
                color="white"
                size={Platform.OS === 'ios' ? 35 : 42}
                onPress={() => this.props.navigation.goBack()}
              />
            </View>
            <Text style={styles.loginText}>Change Password</Text>
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
              icon="lock-outline"
              placeholderText="Current Password"
              style={{marginTop: hp('2%')}}
              title={'Password'}
              isSecure={true}
              autoCapitalize="none"
              onChange={(currentPassword) => {
                this.setState({currentPassword});
              }}
              value={this.state.password}
            />
            <InputTextField
              icon="lock-outline"
              placeholderText="New Password"
              style={{marginTop: hp('2%')}}
              title={'Password'}
              isSecure={true}
              autoCapitalize="none"
              onChange={(newPassword) => {
                this.setState({newPassword});
              }}
              value={this.state.password}
            />
            <InputTextField
              icon="lock-outline"
              placeholderText="Confirm Password"
              style={{marginTop: hp('2%')}}
              title={'Password'}
              isSecure={true}
              autoCapitalize="none"
              onChange={(confirmNewPassword) => {
                this.setState({confirmNewPassword});
              }}
              value={this.state.password}
            />

            <TouchableOpacity onPress={this.handleUpdatePassword}>
              <LinearGrad
                width={{width: wp('80%')}}
                animating={this.state.isUpdating}
                activityStyles={{position: 'absolute', paddingLeft: wp('45%')}}
                text="Update Password"
              />
            </TouchableOpacity>
          </Card>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
export default ChangePassword;

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
    fontFamily: 'Lato-Black',
    fontSize: hp('4.5%'),
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
    fontFamily: 'Lato-Regular',
    color: 'red',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
});
