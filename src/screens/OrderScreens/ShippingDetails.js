import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import InputTextField from '../../components/profile/InputTextField';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Octicons';
import LinearGrad from '../../components/LinearGrad';
import {RNToasty} from 'react-native-toasty';
import DatePicker from 'react-native-date-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
class ShippingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      isLoading: false,
      specialInstruction: '',
      chosenDate: new Date(),
      totalPrice: props.route.params.totalPrice,
      deliveryCharge: props.route.params.deliveryCharge,
      preferenceType: props.route.params.preferenceType,
      preferenceData: props.route.params.preferenceData,
      discount: props.route.params.discount,
    };
  }
  handleProceed = () => {
    const {dataCart} = this.props.route.params;
    const {chosenDate, totalPrice, deliveryCharge} = this.state;
    const date1 = chosenDate;
    const date = chosenDate.toString();
    let splitDate = date.split(' ');
    let splitTime = splitDate[4].split(':');
    let splitHour = parseInt(splitTime[0]);
    let splitMinute = parseInt(splitTime[1]);
    var a = 0;
    if (splitHour >= 16 && splitHour <= 21) {
      a = 1;
    } else {
      a = 0;
    }
    const newDate = new Date();
    if (chosenDate < newDate) {
      RNToasty.Show({
        title: 'Past Date is Selected',
      });
    } else if (date1.getDay() == 1) {
      alert('We are closed on Mondays');
    } else if (a == 0) {
      alert('Please place your order between 4pm-10pm');
    } else {
      this.props.navigation.navigate('Checkout', {
        dataCart,
        address: this.state.preferenceData,
        specialInstruction: this.state.specialInstruction,
        date,
        orderType: this.state.preferenceType,
        totalPrice,
        deliveryCharge,
        discount: this.state.discount,
      });
    }
  };
  render() {
    const {preferenceType} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#EC942A',
              ...(Platform.OS === 'ios'
                ? {height: hp('25%')}
                : {height: hp('30%')}),
            }}>
            {/* <Image
              source={require('../../asset/origanologo.jpg')}
              style={{height: hp('20%'), width: wp('70%')}}
            /> */}
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
            {preferenceType === 'Delivery' ? (
              <Text style={styles.loginText}>Shipping Details</Text>
            ) : (
              <Text style={styles.loginText}>Pickup Details</Text>
            )}
          </View>
          <Card elevation={2} style={styles.cardView}>
            {preferenceType === 'Delivery' ? (
              <Text style={styles.label}>Shipping Address</Text>
            ) : (
              <Text style={styles.label}>Pickup Store</Text>
            )}
            <Icon
              name="location"
              size={24}
              color="#EC942A"
              style={{
                paddingLeft: wp('4%'),
                position: 'absolute',
                paddingTop: hp('8%'),
              }}
            />
            <View
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'grey',
                flexDirection: 'row',
                height: hp('8%'),
                width: wp('95%'),
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  paddingLeft: wp('7%'),
                  // paddingRight: wp('4%'),
                  paddingVertical: hp('1%'),
                  color: 'grey',
                }}>
                {this.state.preferenceData}
              </Text>
            </View>
            <View style={{marginVertical: hp('2%')}}>
              <Text style={styles.label}>Special Instruction (Optional)</Text>
              <InputTextField
                icon="file-document-edit"
                placeholderText="Special Instruction"
                onChange={(specialInstruction) => {
                  this.setState({specialInstruction});
                }}
                type="default"
                value={this.state.specialInstruction}
                autoCompleteType="off"
              />
            </View>
            <View style={{marginBottom: hp('4%')}}>
              {preferenceType === 'Delivery' ? (
                <Text style={styles.label}>
                  Preferred Delivery Date and Time
                </Text>
              ) : (
                <Text style={styles.label}>Preferred Pickup Date and Time</Text>
              )}
              <DatePicker
                date={this.state.chosenDate}
                onDateChange={(date) => {
                  this.setState({chosenDate: date});
                }}
                minuteInterval={15}
                mode="datetime"
                style={{width: 300, height: 170}}
              />
            </View>
            <View>
              <TouchableOpacity onPress={this.handleProceed}>
                <LinearGrad
                  width={{width: wp('80%')}}
                  animating={false}
                  activityStyles={{position: 'absolute'}}
                  text="Proceed to Checkout"
                />
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
export default ShippingDetails;
var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: hp('100%'),
  },
  loginTextView: {
    height: hp('25%'),
  },
  loginText: {
    fontSize: hp('5%'),
    color: '#FBFBFB',
    fontFamily: 'Lato-Black',
  },
  cardView: {
    height: hp('74%'),
    width: wp('100%'),
    alignSelf: 'center',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1%'),
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
  label: {
    paddingHorizontal: wp('1%'),
    paddingVertical: hp('1%'),
    fontSize: hp('2%'),
    fontFamily: 'Lato-Black',
    color: 'grey',
  },
});
