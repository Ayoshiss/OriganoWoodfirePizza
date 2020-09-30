import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {RNToasty} from 'react-native-toasty';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RBSheet from 'react-native-raw-bottom-sheet';
import HalfPizzaDetailScreen from './HalfPizzaDetailScreen';
import FastImage from 'react-native-fast-image'
class HalfPizzaScreen extends Component {
  constructor(props) {
    super(props);
    var x,
      pizzaLabelArray = [],
      y;
    this.props.route.params.pizzaList.map((pizza) => {
      x = pizza.name;
      y = {label: x, value: x};
      pizzaLabelArray = [...pizzaLabelArray, y];
    });
    this.state = {
      pizzaList: this.props.route.params.pizzaList,
      // toppingsList: this.props.route.params.toppingsList,
      pizzaLabelArray,
      leftPizza: [],
      image: this.props.route.params.pizzaList[0].image,
      rightPizza: [],
      badgeCount: 0,
    };
  }
  componentDidMount = () => {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getBadgeCount();
    });
  };
  getBadgeCount = () => {
    AsyncStorage.getItem('cart').then((cart) => {
      if (cart !== null) {
        const cartfood = JSON.parse(cart);
        const badgeCount = cartfood.length;
        this.setState({badgeCount});
      }
    });
  };
  handleEdit = () => {
    const {leftPizza, rightPizza} = this.state;
    if (leftPizza.length === 0 || rightPizza.length === 0) {
      RNToasty.Show({
        title: 'Please select two Pizzas',
      });
      return;
    }
    if (leftPizza[0].name === rightPizza[0].name) {
      RNToasty.Show({
        title: 'Please select two different types of pizza',
      });
      return;
    }
    this.RBSheet.open();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.image_container}>
          <FastImage
            source={{
              uri:
                'https://firebasestorage.googleapis.com/v0/b/origanofirewood.appspot.com/o/halfHalfPizza%2FHalfHalfPizza-min.jpg?alt=media&token=9a851045-849b-4b43-ba9c-c741cad09f8b',
            }}
            style={styles.image}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            paddingHorizontal: wp('5%'),
            ...(Platform.OS === 'ios'
              ? {paddingVertical: hp('6%')}
              : {paddingVertical: hp('2%')}),
          }}>
          <MaterialIcons
            name="arrow-back"
            color="white"
            size={35}
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            paddingRight: wp('5%'),
            ...(Platform.OS === 'ios'
              ? {
                  paddingVertical: hp('6%'),
                }
              : {
                  paddingVertical: hp('2%'),
                }),
          }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Cart')}>
            <Ionicons name="ios-cart" color="white" size={35} />

            <View style={styles.badge}>
              <Text
                style={{
                  color: '#fbfbfb',
                  textAlign: 'center',
                  fontSize: wp('3.5%'),
                  fontFamily: 'Lato-Regular',
                }}>
                {this.state.badgeCount}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView style={[styles.footer]}>
          {/* <Text style={styles.textPrice}>${this.state.price}</Text> */}
          <Text numberOfLines={2} style={styles.textName}>
            {/* {this.state.name.toUpperCase()} */}
            Half Half Pizza
          </Text>
          <Text style={styles.textDetail}>
            Combine any 2 of our delicious pizzas in 1. Each pizza will take up
            one half of the entire base.
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              minHeight: hp('26%'),
            }}>
            <View>
              <Text>Choose Left Pizza</Text>
              <View style={{...(Platform.OS !== 'android' && {zIndex: 10})}}>
                <DropDownPicker
                  items={this.state.pizzaLabelArray}
                  placeholder="Select Size"
                  defaultIndex={0}
                  dropDownMaxHeight={
                    Platform.OS === 'ios' ? hp('18%') : hp('22%')
                  }
                  labelStyle={{
                    fontSize: hp('2.2%'),
                    textAlign: 'left',
                    color: '#000',
                    fontFamily: 'Lato-Regular',
                  }}
                  containerStyle={{
                    height: hp('6%'),
                    width: wp('40%'),
                    // marginHorizontal: wp('5%'),
                    marginVertical: hp('2%'),
                  }}
                  onChangeItem={(item) => {
                    const leftPizza = this.state.pizzaList.filter((pizza) => {
                      return pizza.name === item.value;
                    });

                    const apple = leftPizza.map((pizza) => {
                      return pizza.desc;
                    });

                    const leftPizzaDescList = apple.toString().split(',');

                    this.setState({
                      leftPizza,
                      leftPizzaDescList,
                    });
                  }}
                />
              </View>
            </View>
            <View>
              <Text>Choose Right Pizza</Text>
              <View style={{...(Platform.OS !== 'android' && {zIndex: 10})}}>
                <DropDownPicker
                  items={this.state.pizzaLabelArray}
                  placeholder="Select Size"
                  defaultIndex={0}
                  dropDownMaxHeight={
                    Platform.OS === 'ios' ? hp('18%') : hp('22%')
                  }
                  labelStyle={{
                    fontSize: hp('2.2%'),
                    textAlign: 'left',
                    color: '#000',
                    fontFamily: 'Lato-Regular',
                  }}
                  containerStyle={{
                    height: hp('6%'),
                    width: wp('40%'),
                    // marginHorizontal: wp('5%'),
                    marginVertical: hp('2%'),
                  }}
                  onChangeItem={(item) => {
                    const rightPizza = this.state.pizzaList.filter((pizza) => {
                      return pizza.name === item.value;
                    });
                    const apple = rightPizza.map((pizza) => {
                      return pizza.desc;
                    });

                    const rightPizzaDescList = apple.toString().split(',');
                    this.setState({rightPizza, rightPizzaDescList});
                  }}
                />
              </View>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={this.handleEdit}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#F47621', '#F89919']}
                style={styles.button}>
                <Text style={styles.textOrder}>EDIT INGREDIENTS</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <RBSheet
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            animationType={'slide'}
            height={hp('80%')}
            openDuration={500}
            closeOnDragDown={true}
            dragFromTopOnly={true}
            customStyles={{
              container: {
                borderTopEndRadius: 30,
                borderTopStartRadius: 30,
              },
            }}>
            <HalfPizzaDetailScreen
              closeRB={() => this.RBSheet.close()}
              badgeCount={() => this.getBadgeCount()}
              leftPizzaDescList={this.state.leftPizzaDescList}
              rightPizzaDescList={this.state.rightPizzaDescList}
              leftPizza={this.state.leftPizza}
              rightPizza={this.state.rightPizza}
              // toppingsList={this.state.toppingsList}
            />
          </RBSheet>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const height_image = height * 0.5 * 0.9;
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  footer: {
    flex: 2,
    paddingHorizontal: wp('5%'),
  },
  image_container: {
    width: width,
    height: hp('40%'),
    flexDirection: 'row',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  back: {
    position: 'absolute',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('5.5%'),
  },
  status: {
    // marginTop: 30,
    marginVertical: hp('2.5%'),
    paddingVertical: hp('0.5%'),
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 50,
  },
  textPrice: {
    color: '#EC942A',
    fontFamily: 'Lato-Bold',
    fontSize: hp('4%'),
  },
  textName: {
    color: '#3E3C3E',
    fontFamily: 'Lato-Bold',
    fontSize: hp('6%'),
    paddingVertical: hp('2%'),
  },
  textDetail: {
    color: 'grey',
    marginVertical: hp('2%'),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderRadius: 100,
  },
  textOrder: {
    color: 'white',
    fontFamily: 'Lato-Black',
    fontSize: hp('2.5%'),
  },
  badge: {
    alignItems: 'center',
    height: wp('4.5%'),
    borderRadius: 150,
    width: wp('4.5%'),
    right: 1,
    top: 0,
    backgroundColor: 'red',
    position: 'absolute',
  },
});

export default HalfPizzaScreen;
