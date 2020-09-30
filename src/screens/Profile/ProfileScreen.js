import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGrad from '../../components/LinearGrad';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Feather';
import {Card} from 'react-native-shadow-cards';
import auth from '@react-native-firebase/auth';
import {RNToasty} from 'react-native-toasty';
export class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      displayName: '',
      btnLoading: false,
      phoneNumber: '',
      emailVerified: false,
      phoneVerified: false,
    };
  }

  getUserData = () => {
    const {phoneNumber, displayName, photoURL} = auth().currentUser;
    this.setState({
      phoneNumber,
      displayName,
      photoURL,
    });
    if (phoneNumber !== null) {
      this.setState({phoneVerified: true});
    }
    if (phoneNumber == null) {
      this.props.navigation.navigate('PhoneVerification');
    }
  };
  componentDidMount() {
    this.getUserData();
    const {emailVerified} = auth().currentUser;

    if (emailVerified) {
      this.setState({
        emailVerified: true,
      });
    }
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getUserData();
    });
  }

  signOutUser = () => {
    this.setState({btnLoading: true});
    auth()
      .signOut()
      .then(() => {
        setTimeout(() => {
          RNToasty.Show({
            title: 'Logged Out Successfully',
          });
          this.setState({
            btnLoading: false,
            displayName: '',
            phoneNumber: '',
          });
        }, 500);
      });
  };

  getInitials = (string) => {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  render() {
    var {displayName, photoURL} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.profileUI}>
          <View
            style={{
              height: hp('15%'),
              width: hp('15%'),
              borderRadius: 100,
              backgroundColor: '#fbfbfb',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {photoURL === null ? (
              displayName !== null && (
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    color: '#EC942A',
                    fontSize: hp('3%'),
                  }}>
                  {this.getInitials(displayName)}
                </Text>
              )
            ) : (
              <FastImage
                source={{uri: photoURL}}
                style={{height: hp('15%'), width: hp('15%'), borderRadius: 100}}
              />
            )}
          </View>
          {this.state.phoneVerified ? (
            <View
              style={{
                backgroundColor: '#fbfbfb',
                marginTop: hp('-2%'),
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <IonIcons
                name="md-checkmark-circle"
                size={16}
                color="#EC942A"
                style={{paddingLeft: wp('1%')}}
              />
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  color: '#EC942A',
                  paddingHorizontal: wp('1%'),
                  paddingVertical: hp('0.2%'),
                }}>
                Verified
              </Text>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: '#fbfbfb',
                marginTop: hp('-2%'),
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Entypo
                name="circle-with-cross"
                size={16}
                color="#EC942A"
                style={{paddingLeft: wp('1%')}}
              />

              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  color: '#EC942A',
                  paddingHorizontal: wp('1%'),
                  paddingVertical: hp('0.2%'),
                }}>
                Not Verified
              </Text>
            </View>
          )}
          {/* {!this.state.emailVerified && (
            <Icon
              name="edit"
              size={25}
              color="#fbfbfb"
              onPress={() =>
                this.props.navigation.navigate('AccountVerify', {
                  emailVerified: this.state.emailVerified,
                  phoneVerified: this.state.phoneVerified,
                })
              }
              style={{
                paddingLeft: wp('50%'),
                paddingBottom: hp('8%'),
                position: 'absolute',
              }}
            />
          )} */}

          <Text
            style={{
              fontSize: hp('3.5%'),
              fontFamily: 'Lato-Black',
              marginTop: hp('1%'),
              marginBottom: hp('0.5%'),
              color: '#fbfbfb',
            }}>
            {this.state.displayName}
          </Text>
          <Text
            style={{
              marginBottom: hp('6%'),
              color: '#fbfbfb',
              fontSize: hp('2%'),
              fontFamily: 'Lato-Bold',
            }}>
            {this.state.phoneNumber}
          </Text>
        </View>
        <Card
          elevation={2}
          cornerRadius={20}
          style={{
            paddingHorizontal: wp('5%'),
            paddingVertical: hp('2%'),
            marginHorizontal: wp('3%'),
            position: 'absolute',
            marginVertical: hp('34%'),
            minHeight: hp('25%'),
            width: wp('80%'),
            ...(Platform.OS === 'ios' && {marginTop: hp('38%')}),
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('ChangePassword');
            }}>
            <LinearGrad
              width={{width: wp('70%')}}
              animating={false}
              activityStyles={{position: 'absolute'}}
              text="Settings"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.signOutUser}>
            <LinearGrad
              width={{width: wp('70%')}}
              animating={this.state.btnLoading}
              activityStyles={{position: 'absolute', paddingLeft: wp('25%')}}
              text="Logout"
            />
          </TouchableOpacity>
        </Card>
      </SafeAreaView>
    );
  }
}
export default ProfileScreen;
var styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  profileUI: {
    width: wp('100%'),
    paddingTop: hp('7%'),
    backgroundColor: '#EC942A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
