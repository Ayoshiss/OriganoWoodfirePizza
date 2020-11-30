import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'
export default class DetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.route.params.image,
      name: this.props.route.params.name,
      price: this.props.route.params.price,
      type: this.props.route.params.type,
      desc: this.props.route.params.desc,
      isAvailable: this.props.route.params.isAvailable,
      badgeCount: 0,
      disableButton: false,
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getBadgeCount();
    });
    this.state.isAvailable === 'Yes'
      ? this.setState({disableButton: false})
      : this.setState({disableButton: true});
  }
  onSubmitCart = () => {
    var food = {
      image: this.state.image,
      name: this.state.name,
    };
    var itemCart = {
      food: food,
      price: this.state.price,
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

        alert('Item added to Cart');
        this.getBadgeCount();
      })
      .catch((error) => {
        alert(error);
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
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.image_container}>
          <FastImage source={{uri: this.state.image}} style={styles.image} />
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
                  
                }}>
                {this.state.badgeCount}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={[styles.footer]}>
          {this.state.isAvailable === 'Yes' ? (
            <View style={[styles.status, {borderColor: '#EC942A'}]}>
              <Text style={{color: '#EC942A'}}>
                AVALIABLE
              </Text>
            </View>
          ) : (
            <View style={[styles.status, {borderColor: 'red'}]}>
              <Text style={{color: 'red'}}>
                Out of Stock
              </Text>
            </View>
          )}

          <Text style={styles.textPrice}>${this.state.price}</Text>
          <Text numberOfLines={2} style={styles.textName}>
            {this.state.name.toUpperCase()}
          </Text>
          <Text style={styles.textDetail}>{this.state.desc}</Text>
          <TouchableOpacity
            onPress={this.onSubmitCart}
            disabled={this.state.disableButton}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#F47621', '#F89919']}
              style={styles.button}>
              <Text style={styles.textOrder}>ADD TO CART</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    flex: 1,
    paddingHorizontal: wp('5%'),
  },
  image_container: {
    width: width,
    height: height_image,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  back: {
    position: 'absolute',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('6%'),
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
  
    fontSize: hp('4%'),
  },
  textName: {
    color: '#3E3C3E',
    
    fontSize: hp('6%'),
  },
  textDetail: {
   
    color: 'gray',
    marginVertical: hp('3%'),
    lineHeight: hp('2.5%'),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderRadius: 100,
  },
  textOrder: {
    color: 'white',
    fontWeight: 'bold',
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
