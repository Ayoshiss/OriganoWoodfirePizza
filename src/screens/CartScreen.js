import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import auth from '@react-native-firebase/auth';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Card} from 'react-native-shadow-cards';
import {RNToasty} from 'react-native-toasty';
import FastImage from 'react-native-fast-image';
export class CartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCart: [],
      isFirstOrder: null,
      isEmpty: false,
      isUser: null,
      phoneNumber: null,
      preferenceData: null,
      preferenceType: null,
      deliveryCharge: null,
    };
  }
  getdata = async () => {
    try {
      await AsyncStorage.getItem('cart').then((cart) => {
        if (cart == null) {
          this.setState({isEmpty: true});
        }
        if (cart !== null) {
          const cartfood = JSON.parse(cart);
          this.setState({dataCart: cartfood, isEmpty: false});
        }
      });
    } catch (e) {}
  };
  getPreferenceData = async () => {
    try {
      const preferenceData = await AsyncStorage.getItem('preferenceData');
      const preferenceType = await AsyncStorage.getItem('preferenceType');
      var charge = await AsyncStorage.getItem('charge');
      var isFirstOrder = await AsyncStorage.getItem('First Order');
      var deliveryCharge = parseInt(charge);
      if (preferenceData !== null) {
        this.setState({
          preferenceData,
          preferenceType,
          deliveryCharge,
          isFirstOrder,
        });
      }
    } catch (e) {}
  };
  componentDidMount() {
    //Reload Trick
    const {navigation} = this.props;
    this.getdata();
    this.getPreferenceData();

    //Adding an event listner om focus
    this.focusListener = navigation.addListener('focus', () => {
      auth().onAuthStateChanged((user) => {
        if (user) {
          const {phoneNumber} = user;
          this.setState({isUser: true, phoneNumber});
        }
      });
      this.getdata();
      this.getPreferenceData();
    });
  }

  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack
    this.focusListener.remove();
  }
  onChangeQuat(i, type) {
    const tempDataCart = this.state.dataCart;
    let cartq = tempDataCart[i].quantity;
    if (type) {
      cartq = cartq + 1;
      tempDataCart[i].quantity = cartq;
      this.setState({dataCart: tempDataCart});
    } else if (type === false && cartq >= 2) {
      cartq = cartq - 1;
      tempDataCart[i].quantity = cartq;
      this.setState({dataCart: tempDataCart});
    } else if (type === false && cartq === 1) {
      return;
    }

    AsyncStorage.setItem('cart', JSON.stringify(this.state.dataCart));
  }
  onCrossItem(i) {
    const tempDataCart = this.state.dataCart;
    tempDataCart.splice(i, 1);
    this.setState({dataCart: tempDataCart});
    AsyncStorage.setItem('cart', JSON.stringify(this.state.dataCart));
  }

  onCartTotal() {
    let total = 0;
    const cart = this.state.dataCart;
    for (let i = 0; i < cart.length; i++) {
      total = total + cart[i].price * cart[i].quantity;
    }
    return total;
  }

  handleCheckout = () => {
    const {
      isUser,
      preferenceData,
      preferenceType,
      phoneNumber,
      deliveryCharge,
      isFirstOrder,
    } = this.state;
    let discount;
    if (!isUser) {
      this.props.navigation.navigate('Profile');
      RNToasty.Show({title: 'Please Login or Register to continue'});
      return;
    }
    if (isUser && phoneNumber === null) {
      this.props.navigation.navigate('Profile');
      RNToasty.Show({title: 'Please verify your phone to continue.'});
      return;
    }
    if (isUser && preferenceType === null) {
      this.props.navigation.navigate('Home');
      RNToasty.Show({title: 'Please select Delivery or Pickup'});
      return;
    }
    if (preferenceType === 'Delivery' && isFirstOrder === 'True') {
      var totalPrice =
        Math.round(
          (this.onCartTotal() + parseInt(deliveryCharge) - 10) * 100 +
            Number.EPSILON,
        ) / 100;
      discount = 10;
    }
    if (preferenceType === 'Delivery' && isFirstOrder === 'False') {
      var totalPrice =
        Math.round(
          (this.onCartTotal() + parseInt(deliveryCharge)) * 100 +
            Number.EPSILON,
        ) / 100;
      discount = 0;
    }
    if (preferenceType === 'Pickup' && isFirstOrder === 'True') {
      var totalPrice =
        Math.round((this.onCartTotal() - 10) * 100 + Number.EPSILON) / 100;
      discount = 10;
    }
    if (preferenceType === 'Pickup' && isFirstOrder === 'False') {
      var totalPrice =
        Math.round(this.onCartTotal() * 100 + Number.EPSILON) / 100;
      discount = 0;
    }
    if (preferenceType === 'Delivery' && this.onCartTotal() < 25) {
      RNToasty.Show({
        title: 'Minimum Order is $25. Please add more items to cart.',
      });
      return;
    }
    if (preferenceType === 'Pickup' && this.onCartTotal() < 12) {
      RNToasty.Show({
        title: 'Minimum Order is $12. Please add more items to cart',
      });
      return;
    }

    this.props.navigation.navigate('ShippingDetails', {
      dataCart: this.state.dataCart,
      totalPrice,
      preferenceData,
      preferenceType,
      deliveryCharge,
      discount,
    });
  };

  renderEmpty() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Cart</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            flex: 1,
            alignItems: 'center',
          }}>
          <View>
            <Icon name={'ios-cart'} style={[{color: '#ddd'}]} size={200} />
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontSize: hp('3.5%'),
                color: '#B6B6B6',
                marginHorizontal: wp('3%'),
              }}>
              Cart is Empty
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  renderCartItems() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Cart</Text>
        </View>

        {/* <Text>{JSON.stringify(this.state.dataCart)}</Text> */}
        <ScrollView style>
          {this.state.dataCart.map((item, i) => {
            const imageUrl = item.food.image;
            if (item.ingredients) {
              var toppingsLength = item.ingredients.length;
            }
            var count,
              count1 = 0;
            if (item.finalDesc) {
              var descLength = item.finalDesc.length;
            }
            var count1,
              count = 0;

            return (
              <Card
                key={i}
                elevation={2}
                cornerRadius={20}
                style={styles.cardView}>
                <Icon
                  name="ios-close"
                  size={32}
                  color="#EC942A"
                  style={{
                    position: 'absolute',
                    right: 15,
                    top: 0,
                    zIndex: 1000,
                  }}
                  onPress={() => {
                    this.onCrossItem(i);
                  }}
                />
                <View>
                  {item.food.size ? (
                    <TouchableOpacity onPress={() => this[RBSheet + i].open()}>
                      <FastImage
                        style={{
                          width: wp('25%'),
                          minHeight: hp('13%'),
                          borderRadius: 4,
                        }}
                        source={{uri: imageUrl}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <FastImage
                      style={{
                        width: wp('25%'),
                        minHeight: hp('13%'),
                        borderRadius: 4,
                      }}
                      source={{uri: imageUrl}}
                    />
                  )}
                </View>

                <View
                  style={{
                    marginHorizontal: wp('5%'),
                    justifyContent: 'space-between',
                    flex: 1,
                  }}>
                  <View style={{marginBottom: hp('1.5%')}}>
                    <Text
                      style={{fontSize: hp('2.5%'), fontFamily: 'Lato-Bold'}}>
                      {item.food.name}
                    </Text>
                    {item.food.size && (
                      <TouchableOpacity
                        onPress={() => this[RBSheet + i].open()}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                      </TouchableOpacity>
                    )}
                    {item.food.pizzaNames && (
                      <TouchableOpacity
                        onPress={() => this[RBSheet + i].open()}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                      </TouchableOpacity>
                    )}
                    {!item.food.size && !item.food.pizzaNames && (
                      <Text style={styles.viewDetailsText}>View Details</Text>
                    )}
                  </View>
                  <RBSheet
                    ref={(ref) => {
                      this[RBSheet + i] = ref;
                    }}
                    animationType={'slide'}
                    height={hp('25%')}
                    openDuration={500}
                    closeOnDragDown={true}
                    dragFromTopOnly={true}
                    customStyles={{
                      container: {
                        borderTopEndRadius: 30,
                        borderTopStartRadius: 30,
                      },
                    }}>
                    <ScrollView
                      style={{
                        paddingLeft: wp('10%'),
                        paddingVertical: hp('2%'),
                      }}>
                      {item.food.size && (
                        <Text style={styles.viewDetails}>
                          Size :{' '}
                          <Text style={styles.viewDetailsItems}>
                            {item.food.size}
                          </Text>
                        </Text>
                      )}

                      {item.food.pizzaNames && (
                        <Text style={styles.viewDetails}>
                          Pizza :{' '}
                          <Text style={styles.viewDetailsItems}>
                            {item.food.name === 'Big Deal' &&
                              item.food.pizzaNames.map((pizza, i) => {
                                if (i < item.food.pizzaNames.length - 2) {
                                  return pizza + ', ';
                                }
                                if (i === item.food.pizzaNames.length - 2) {
                                  return pizza;
                                }
                              })}
                            {item.food.name !== 'Big Deal' &&
                              item.food.pizzaNames.map((pizza, i) => {
                                if (i < item.food.pizzaNames.length - 1) {
                                  return pizza + ', ';
                                }
                                if (i === item.food.pizzaNames.length - 1) {
                                  return pizza;
                                }
                              })}
                          </Text>
                        </Text>
                      )}
                      {item.food.pastaNames && item.food.name === 'Party Deal' && (
                        <Text style={styles.viewDetails}>
                          Pasta :{' '}
                          <Text style={styles.viewDetailsItems}>
                            {item.food.pastaNames.map((pasta, i) => {
                              if (i < item.food.pastaNames.length - 1) {
                                return pasta + ', ';
                              }
                              if (i === item.food.pastaNames.length - 1) {
                                return pasta;
                              }
                            })}
                          </Text>
                        </Text>
                      )}
                      {item.food.garlicPizzaNames &&
                        item.food.name === 'Party Deal' && (
                          <Text style={styles.viewDetails}>
                            Garlic Pizza :{' '}
                            <Text style={styles.viewDetailsItems}>
                              {item.food.garlicPizzaNames.map((gPizza, i) => {
                                if (i < item.food.garlicPizzaNames.length - 1) {
                                  return gPizza + ', ';
                                }
                                if (
                                  i ===
                                  item.food.garlicPizzaNames.length - 1
                                ) {
                                  return gPizza;
                                }
                              })}
                            </Text>
                          </Text>
                        )}

                      {item.ingredients && item.ingredients.length > 0 && (
                        <Text style={styles.viewDetails}>
                          Toppings :
                          {item.ingredients.map((ingredient, i) => {
                            count++;
                            let a;
                            if (count === toppingsLength) {
                              a = true;
                            } else {
                              a = false;
                            }
                            return (
                              <Text key={i} style={styles.viewDetailsItems}>
                                {' '}
                                {ingredient.name}
                                {!a && ','}
                                {a}
                              </Text>
                            );
                          })}
                        </Text>
                      )}
                      {item.finalDesc && item.finalDesc.length > 0 && (
                        <Text style={styles.viewDetails}>
                          Don't Include :
                          {item.finalDesc.map((finalDes, i) => {
                            count1++;
                            let a;
                            if (count1 === descLength) {
                              a = true;
                            } else {
                              a = false;
                            }
                            return (
                              <Text key={i} style={styles.viewDetailsItems}>
                                {' '}
                                {finalDes}
                                {!a && ','}
                                {a}
                              </Text>
                            );
                          })}
                        </Text>
                      )}
                    </ScrollView>
                  </RBSheet>

                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      paddingTop: hp('3%'),
                    }}>
                    <TouchableOpacity
                      onPress={() => this.onChangeQuat(i, false)}>
                      <MaterialIcons
                        name="remove-circle-outline"
                        style={{color: '#EC942A'}}
                        size={24}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        fontFamily: 'Lato-Black',
                        paddingHorizontal: wp('2%'),
                        color: 'grey',
                        fontSize: hp('2.3%'),
                      }}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.onChangeQuat(i, true)}>
                      <MaterialIcons
                        name="add-circle-outline"
                        style={[{color: '#EC942A'}]}
                        size={24}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{alignSelf: 'flex-end'}}>
                  <Text
                    style={{
                      fontFamily: 'Lato-Black',
                      color: '#EC942A',
                      fontSize: hp('2.5%'),
                    }}>
                    $
                    {Math.round(
                      item.price * item.quantity * 100 + Number.EPSILON,
                    ) / 100}
                  </Text>
                </View>
              </Card>
            );
          })}
          <View style={{height: 20}} />
        </ScrollView>

        {/* <View style={{height: 10}} /> */}
        {this.renderCheckoutView()}
        {/* <View style={{height: 15}} /> */}
      </SafeAreaView>
    );
  }
  renderCheckoutView() {
    const {deliveryCharge, preferenceType, isFirstOrder} = this.state;
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          backgroundColor: '#F7f7f7',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          minHeight: hp('10%'),
        }}>
        {preferenceType === 'Delivery' && (
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: wp('82%'),
                paddingLeft: wp('5%'),
                paddingTop: hp('1%'),
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  color: 'grey',
                  fontSize: hp('2.2%'),
                }}>
                Subtotal
              </Text>
            </View>
            <View style={{width: wp('18%'), paddingTop: hp('1%')}}>
              <Text
                style={{
                  fontFamily: 'Lato-Black',
                  color: '#EC942A',
                  fontSize: hp('2.3%'),
                }}>
                ${this.onCartTotal()}
              </Text>
            </View>
          </View>
        )}

        {preferenceType === 'Delivery' && (
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: wp('82%'),
                paddingLeft: wp('5%'),
              }}>
              <Text
                style={{
                  color: 'grey',
                  fontSize: hp('2.2%'),
                  fontFamily: 'Lato-Bold',
                }}>
                Delivery Charge
              </Text>
            </View>
            <View style={{width: wp('18%')}}>
              <Text
                style={{
                  color: '#EC942A',
                  fontSize: hp('2.3%'),
                  fontFamily: 'Lato-Black',
                }}>
                ${deliveryCharge}
              </Text>
            </View>
          </View>
        )}
        {isFirstOrder === 'True' && (
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: wp('82%'),
                paddingLeft: wp('5%'),
              }}>
              <Text
                style={{
                  color: 'grey',
                  fontSize: hp('2.2%'),
                  fontFamily: 'Lato-Bold',
                }}>
                First Order Discount
              </Text>
            </View>
            <View style={{width: wp('18%')}}>
              <Text
                style={{
                  color: '#EC942A',
                  fontSize: hp('2.3%'),
                  fontFamily: 'Lato-Black',
                }}>
                ${10}
              </Text>
            </View>
          </View>
        )}
        <View style={{flexDirection: 'row'}} />
        <View style={{flexDirection: 'row'}} />
        <TouchableOpacity onPress={() => this.handleCheckout()}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#F47621', '#F89919']}
            style={styles.button}>
            <View>
              <Text style={styles.textOrder}>Checkout </Text>
            </View>
            <View style={{paddingLeft: wp('60%'), position: 'absolute'}}>
              {preferenceType === 'Pickup' && isFirstOrder === 'True' && (
                <Text style={styles.totalPriceText}>
                  $
                  {Math.round(
                    (this.onCartTotal() - 10) * 100 + Number.EPSILON,
                  ) / 100}
                </Text>
              )}
              {preferenceType === 'Pickup' && isFirstOrder === 'False' && (
                <Text style={styles.totalPriceText}>
                  ${Math.round(this.onCartTotal() * 100 + Number.EPSILON) / 100}
                </Text>
              )}
              {preferenceType === 'Delivery' && isFirstOrder === 'True' && (
                <Text
                  style={{
                    fontSize: hp('2.3%'),
                    fontFamily: 'Lato-Black',
                    color: 'white',
                  }}>
                  $
                  {Math.round(
                    (this.onCartTotal() + parseInt(deliveryCharge) - 10) * 100 +
                      Number.EPSILON,
                  ) / 100}
                </Text>
              )}
              {preferenceType === 'Delivery' && isFirstOrder === 'False' && (
                <Text style={styles.totalPriceText}>
                  $
                  {Math.round(
                    (this.onCartTotal() + parseInt(deliveryCharge)) * 100 +
                      Number.EPSILON,
                  ) / 100}
                </Text>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    if (this.state.dataCart.length !== 0) {
      return <View style={{flex: 1}}>{this.renderCartItems()}</View>;
    } else {
      return <View style={{flex: 1}}>{this.renderEmpty()}</View>;
    }
  }
}

export default CartScreen;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignSelf: 'center',
    marginVertical: hp('1%'),
  },
  viewDetailsText: {
    fontSize: hp('1.9%'),
    color: 'grey',
    fontFamily: 'Lato-Bold',
  },
  viewDetails: {
    fontFamily: 'Lato-Black',
    fontSize: hp('2.2%'),
    paddingVertical: hp('1%'),
  },
  viewDetailsItems: {color: 'grey', fontFamily: 'Lato-Bold'},

  title: {
    fontFamily: 'Lato-Black',
    fontSize: hp('3.5%'),
    color: '#EC942A',
  },
  totalCart: {
    alignContent: 'space-between',
  },
  textOrder: {
    fontFamily: 'Lato-Bold',
    color: 'white',
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
  },
  totalPriceText: {
    fontSize: hp('2.3%'),
    fontFamily: 'Lato-Black',
    color: 'white',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    alignSelf: 'center',
    paddingVertical: hp('1.6%'),
    marginVertical: hp('1.5%'),
    borderRadius: 100,
    flexDirection: 'row',
  },
  cardView: {
    minHeight: hp('18%'),
    width: wp('95%'),
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    marginVertical: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
