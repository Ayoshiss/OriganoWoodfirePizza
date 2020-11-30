import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import UUIDGenerator from 'react-native-uuid-generator';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ScreenHeaders from '../components/ScreenHeaders';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {Card} from 'react-native-shadow-cards';
import {RNToasty} from 'react-native-toasty';
import {ActivityIndicator} from 'react-native-paper';
import WebView from 'react-native-webview';
class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      status: 'Pending',
      isUser: false,
      uid: '',
      isPayPalLoading: false,
      isCODLoading: false,
      orderId: '',
      orderType: '',
      pickupStore: '',
      totalPrice: props.route.params.totalPrice,
      uuid: '',
      paymentType: '',
      paymentStatus: '',
      isDisabled: false,
      Modal,
    };
  }
  componentDidMount() {
    const uid = auth().currentUser.uid;
    this.setState({uid});
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          isUser: true,
        });
      }
    });
    this.generateRandom();
  }
  generateRandom = () => {
    UUIDGenerator.getRandomUUID((uuid) => {
      this.setState({uuid});
    });
  };
  handleOrderSuccess = (type) => {
    this.setState({isDisabled: true});
    const newDate = new Date();
    const orderId = 'OP-' + newDate.valueOf();
    var paymentType, paymentStatus;
    if (type === 'Paypal') {
      this.setState({
        isPayPalLoading: true,
        orderId,
      });
      paymentType = 'Paypal';
      paymentStatus = 'Paid';
    }
    if (type === 'COD') {
      this.setState({
        isCODLoading: true,
        orderId,
      });
      paymentType = 'COD';
      paymentStatus = 'Pending';
    }
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
        uid: this.state.uid,
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
          docId: this.state.orderId,
          orderType,
          previousScreen: 'Checkout',
        });
        this.setState({isPayPalLoading: false, isCODLoading: false});
        RNToasty.Show({title: 'Order Success'});
      });
  };
  handlePaypalCancel = () => {
    RNToasty.Show({title: 'Payment Canceled'});
  };
  handleResponse = (data) => {
    if (data.title === 'success') {
      this.setState({showModal: 'false'});
      RNToasty.Show({title: 'Order Success'});
      this.handleOrderSuccess('Paypal');
    } else if (data.title === 'cancel') {
      this.setState({showModal: 'false'});
      RNToasty.Show({title: 'Payment Canceled'});
    } else {
      return;
    }
  };
  renderIsUser() {
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
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ScreenHeaders name="Checkout" props={this.props} />
          <Modal
            visible={this.state.showModal}
            onRequestClose={() => this.setState({showModal: false})}>
            <WebView
              source={{uri: 'https://origanopayment.web.app/'}}
              onMessage={() => {}}
              onNavigationStateChange={(data) => this.handleResponse(data)}
              injectedJavaScript={`document.getElementById('price').value="${this.state.totalPrice}";document.f1.submit()`}
            />
          </Modal>
          <Text
            style={{
              
              textAlign: 'center',
              marginTop: hp('5%'),
              alignSelf: 'center',
              marginHorizontal: wp('5%'),
              fontSize: hp('2.5%'),
            }}>
            {' '}
            How do you wish to pay?
          </Text>
        </View>
        <TouchableOpacity onPress={() => this.setState({showModal: true})}>
          <Card elevation={2} cornerRadius={20} style={styles.cardView}>
            <MaterialCommunityIcons
              name="credit-card"
              size={24}
              color="#EC942A"
              style={{paddingRight: wp('5%')}}
            />
            <Text
              style={{
                fontSize: hp('2.5%'),
                
                color: '#EC942A',
              }}>
              Pay with PayPal
            </Text>
            <ActivityIndicator
              size={18}
              animating={this.state.isPayPalLoading}
              color="#EC942A"
              style={{position: 'absolute', paddingLeft: wp('60%')}}
            />
          </Card>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('StripeScreen', {
              dataCart,
              address,
              date,
              orderType,
              specialInstruction,
              totalPrice,
              deliveryCharge,
              discount,
            })
          }>
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
               
                color: '#EC942A',
              }}>
              Pay with Card
            </Text>
            <ActivityIndicator
              size={18}
              animating={this.state.isCODLoading}
              color="#EC942A"
              style={{position: 'absolute', paddingLeft: wp('60%')}}
            />
          </Card>
        </TouchableOpacity>
      </View>
    );
  }
  renderNotUser() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ScreenHeaders name="Checkout" props={this.props} />
        </View>
        <View
          style={{
            alignItems: 'center',
            height: hp('70%'),
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              fontWeight: '700',
              marginVertical: hp('2%'),
            }}>
            Oops!Looks like you're not logged in.
          </Text>
          <Text
            style={{
              fontSize: hp('2.5%'),
              fontWeight: '700',
              marginVertical: hp('2%'),
            }}>
            Please Login to continue.
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Profile')}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#F47621', '#F89919']}
              style={styles.button}>
              <Text style={styles.btnText}>LOGIN </Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: hp('2.5%'),
              fontWeight: '700',
              marginVertical: hp('2%'),
            }}>
            Don't have an account yet?
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Profile')}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#F47621', '#F89919']}
              style={styles.button}>
              <Text style={styles.btnText2}>REGISTER</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  render() {
    const {isUser} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        {isUser && this.renderIsUser()}
        {!isUser && this.renderNotUser()}
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
  title: {
    fontSize: hp('3.5%'),
    fontWeight: 'bold',
    color: '#EC942A',
    textAlign: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    marginVertical: hp('2%'),
    borderRadius: 100,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    paddingHorizontal: wp('25%'),
  },
  btnText2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    paddingHorizontal: wp('21%'),
  },
  modalView: {
    height: hp('60%'),
    width: wp('80%'),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
});
export default CheckoutScreen;
