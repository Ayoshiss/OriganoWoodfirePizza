import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import DetailTopping from './DetailTopping';
export default class PizzaDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.route.params.image,
      name: this.props.route.params.name,
      price: this.props.route.params.price,
      smallPrice: this.props.route.params.smallPrice,
      medPrice: this.props.route.params.medPrice,
      largePrice: this.props.route.params.largePrice,
      gfPrice: this.props.route.params.gfPrice,
      type: this.props.route.params.type,
      desc: this.props.route.params.desc,
      descList: this.props.route.params.desc.split(','),
      toppingsList: this.props.route.params.toppingsList,
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
                  fontFamily: 'Lato-Regular',
                }}>
                {this.state.badgeCount}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView style={[styles.footer]}>
          {this.state.isAvailable === 'Yes' ? (
            <View style={[styles.status, {borderColor: '#EC942A'}]}>
              <Text style={{color: '#EC942A', fontFamily: 'Lato-Regular'}}>
                AVAILABLE
              </Text>
            </View>
          ) : (
            <View style={[styles.status, {borderColor: 'red'}]}>
              <Text style={{color: 'red', fontFamily: 'Lato-Regular'}}>
                Out of Stock
              </Text>
            </View>
          )}
          <Text style={styles.textPrice}>${this.state.price}</Text>
          <Text numberOfLines={2} style={styles.textName}>
            {this.state.name.toUpperCase()}
          </Text>
          <Text style={styles.textDetail}>{this.state.desc}</Text>
          <View>
            <TouchableOpacity
              onPress={() => this.RBSheet.open()}
              disabled={this.state.disableButton}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#F47621', '#F89919']}
                style={styles.button}>
                <Text style={styles.textOrder}>ADD TO CART</Text>
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
            <DetailTopping
              closeRB={() => this.RBSheet.close()}
              badgeCount={() => this.getBadgeCount()}
              itemName={this.state.name}
              itemImg={this.state.image}
              itemPrice={this.state.price}
              itemSmallPrice={this.state.smallPrice}
              itemMedPrice={this.state.medPrice}
              itemLargePrice={this.state.largePrice}
              itemGfPrice={this.state.gfPrice}
              toppingsList={this.state.toppingsList}
              descList={this.state.descList}
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
    height: height_image,
  },
  image: {
    width: '100%',
    height: '100%',
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
  },
  textDetail: {
    color: 'grey',
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
