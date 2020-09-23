import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
  StatusBar,
} from 'react-native';
import PlaceSearch from '../components/PlaceSearch';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import StorePicker from '../components/StorePicker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGrad from '../components/LinearGrad';
import {
  getPizzaData,
  getToppingsData,
  getBurgerData,
  getPastaData,
  getSaladData,
  getEntreeData,
  getDessertData,
  getBeverageData,
  getSpecialData,
} from '../getDatas/FoodApi';
import {notificationManager} from '../NotificationManager';
var menuData = [];
var deliveryPlaces = [];
var placesWithCharge = [];
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      pizzaList: [],
      toppingsList: [],
      burgerList: [],
      pastaList: [],
      saladList: [],
      entreeList: [],
      dessertList: [],
      beverageList: [],
      specialList: [],
      search: '',
      showPickupInput: false,
      showDeliveryInput: false,
      userLocation: [],
      latitude: '',
      longitude: '',
      address: '',
      pickUpStore: '',
      preferencePickup: false,
      preferenceDeliver: false,
      shippingAddress: '',
      preferenceData: '',
      preferenceType: '',
      isUser: false,
      bannerUrl: 'Loading',
      places: [],
      errorMessage: null,
      viewPlaces: null,
      initialPage: null,
      placesWithCharge: [],
      currentUserId: null,
      checkDiscount: false,
      notifyToken: null,
    };
    this.localNotify = null;
    this.senderID = '180464438307';
  }
  onPizzaRecieved = (pizzaList) => {
    this.setState((prevState) => ({
      pizzaList: (prevState.pizzaList = pizzaList),
    }));
  };
  onToppingsRecieved = (toppingsList) => {
    this.setState((prevState) => ({
      toppingsList: (prevState.toppingsList = toppingsList),
    }));
  };
  onBurgerRecieved = (burgerList) => {
    this.setState((prevState) => ({
      burgerList: (prevState.burgerList = burgerList),
    }));
  };
  onPastaRecieved = (pastaList) => {
    this.setState((prevState) => ({
      pastaList: (prevState.pastaList = pastaList),
    }));
  };
  onSaladRecieved = (saladList) => {
    this.setState((prevState) => ({
      saladList: (prevState.saladList = saladList),
    }));
  };
  onEntreeRecieved = (entreeList) => {
    this.setState((prevState) => ({
      entreeList: (prevState.entreeList = entreeList),
    }));
  };
  onDessertRecieved = (dessertList) => {
    this.setState((prevState) => ({
      dessertList: (prevState.dessertList = dessertList),
    }));
  };
  onBeverageRecieved = (beverageList) => {
    this.setState((prevState) => ({
      beverageList: (prevState.beverageList = beverageList),
    }));
  };
  onSpecialRecieved = (specialList) => {
    this.setState((prevState) => ({
      specialList: (prevState.specialList = specialList),
    }));
  };

  togglePickupInput = () => {
    this.setState({
      showPickupInput: !this.state.showPickupInput,
      showDeliveryInput: false,
    });
  };
  toggleDeliveryInput = () => {
    this.setState({
      showDeliveryInput: !this.state.showDeliveryInput,
      showPickupInput: false,
    });
  };
  getMenuList = () => {
    firestore()
      .collection('Menu List')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let x = doc.data();

          menuData = [...menuData, x];
          this.setState({
            data: menuData,
          });
        });
      });
  };
  // getBannerImage() {
  //   firestore()
  //     .collection('Banner')
  //     .get()
  //     .then((snap) => {
  //       snap.docs.forEach((item) => {
  //         x = item.data().image;
  //         this.setState({bannerUrl: x});
  //       });
  //     });
  // }
  getDeliveryPlaces() {
    firestore()
      .collection('Delivery Places')
      .onSnapshot((snapshot) => {
        snapshot.docs.forEach((doc) => {
          let x = doc.data().place;
          let y = doc.data().charge;
          let placeWithCharge = [x, y];
          placesWithCharge = [...placesWithCharge, placeWithCharge];
          deliveryPlaces = [...deliveryPlaces, x];
          this.setState({places: deliveryPlaces, placesWithCharge});
        });
      });
  }
  getFirstOrderInfo() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let x = 0,
          y = 0;
        firestore()
          .collection('Orders')
          .where('uid', '==', user.uid)
          .get()
          .then((snapshot) => {
            if (snapshot.docs.length === 0) {
              x = 1;
            } else {
              x = 0;
            }
            firestore()
              .collection('Completed Orders')
              .where('uid', '==', user.uid)
              .get()
              .then((snapshot) => {
                if (snapshot.docs.length === 0) {
                  y = 1;
                } else {
                  y = 0;
                }
                if (x == 1 && y == 1) {
                  alert('You are eligible for a $10 discount. Yay!!!');
                  AsyncStorage.setItem('First Order', 'True');
                } else {
                  AsyncStorage.setItem('First Order', 'False');
                }
              })
              .catch((err) => {
                // console.log(err);
              });
          })
          .catch((err) => {
            // console.log(err);
          });
      }
    });
  }
  getNotifyToken = (currentUserId) => {
    firestore()
      .collection('Users')
      .doc(currentUserId)
      .get()
      .then((data) => {
        const {notifyToken} = data.data();
        this.setState({notifyToken});
      });
  };

  componentDidMount() {
    this.getPreferenceData();
    //this.getBannerImage();
    this.getDeliveryPlaces();
    getPizzaData(this.onPizzaRecieved);
    getToppingsData(this.onToppingsRecieved);
    getBurgerData(this.onBurgerRecieved);
    getPastaData(this.onPastaRecieved);
    getSaladData(this.onSaladRecieved);
    getEntreeData(this.onEntreeRecieved);
    getDessertData(this.onDessertRecieved);
    getBeverageData(this.onBeverageRecieved);
    getSpecialData(this.onSpecialRecieved);
    this.getMenuList();
    this.getFirstOrderInfo();
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.setState({
        errorMessage: null,
        viewPlaces: null,
        showDeliveryInput: false,
      });
      auth().onAuthStateChanged((user) => {
        if (user) {
          var currentUserId = user.uid;
          this.getNotifyToken(currentUserId);
          this.setState({
            isUser: true,
            currentUserId,
          });
        } else {
          this.setState({isUser: false});
        }
      });
      if (this.props.route.params) {
        const {
          preferenceData,
          preferenceType,
          charge,
        } = this.props.route.params;
        this.storePreferenceData(preferenceData, preferenceType, charge);
      }

      this.localNotify = notificationManager;
      this.localNotify.configure(
        this.onRegister,
        this.onNotification,
        this.onOpenNotification,
        this.senderID,
      );
      this.getPreferenceData();
    });
  }

  onRegister(token) {
    // console.log('[Notification] Registered:', token);
    AsyncStorage.setItem('notifyToken', token);
  }
  onNotification(notify) {
    // console.log('[Notification] onNotification:', notify);
  }
  onOpenNotification(notify) {
    // console.log('[Notification] onOpenNotification:', notify);
  }

  // componentWillUnmount() {
  //   // Remove the event listener before removing the screen from the stack
  //   this.focusListener.remove();
  // }
  storePreferenceData = async (preferenceData, type, charge) => {
    this.setState({showPickupInput: false});
    try {
      await AsyncStorage.setItem('preferenceData', preferenceData);
      await AsyncStorage.setItem('preferenceType', type);
      await AsyncStorage.setItem('charge', charge);
      this.setState({
        showPickupInput: false,
        preferenceDataExists: true,
        preferenceData,
      });
      if (type == 'Pickup') {
        this.setState({
          preferenceType: 'Pickup',
        });
      }
      if (type == 'Delivery') {
        this.setState({
          preferenceType: 'Delivery',
        });
      }
    } catch (e) {}
  };
  getPreferenceData = async () => {
    const {notifyToken, currentUserId} = this.state;
    try {
      const preferenceData = await AsyncStorage.getItem('preferenceData');
      const preferenceType = await AsyncStorage.getItem('preferenceType');
      const storedToken = await AsyncStorage.getItem('notifyToken');

      if (preferenceData !== null) {
        this.setState({
          preferenceData,
          preferenceDataExists: true,
          preferenceType,
        });
      }
      if (storedToken !== notifyToken && currentUserId !== null) {
        firestore().collection('Users').doc(currentUserId).update({
          notifyToken: storedToken,
        });
      }
    } catch (e) {}
  };
  renderItem = ({item}) => {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          zIndex: 50,
          marginBottom: hp('1%'),
        }}
        key={item.id}>
        <TouchableWithoutFeedback onPress={() => this.handleClick(item)}>
          <LinearGradient
            colors={['rgb(244, 118, 33)', 'rgb(248, 153, 25)']}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            style={styles.item}>
            <View style={styles.image_container}>
              <Image source={{uri: item.image}} style={styles.image} />
            </View>
            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={35}
                color="#FBFBFB"
                style={{paddingTop: hp('0.5%')}}
              />
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </View>
    );
  };
  handleClick(item) {
    if (item.id === 7) {
      this.props.navigation.navigate('HalfPizzaScreen', {
        pizzaList: this.state.pizzaList,
        // toppingsList: this.state.toppingsList,
      });
    } else {
      this.props.navigation.navigate('Menu', {
        pizzaList: this.state.pizzaList,
        toppingsList: this.state.toppingsList,
        pastaList: this.state.pastaList,
        saladList: this.state.saladList,
        entreeList: this.state.entreeList,
        dessertList: this.state.dessertList,
        beverageList: this.state.beverageList,
        specialList: this.state.specialList,
        initialPage: item.id,
      });
    }
  }
  ItemSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 10,
        }}
      />
    );
  };
  _search(text) {
    let data = [];
    this.state.data_temp.map(function (value) {
      if (value.name.indexOf(text) > -1) {
        data.push(value);
      }
    });
    this.setState({
      data: data,
      search: text,
    });
  }

  handleDeliveryBtn = (data) => {
    const {places, placesWithCharge} = this.state;
    const address = data.description;
    var count = 0;
    placesWithCharge.forEach((item) => {
      if (address.includes(item[0])) {
        if (address.split(' ').length < 5) {
          this.setState({errorMessage: 'Please enter your full address.'});
          return;
        } else {
          this.storePreferenceData(
            data.description,
            'Delivery',
            JSON.stringify(item[1]),
          );
          this.setState({
            showDeliveryInput: false,
            errorMessage: null,
            viewPlaces: null,
          });
        }
      } else {
        count = count + 1;
      }
    });

    if (count === placesWithCharge.length) {
      this.setState({
        errorMessage: 'Sorry! We currently do not deliver in that area.',
        viewPlaces: 'View Places We Deliver',
      });
    }
  };

  handlePickupBtn = (item) => {
    this.storePreferenceData(item.label, 'Pickup', '0');
    this.setState({
      showPickupInput: false,
      preferenceDataExists: true,
      preferenceData: item.label,
      preferenceType: 'Pickup',
    });
  };

  render() {
    const {bannerUrl, checkDiscount} = this.state;
    const listHeader = () => {
      return (
        <SafeAreaView>
          {/* <Carousel data={carouselData} /> */}
          <StatusBar barStyle="dark-content" backgroundColor="white" />

          <View style={styles.imageView}>
            <Image
              style={styles.banner}
              // source={{
              //   uri: bannerUrl,
              // }}
              source={require('../assets/img/FinalBanner.png')}
            />
          </View>
          {/* {checkDiscount && alert('You are elgigble for 10% discount')} */}
          {!this.state.preferenceDataExists && (
            <View style={styles.orderBtnsView}>
              <View
                style={{
                  paddingHorizontal: wp('10%'),
                }}>
                <TouchableOpacity onPress={this.toggleDeliveryInput}>
                  <LinearGrad
                    width={{width: wp('35%')}}
                    text="Delivery"
                    iconName="truck-fast"
                    animating={false}
                    activityStyles={{position: 'absolute'}}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={this.togglePickupInput}>
                  <LinearGrad
                    width={{width: wp('35%')}}
                    text="Pickup"
                    iconName="store"
                    animating={false}
                    activityStyles={{position: 'absolute'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {!this.state.isUser && (
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: hp('2.2%'),
                  marginTop: hp('2%'),
                  color: 'grey',
                  fontFamily: 'Lato-Italic',
                }}>
                Have an account?
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Profile')}>
                <Text style={styles.btnLogin}>Login</Text>
              </TouchableOpacity>
              <Text
                style={{
                  marginTop: hp('2%'),
                  color: 'grey',
                  fontFamily: 'Lato-Italic',
                }}>
                or
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Profile')}>
                <Text style={styles.btnLogin}>Register</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{alignItems: 'center'}}>
            <Text style={styles.bestMenuText}>OUR BEST MENU</Text>
          </View>
        </SafeAreaView>
      );
    };
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {menuData.length == 0 && (
          <View
            style={{
              flex: 1,
              paddingTop: hp('47%'),
              position: 'absolute',
              marginLeft: wp('47%'),
            }}>
            <ActivityIndicator animating={true} size="large" color="#EC942A" />
          </View>
        )}
        {menuData.length != 0 && (
          // <ImageBackground
          //   source={require('../asset/back2.jpg')}
          //   style={{flex: 1, resizeMode: 'cover'}}>
          <View style={styles.container}>
            {this.state.errorMessage && (
              <Text
                style={{
                  color: 'red',
                  fontSize: hp('2%'),
                  textAlign: 'center',
                  marginTop: hp('1%'),
                }}>
                {this.state.errorMessage}
              </Text>
            )}
            {this.state.viewPlaces && (
              <View>
                <TouchableOpacity onPress={() => this.RBSheet.open()}>
                  <Text
                    style={{
                      color: 'red',
                      fontSize: hp('2%'),
                      textAlign: 'center',
                      marginTop: hp('1%'),
                    }}>
                    {this.state.viewPlaces}
                  </Text>
                </TouchableOpacity>
                <RBSheet
                  ref={(ref) => {
                    this.RBSheet = ref;
                  }}
                  animationType={'slide'}
                  height={500}
                  openDuration={500}
                  closeOnDragDown={true}
                  dragFromTopOnly={true}
                  customStyles={{
                    container: {
                      borderTopEndRadius: 30,
                      borderTopStartRadius: 30,
                    },
                  }}>
                  <ScrollView>
                    <Text
                      style={{
                        fontSize: hp('3%'),
                        alignSelf: 'center',
                        fontWeight: '700',
                        paddingVertical: hp('2%'),
                      }}>
                      Places We Deliver
                    </Text>
                    {this.state.places.map((place) => {
                      return (
                        <Text
                          style={{
                            fontSize: hp('2.4%'),
                            paddingLeft: wp('5%'),
                          }}>
                          {place}
                        </Text>
                      );
                    })}
                  </ScrollView>
                </RBSheet>
              </View>
            )}
            {this.state.showDeliveryInput && (
              <View
                style={{
                  flex: 1,
                  width: wp('100%'),
                  borderWidth: 0,

                  minHeight: hp('30%'),
                }}>
                <PlaceSearch
                  places={this.state.places}
                  onPress={(data, details = null) => {
                    this.handleDeliveryBtn(data);
                  }}
                />
              </View>
            )}
            {this.state.showPickupInput && (
              <View
                style={{
                  marginHorizontal: wp('5%'),
                  marginVertical: hp('1%'),
                }}>
                <StorePicker
                  onChangeItem={(item) => this.handlePickupBtn(item)}
                />
              </View>
            )}

            {this.state.preferenceDataExists && (
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate('OrderPreference', {
                    places: this.state.places,
                    placesWithCharge: this.state.placesWithCharge,
                  })
                }>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: hp('1%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: '#FFF',
                  }}>
                  {this.state.preferenceType === 'Delivery' && (
                    <MaterialCommunityIcons
                      name="truck-fast"
                      color="black"
                      size={20}
                      style={{marginHorizontal: wp('2%')}}
                    />
                  )}
                  {this.state.preferenceType == 'Pickup' && (
                    <MaterialCommunityIcons
                      name="store"
                      color="black"
                      size={20}
                      style={{marginHorizontal: wp('2%')}}
                    />
                  )}
                  <Text
                    style={{
                      fontFamily: 'Lato-Bold',
                      textDecorationLine: 'underline',
                      fontSize: hp('2%'),
                    }}>
                    {this.state.preferenceData}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}

            <FlatList
              ListHeaderComponent={listHeader}
              data={this.state.data}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.ItemSeparatorComponent}
              showsVerticalScrollIndicator={false}
            />
          </View>
          // </ImageBackground>
        )}
      </SafeAreaView>
    );
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageView: {
    width: wp('100%'),
    height: hp('35%'),
  },
  banner: {
    height: hp('35%'),
    width: wp('100%'),
    resizeMode: 'cover',
  },
  orderBtnsView: {
    position: 'absolute',
    marginTop: hp('25%'),
    flexDirection: 'row',
    height: hp('10%'),
    marginVertical: hp('1%'),
  },
  bestMenuText: {
    fontFamily: 'Lato-Black',
    fontSize: hp('3.5%'),
    color: '#EC942A',
    marginVertical: hp('2%'),
  },
  item: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('3%'),
    flexDirection: 'row',
    borderRadius: 10,
  },
  image_container: {
    width: wp('30%'),
    height: hp('12%'),
  },
  image: {
    width: wp('30%'),
    height: hp('12%'),
    borderColor: 'white',
    borderRadius: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: wp('3%'),
  },
  name: {
    fontFamily: 'Lato-Black',
    color: 'white',
    fontSize: wp('5%'),
    right: wp('3%'),
  },
  btnLogin: {
    fontFamily: 'Lato-Regular',
    paddingHorizontal: wp('1%'),
    textDecorationLine: 'underline',
    fontSize: hp('2.2%'),
    fontWeight: '700',
    marginTop: hp('2%'),
    color: 'black',
  },
});
