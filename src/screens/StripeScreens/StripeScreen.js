import React, {PureComponent} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Card} from 'react-native-shadow-cards';
import Octicons from 'react-native-vector-icons/Octicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ScreenHeaders from '../../components/ScreenHeaders';
import axios from 'axios';
import stripe from 'tipsi-stripe';
import {RNToasty} from 'react-native-toasty';
stripe.setOptions({
  publishableKey: 'pk_live_mSQZ4vxUO0Ihq5GM1ezHJ6ab00EvOSGhB1',
});

export default class StripeScreen extends PureComponent {
  static title = 'Card Form';

  state = {
    loading: false,
    paymentLoading: false,
    token: null,
    uid: '',
  };

  handleCardPayPress = async () => {
    try {
      this.setState({loading: true, token: null});
      const token = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          // billingAddress: {
          //   name: 'Gunilla Haugeh',
          //   line1: 'Canary Place',
          //   line2: '3',
          //   city: 'Macon',
          //   state: 'Georgia',
          //   country: 'US',
          //   postalCode: '31217',
          //   email: 'ghaugeh0@printfriendly.com',
          // },
        },
      });
      RNToasty.Show({
        title: 'Card has been Verified. You can make payment now',
      });
      this.setState({loading: false, token});
    } catch (error) {
      this.setState({loading: false});
      RNToasty.Show({
        title: 'Something went wrong. Please try again',
      });
    }
  };
  makePayment = () => {
    this.setState({paymentLoading: true});
    const {totalPrice} = this.props.route.params;
    axios({
      method: 'POST',
      url: 'https://origanopayment.web.app/api/stripePayment/',
      data: {
        amount: totalPrice * 100,
        currency: 'aud',
        token: this.state.token,
        recieptEmail: auth().currentUser.email,
      },
    })
      .then((response) => {
        const newDate = new Date();
        var orderId = 'OP-' + newDate.valueOf();
        var paymentType, paymentStatus;
        paymentType = 'Stripe';
        paymentStatus = 'Paid';
        const {
          dataCart,
          address,
          date,
          orderType,
          specialInstruction,
          totalPrice,
          deliveryCharge,
          discount,
        } = this.props.route.params;
        firestore()
          .collection('Orders')
          .doc(orderId)
          .set({
            dataCart,
            address,
            date,
            specialInstruction,
            orderStatus: 'Requested',
            uid: auth().currentUser.uid,
            orderId,
            orderType,
            paymentType,
            paymentStatus,
            totalPrice,
            deliveryCharge,
            discount,
          })
          .then(() => {
            this.props.navigation.navigate('OrderSuccess', {
              docID: orderId,
              orderType,
              previousScreen: 'Checkout',
              dataCart,
            });
            this.setState({
              loading: false,
            });
            RNToasty.Show({title: 'Order Success'});
          });
      })
      .catch((err) => {
        alert(err);
        this.setState({
          loading: false,
          paymentLoading: false,
        });
      });
  };

  render() {
    const {token} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <ScreenHeaders name="Checkout" props={this.props} />
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              textAlign: 'center',
              marginTop: hp('5%'),
              alignSelf: 'center',
              marginHorizontal: wp('5%'),
              fontSize: hp('2.5%'),
            }}>
            {' '}
            Pay with Card
          </Text>
        </View>
        {/* <Text style={styles.instruction}>
          Please, Enter your card details here.
        </Text> */}
        <TouchableOpacity onPress={this.handleCardPayPress}>
          <Card elevation={2} cornerRadius={20} style={styles.cardView}>
            <Octicons
              name="credit-card"
              size={24}
              color="#EC942A"
              style={{paddingRight: wp('5%')}}
            />
            <Text
              style={{
                fontSize: hp('2.5%'),
                fontFamily: 'Lato-Bold',
                color: '#EC942A',
              }}>
              {!token && 'Enter Card Details'}
              {token && 'Re-Enter Card Details'}
            </Text>
          </Card>
        </TouchableOpacity>
        {token && (
          <TouchableOpacity
            onPress={this.makePayment}
            disabled={this.state.paymentLoading}>
            <Card elevation={2} cornerRadius={20} style={styles.cardView}>
              <Octicons
                name="credit-card"
                size={24}
                color="#EC942A"
                style={{paddingRight: wp('5%')}}
              />
              <Text
                style={{
                  fontSize: hp('2.5%'),
                  fontFamily: 'Lato-Bold',
                  color: '#EC942A',
                }}>
                Make Payment
              </Text>
              <ActivityIndicator
                size={18}
                animating={this.state.paymentLoading}
                color="#EC942A"
                style={{position: 'absolute', paddingLeft: wp('60%')}}
              />
            </Card>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    marginVertical: hp('1%'),
    marginHorizontal: wp('5%'),
  },
  cardView: {
    height: hp('7%'),
    width: wp('80%'),
    alignSelf: 'center',
    marginTop: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
});
