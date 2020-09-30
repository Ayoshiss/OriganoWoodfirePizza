import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Card} from 'react-native-shadow-cards';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
class OrderSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderedItems: this.props.route.params.dataCart,
      isLoading: false,
      // paymentType: this.props.route.params.paymentType,
      // shippingAddress: this.props.route.params.address,
      specialInstruction: this.props.route.params.specialInstruction,
      orderStatus: this.props.route.params.orderStatus,
      orderId: this.props.route.params.docID,
      orderType: this.props.route.params.orderType,
      previousScreen: this.props.route.params.previousScreen,
    };
  }
  backAction = () => {
    if (this.props.route.params.previousScreen === 'Checkout') return true;
  };
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );

    const {previousScreen, tabName} = this.props.route.params;

    var collectionName;
    this.setState({previousScreen});
    if (previousScreen == 'Checkout') {
      this.clearCart();
    }
    if (tabName) {
      collectionName = tabName;
    } else {
      collectionName = 'Orders';
    }
    // firestore()
    //   .collection(collectionName)
    //   .doc(docId)
    //   .get()
    //   .then((snapshot) => {
    //     const {
    //       orderStatus,
    //       paymentType,
    //       shippingAddress,
    //       specialInstruction,
    //       dataCart,
    //     } = snapshot.data();
    //     this.setState({
    //       orderedItems: dataCart,
    //       shippingAddress,
    //       paymentType,
    //       specialInstruction,
    //       orderStatus,
    //       isLoading: false,
    //     });
    //   });
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  clearCart = async () => {
    const cart = [];
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      await AsyncStorage.setItem('First Order', 'False');
      return;
    } catch (e) {
      return false;
    }
  };
  handleGoBack = () => {
    const {previousScreen} = this.props.route.params;
    if (previousScreen === 'My Orders') {
      this.props.navigation.goBack();
    } else {
      this.props.navigation.navigate('Home');
    }
  };
  renderGoBack = () => {
    const {orderId, orderType} = this.state;
    return (
      <View style={{alignSelf: 'center'}}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('TrackOrder', {
              orderId,
              orderType,
            })
          }>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#F47621', '#F89919']}
            width={wp('80%')}
            height={hp('6%')}
            style={[
              styles.buttonDelivery,
              {
                marginTop: hp('2%'),
              },
            ]}>
            <Text style={styles.textOrder}>Order Status</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    if (this.state.isLoading) {
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
        <SafeAreaView style={styles.container}>
          {/* <ActivityIndicator size="large" /> */}
          <View
            style={{
              flexDirection: 'row',

              justifyContent: 'space-between',
              marginVertical: hp('1%'),
              paddingHorizontal: wp('5%'),
              alignItems: 'center',
            }}>
            <View>
              <MaterialIcons
                name="arrow-back"
                color="grey"
                size={35}
                onPress={this.handleGoBack}
              />
            </View>

            <Text
              style={{
                textAlign: 'center',
                fontSize: hp('3.5%'),
                fontFamily: 'Lato-Black',
                color: '#EC942A',
              }}>
              Order Details
            </Text>
            <View>
              <MaterialIcons name="arrow-back" color="white" size={35} />
            </View>
          </View>
          <ScrollView>
            <Text
              style={{
                textAlign: 'center',
                fontSize: hp('2.5%'),
                fontFamily: 'Lato-Black',
                paddingVertical: hp('2%'),
                color: '#555',
              }}>
              Order ID : {this.state.orderId}
            </Text>
            {this.state.orderedItems.map((item, i) => {
              const imageUrl = item.food.image;
              if (item.ingredients) {
                var toppingsLength = item.ingredients.length;
              }
              if (item.finalDesc) {
                var descLength = item.finalDesc.length;
              }
              var count = 0;
              var count1 = 0;
              return (
                <Card
                  elevation={2}
                  cornerRadius={20}
                  style={styles.cardView}
                  key={i}>
                  <View style={{width: wp('26%'), alignSelf: 'center'}}>
                    <FastImage
                      style={{
                        width: wp('25%'),
                        height: hp('15%'),
                        borderRadius: 4,
                      }}
                      source={{uri: imageUrl}}
                    />
                  </View>

                  <View
                    style={{
                      maxWidth: wp('65%'),
                      paddingHorizontal: wp('2%'),
                      paddingVertical: hp('2%'),
                    }}>
                    <Text
                      style={{
                        fontSize: hp('2.5%'),
                        fontFamily: 'Lato-Black',
                        color: '#555',
                      }}>
                      {item.food.name}
                    </Text>
                    <View>
                      <Text
                        style={{
                          fontSize: hp('1.9%'),
                          fontFamily: 'Lato-Black',
                          color: '#555',
                        }}>
                        Quantity :{' '}
                        <Text
                          style={{fontFamily: 'Lato-Regular', color: 'grey'}}>
                          {item.quantity}
                        </Text>
                      </Text>
                      {item.food.size && (
                        <Text
                          style={{
                            fontSize: hp('1.9%'),
                            fontFamily: 'Lato-Black',
                            color: '#555',
                          }}>
                          Size :
                          <Text
                            style={{fontFamily: 'Lato-Regular', color: 'grey'}}>
                            {' '}
                            {item.food.size}
                          </Text>
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: hp('1.9%'),
                          fontFamily: 'Lato-Black',
                          color: '#555',
                        }}>
                        Price :{' '}
                        <Text
                          style={{fontFamily: 'Lato-Regular', color: 'grey'}}>
                          ${item.price}
                        </Text>
                      </Text>
                    </View>
                    <View>
                      {item.ingredients && item.ingredients.length > 0 && (
                        <Text
                          style={{
                            fontSize: hp('1.9%'),
                            fontFamily: 'Lato-Black',
                            color: '#555',
                          }}>
                          Toppings :{' '}
                          {item.ingredients.map((ingredient, i) => {
                            count++;
                            let a;
                            if (count === toppingsLength) {
                              a = true;
                            } else {
                              a = false;
                            }
                            return (
                              <Text
                                key={i}
                                style={{
                                  fontFamily: 'Lato-Regular',
                                  color: 'grey',
                                }}>
                                {ingredient.name}
                                {!a && ','} {a && ''}
                              </Text>
                            );
                          })}
                        </Text>
                      )}
                    </View>
                    <View>
                      {item.finalDesc && item.finalDesc.length > 0 && (
                        <Text
                          style={{
                            fontSize: hp('1.9%'),
                            fontFamily: 'Lato-Black',
                            color: '#555',
                          }}>
                          Don't Include :{' '}
                          {item.finalDesc.map((finalDes) => {
                            count1++;
                            let x;
                            if (count1 === descLength) {
                              x = true;
                            } else {
                              x = false;
                            }
                            return (
                              <Text
                                style={{
                                  fontFamily: 'Lato-Regular',
                                  color: 'grey',
                                }}>
                                {finalDes}
                                {!x && ','}{' '}
                              </Text>
                            );
                          })}
                        </Text>
                      )}
                    </View>
                  </View>
                </Card>
              );
            })}
          </ScrollView>
          {this.renderGoBack()}
        </SafeAreaView>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardView: {
    alignSelf: 'center',
    flexDirection: 'row',
    minHeight: hp('20%'),
    width: wp('95%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
  },
  buttonDelivery: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
    flexDirection: 'row',
    borderRadius: 50,
    position: 'relative',
  },
  textOrder: {
    color: 'white',
    fontFamily: 'Lato-Black',
    fontSize: hp('2.5%'),
  },
});
export default OrderSuccess;
