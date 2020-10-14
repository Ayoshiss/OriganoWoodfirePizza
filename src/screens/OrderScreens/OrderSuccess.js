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
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Card} from 'react-native-shadow-cards';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
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
      tabName: this.props.route.params.tabName,
    };
  }
  backAction = () => {
    if (this.props.route.params.previousScreen === 'Checkout') {
      return true;
    }
  };
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );

    const {previousScreen} = this.props.route.params;

    this.setState({previousScreen});
    if (previousScreen === 'Checkout') {
      this.clearCart();
    }
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
    const {orderId, orderType, tabName} = this.state;
    return (
      <View style={{alignSelf: 'center'}}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('TrackOrder', {
              orderId,
              orderType,
              tabName,
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
                      {item.food.size && (
                        <TouchableOpacity
                          onPress={() => this[RBSheet + i].open()}>
                          <Text style={styles.moreDetailsText}>
                            More Details
                          </Text>
                        </TouchableOpacity>
                      )}
                      {item.food.pizzaNames && (
                        <TouchableOpacity
                          onPress={() => this[RBSheet + i].open()}>
                          <Text style={styles.moreDetailsText}>
                            More Details
                          </Text>
                        </TouchableOpacity>
                      )}
                      {!item.food.size && !item.food.pizzaNames && (
                        <Text
                          style={{
                            color: 'white',
                          }}>
                          More Details
                        </Text>
                      )}
                    </View>
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
                        <Text style={styles.moreDetails}>
                          Size :{' '}
                          <Text style={styles.moreDetailsItems}>
                            {item.food.size}
                          </Text>
                        </Text>
                      )}

                      {item.food.pizzaNames && (
                        <Text style={styles.moreDetails}>
                          Pizza :{' '}
                          <Text style={styles.moreDetailsItems}>
                            {item.food.name === 'Big Deal' &&
                              item.food.pizzaNames.map((pizza, j) => {
                                if (j < item.food.pizzaNames.length - 2) {
                                  return pizza + ', ';
                                }
                                if (j === item.food.pizzaNames.length - 2) {
                                  return pizza;
                                }
                              })}
                            {item.food.name !== 'Big Deal' &&
                              item.food.pizzaNames.map((pizza, k) => {
                                if (k < item.food.pizzaNames.length - 1) {
                                  return pizza + ', ';
                                }
                                if (k === item.food.pizzaNames.length - 1) {
                                  return pizza;
                                }
                              })}
                          </Text>
                        </Text>
                      )}
                      {item.food.pastaNames && item.food.name === 'Party Deal' && (
                        <Text style={styles.moreDetails}>
                          Pasta :{' '}
                          <Text style={styles.moreDetailsItems}>
                            {item.food.pastaNames.map((pasta, l) => {
                              if (l < item.food.pastaNames.length - 1) {
                                return pasta + ', ';
                              }
                              if (l === item.food.pastaNames.length - 1) {
                                return pasta;
                              }
                            })}
                          </Text>
                        </Text>
                      )}
                      {item.food.garlicPizzaNames &&
                        item.food.name === 'Party Deal' && (
                          <Text style={styles.moreDetails}>
                            Garlic Pizza :{' '}
                            <Text style={styles.moreDetailsItems}>
                              {item.food.garlicPizzaNames.map((gPizza, m) => {
                                if (m < item.food.garlicPizzaNames.length - 1) {
                                  return gPizza + ', ';
                                }
                                if (
                                  m ===
                                  item.food.garlicPizzaNames.length - 1
                                ) {
                                  return gPizza;
                                }
                              })}
                            </Text>
                          </Text>
                        )}

                      {item.ingredients && item.ingredients.length > 0 && (
                        <Text style={styles.moreDetails}>
                          Toppings :
                          {item.ingredients.map((ingredient, x) => {
                            count++;
                            let a;
                            if (count === toppingsLength) {
                              a = true;
                            } else {
                              a = false;
                            }
                            return (
                              <Text key={x} style={styles.moreDetailsItems}>
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
                        <Text style={styles.moreDetails}>
                          Don't Include :
                          {item.finalDesc.map((finalDes, y) => {
                            count1++;
                            let a;
                            if (count1 === descLength) {
                              a = true;
                            } else {
                              a = false;
                            }
                            return (
                              <Text key={y} style={styles.moreDetailsItems}>
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
  moreDetailsText: {
    fontSize: hp('1.9%'),
    color: '#ec942a',
    fontFamily: 'Lato-Black',
  },
  moreDetails: {
    fontFamily: 'Lato-Black',
    fontSize: hp('2.2%'),
    paddingVertical: hp('1%'),
  },
  moreDetailsItems: {color: 'grey', fontFamily: 'Lato-Bold'},
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
