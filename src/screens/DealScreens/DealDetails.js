import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import RNPickerSelect from 'react-native-picker-select';

class DealDetails extends Component {
  constructor(props) {
    super(props);
    var x,
      y,
      pizzaLabelArray = [],
      pastaLabelArray = [],
      a,
      b;

    this.props.route.params.pizzaList.map((pizza) => {
      if (pizza.isAvailable === 'Yes' && pizza.type !== 'Sea Food Pizza') {
        x = pizza.name;
        y = {label: x, value: x};
        pizzaLabelArray = [...pizzaLabelArray, y];
      }
    });
    this.props.route.params.pastaList.map((pasta) => {
      if (pasta.isAvailable === 'Yes') {
        a = pasta.name;
        b = {label: a, value: a};
        pastaLabelArray = [...pastaLabelArray, b];
      }
    });

    this.state = {
      pizzaList: this.props.route.params.pizzaList,
      pizzaLabelArray,
      pastaLabelArray,
      garlicPizzaList: [
        {
          label: 'Garlic and Olive Oil Pizza',
          value: 'Garlic and Olive Oil Pizza',
        },
        {label: 'Garlic, Cheese Pizza', value: 'Garlic, Cheese Pizza'},
      ],
      firstPizza: '',
      secondPizza: '',
      thirdPizza: '',
      firstPasta: '',
      secondPasta: '',
      firstGarlicPizza: '',
      secondGarlicPizza: '',

      image: this.props.route.params.image,
      name: this.props.route.params.name,
      price: this.props.route.params.price,
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
  addToCart = () => {
    const {
      firstPizza,
      secondPizza,
      thirdPizza,
      firstPasta,
      secondPasta,
      firstGarlicPizza,
      secondGarlicPizza,
      image,
      name,
      price,
    } = this.state;
    if (name === 'Max Deal') {
      if (
        firstPizza === '' ||
        secondPizza === '' ||
        thirdPizza === '' ||
        firstPizza === null ||
        secondPizza === null ||
        thirdPizza === null
      ) {
        Alert.alert(
          'Alert',
          'Please Select Three Large Pizza',
          [{text: 'OK'}],
          {cancelable: false},
        );
        return;
      }
    }
    if (name === 'Big Deal') {
      if (
        firstPizza === '' ||
        secondPizza === '' ||
        firstPizza === null ||
        secondPizza === null
      ) {
        Alert.alert('Alert', 'Please Select Two Large Pizza', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }
    }
    if (name === 'Party Deal') {
      if (
        firstPizza === '' ||
        secondPizza === '' ||
        thirdPizza === '' ||
        firstPasta === '' ||
        secondPasta === '' ||
        firstGarlicPizza === '' ||
        secondGarlicPizza === '' ||
        firstPizza === null ||
        secondPizza === null ||
        thirdPizza === null ||
        firstPasta === null ||
        secondPasta === null ||
        firstGarlicPizza === null ||
        secondGarlicPizza === null
      ) {
        Alert.alert(
          'Alert',
          'Please Select 3 Large Pizza, 2 Pasta and 2 Garlic Pizza',
          [{text: 'OK'}],
          {cancelable: false},
        );
        return;
      }
    }
    var food = {
      image,
      name,
      pizzaNames: [firstPizza, secondPizza, thirdPizza],
      pastaNames: [firstPasta, secondPasta],
      garlicPizzaNames: [firstGarlicPizza, secondGarlicPizza],
    };
    var itemCart = {
      food: food,
      price: Number(price).toFixed(2),
      quantity: 1,
    };
    AsyncStorage.getItem('cart')
      .then((datacart) => {
        if (datacart !== null) {
          const cart = JSON.parse(datacart);
          cart.push(itemCart);
          AsyncStorage.setItem('cart', JSON.stringify(cart));
        } else {
          const cart = [];
          cart.push(itemCart);
          AsyncStorage.setItem('cart', JSON.stringify(cart));
        }
        this.getBadgeCount();

        Alert.alert('Alert', 'Item Added to Cart', [{text: 'OK'}], {
          cancelable: false,
        });
      })
      .catch((error) => {
        Alert.alert('Error', `${error}`, [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      });
  };

  renderBigOrMaxDeals = () => {
    return (
      <ScrollView style={[styles.footer]}>
        <Text numberOfLines={2} style={styles.textName}>
          {this.state.name}
        </Text>
        <Text style={styles.textPrice}>${this.state.price}</Text>
        <Text style={styles.textDetail}>
          {this.state.name === 'Max Deal'
            ? 'Choose any three large pizza'
            : 'Choose any two large pizza'}{' '}
        </Text>
        <View
          style={{
            minHeight: hp('32%'),
          }}>
          <View>
            <Text>First Pizza</Text>
            <View style={[styles.labelStyle, {width: wp('70%')}]}>
              <RNPickerSelect
                placeholder={{label: 'Select First Pizza'}}
                useNativeAndroidPickerStyle={false}
                onValueChange={(item) => {
                  this.setState({firstPizza: item});
                }}
                items={this.state.pizzaLabelArray}
                textInputProps={styles.pickerText}
              />
            </View>
          </View>
          <View>
            <Text>Second Pizza</Text>
            <View style={[styles.labelStyle, {width: wp('70%')}]}>
              <RNPickerSelect
                placeholder={{label: 'Select Second Pizza'}}
                useNativeAndroidPickerStyle={false}
                onValueChange={(item) => {
                  this.setState({secondPizza: item});
                }}
                items={this.state.pizzaLabelArray}
                textInputProps={styles.pickerText}
              />
            </View>
          </View>
          {this.state.name === 'Max Deal' && (
            <View style={{marginBottom: hp('2%')}}>
              <Text>Third Pizza</Text>
              <View style={[styles.labelStyle, {width: wp('70%')}]}>
                <RNPickerSelect
                  placeholder={{label: 'Select Third Pizza'}}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(item) => {
                    this.setState({thirdPizza: item});
                  }}
                  items={this.state.pizzaLabelArray}
                  textInputProps={styles.pickerText}
                />
              </View>
            </View>
          )}
        </View>
        <View>
          <TouchableOpacity onPress={this.addToCart}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#F47621', '#F89919']}
              style={styles.button}>
              <Text style={styles.textOrder}>Add To Cart</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  renderPartyDeal = () => {
    return (
      <ScrollView style={[styles.footer]}>
        <Text numberOfLines={2} style={styles.textName}>
          {this.state.name}
        </Text>
        <Text style={styles.textPrice}>${this.state.price}</Text>
        <Text style={styles.textDetail}>
          Choose any 3 large pizza, 2 pasta and 2 garlic pizza
        </Text>
        <View
          style={{
            minHeight: hp('32%'),
          }}>
          <View style={styles.dropDownView}>
            <View>
              <Text>First Pizza</Text>
              <View style={[styles.labelStyle, {width: wp('40%')}]}>
                <RNPickerSelect
                  placeholder={{label: 'Select First Pizza'}}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(item) => {
                    this.setState({firstPizza: item});
                  }}
                  items={this.state.pizzaLabelArray}
                  textInputProps={styles.pickerText}
                />
              </View>
            </View>
            <View>
              <Text>Second Pizza</Text>
              <View style={[styles.labelStyle, {width: wp('40%')}]}>
                <RNPickerSelect
                  placeholder={{label: 'Select Second Pizza'}}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(item) => {
                    this.setState({secondPizza: item});
                  }}
                  items={this.state.pizzaLabelArray}
                  textInputProps={styles.pickerText}
                />
              </View>
            </View>
          </View>
          <View>
            <Text>Third Pizza</Text>
            <View style={[styles.labelStyle, {width: wp('40%')}]}>
              <RNPickerSelect
                placeholder={{label: 'Select Third Pizza'}}
                useNativeAndroidPickerStyle={false}
                onValueChange={(item) => {
                  this.setState({thirdPizza: item});
                }}
                items={this.state.pizzaLabelArray}
                textInputProps={styles.pickerText}
              />
            </View>
          </View>
          <View style={styles.dropDownView}>
            <View>
              <Text>First Pasta</Text>

              <View style={[styles.labelStyle, {width: wp('40%')}]}>
                <RNPickerSelect
                  placeholder={{label: 'Select First Pasta'}}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(item) => {
                    this.setState({firstPasta: item});
                  }}
                  items={this.state.pastaLabelArray}
                  textInputProps={styles.pickerText}
                />
              </View>
            </View>
            <View>
              <Text>Second Pasta</Text>
              <View style={[styles.labelStyle, {width: wp('40%')}]}>
                <RNPickerSelect
                  placeholder={{label: 'Select Second Pasta'}}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(item) => {
                    this.setState({secondPasta: item});
                  }}
                  items={this.state.pastaLabelArray}
                  textInputProps={styles.pickerText}
                />
              </View>
            </View>
          </View>
          <View style={[styles.dropDownView, {marginBottom: hp('2%')}]}>
            <View>
              <Text>First Garlic Pizza</Text>

              <View style={[styles.labelStyle, {width: wp('40%')}]}>
                <RNPickerSelect
                  placeholder={{label: 'First Garlic Pizza'}}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(item) => {
                    this.setState({firstGarlicPizza: item});
                  }}
                  items={this.state.garlicPizzaList}
                  textInputProps={styles.pickerText}
                />
              </View>
            </View>
            <View>
              <Text>Second Garlic Pizza</Text>
              <View style={[styles.labelStyle, {width: wp('40%')}]}>
                <RNPickerSelect
                  placeholder={{label: 'Second Garlic Pizza'}}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(item) => {
                    this.setState({secondGarlicPizza: item});
                  }}
                  items={this.state.garlicPizzaList}
                  textInputProps={styles.pickerText}
                />
              </View>
            </View>
          </View>
        </View>

        <View>
          <TouchableOpacity onPress={this.addToCart}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#F47621', '#F89919']}
              style={styles.button}>
              <Text style={styles.textOrder}>Add To Cart</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.image_container}>
          <FastImage
            source={{
              uri: this.state.image,
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
        {this.state.name !== 'Party Deal' && this.renderBigOrMaxDeals()}
        {this.state.name === 'Party Deal' && this.renderPartyDeal()}
      </SafeAreaView>
    );
  }
}

const width = Dimensions.get('screen').width;
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
    height: hp('30%'),
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

  dropDownView: {flexDirection: 'row', justifyContent: 'space-between'},
  textPrice: {
    color: '#EC942A',
    fontFamily: 'Lato-Bold',
    fontSize: hp('3%'),
  },
  textName: {
    color: '#3E3C3E',
    fontFamily: 'Lato-Bold',
    fontSize: hp('6%'),
    paddingVertical: hp('1%'),
  },
  textDetail: {
    color: 'grey',
    marginVertical: hp('1%'),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    marginBottom: hp('1.5%'),
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
  pickerSection: {
    borderWidth: 1,
    borderColor: 'darkgrey',
    margin: 15,
    padding: 5,
  },
  labelStyle: {
    marginVertical: hp('1%'),
    fontSize: hp('2.2%'),
    textAlign: 'left',
    color: '#000',
    fontFamily: 'Lato-Regular',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
  },
  pickerText: {
    fontSize: hp('2.2%'),
    color: 'grey',
  },
});

export default DealDetails;
