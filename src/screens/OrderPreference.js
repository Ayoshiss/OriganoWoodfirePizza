/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import DropDownPicker from 'react-native-dropdown-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PlaceSearch from '../components/PlaceSearch';
import RBSheet from 'react-native-raw-bottom-sheet';
export class OrderPreference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPickupInput: false,
      pickUpStore: '',
      showDeliveryInput: false,
      places: [],
      placesWithCharge: [],
      errorMessage: null,
      viewPlaces: null,
    };
  }
  componentDidMount() {
    const {places, placesWithCharge} = this.props.route.params;
    this.setState({places, placesWithCharge});
  }
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

  handleSelect = (data) => {
    const address = data.description;
    const {places} = this.state;
    if (places.some((place) => address.includes(place))) {
      if (address.split(' ').length < 5) {
        this.setState({errorMessage: 'Please enter your full address.'});
        return;
      } else {
        this.props.navigation.navigate('Home', {
          preferenceData: data.description,
          preferenceType: 'Delivery',
        });
      }
    } else {
      this.setState({
        errorMessage: 'Sorry! We currently do not deliver in that area.',
        viewPlaces: 'View Places We Deliver',
      });
    }
  };
  handleDeliveryBtn = (data) => {
    const {placesWithCharge} = this.state;
    const address = data.description;
    var count = 0;
    placesWithCharge.forEach((item) => {
      if (address.includes(item[0])) {
        if (address.split(' ').length < 5) {
          this.setState({errorMessage: 'Please enter your full address.'});
          return;
        } else {
          this.props.navigation.navigate('Home', {
            preferenceData: data.description,
            preferenceType: 'Delivery',
            charge: JSON.stringify(item[1]),
          });
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

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View
          style={{
            marginVertical: hp('1%'),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: wp('5%'),
          }}>
          <MaterialIcons
            name="arrow-back"
            color="grey"
            size={35}
            onPress={() => this.props.navigation.goBack()}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: hp('3.5%'),
              fontWeight: 'bold',
              color: '#EC942A',
            }}>
            Order Preference
          </Text>
          <MaterialIcons
            name="arrow-back"
            color="white"
            size={35}
            onPress={() => props.navigation.goBack()}
          />
        </View>
        <View
          style={{
            marginVertical: hp('1%'),
            alignItems: 'center',
          }}>
          <Text>Please Select your preference</Text>
          <View style={styles.orderBtnsView}>
            <TouchableOpacity onPress={this.toggleDeliveryInput}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#F47621', '#F89919']}
                width={wp('35%')}
                height={hp('6%')}
                style={styles.buttonDelivery}>
                <Text style={styles.textOrder}>Delivery </Text>
                <MaterialCommunityIcons
                  name="truck-fast"
                  color="white"
                  size={20}
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.togglePickupInput}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#F47621', '#F89919']}
                width={wp('35%')}
                height={hp('6%')}
                style={styles.buttonDelivery}>
                <Text style={styles.textOrder}>Pickup </Text>
                <FAIcon name="store" color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {this.state.errorMessage && (
            <Text
              style={{
                color: 'red',
                fontSize: hp('2%'),
                textAlign: 'center',
                marginTop: hp('5%'),
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
                        style={{fontSize: hp('2.4%'), paddingLeft: wp('5%')}}>
                        {place}
                      </Text>
                    );
                  })}
                </ScrollView>
              </RBSheet>
            </View>
          )}
          {this.state.showPickupInput && (
            <View style={{width: wp('80%'), marginVertical: hp('4%')}}>
              <DropDownPicker
                items={[
                  {
                    label: 'Origano Woodfire Pizza, Alexandria',
                  },
                ]}
                placeholder="Select Pickup Store"
                defaultIndex={0}
                containerStyle={{height: 40}}
                onChangeItem={(item) =>
                  this.props.navigation.navigate('Home', {
                    preferenceData: item.label,
                    preferenceType: 'Pickup',
                    charge: '0',
                  })
                }
              />
            </View>
          )}
          {this.state.showDeliveryInput && (
            <View
              style={{
                flex: 1,
                width: wp('100%'),
                borderWidth: 0,
                marginTop: hp('4%'),
                minHeight: hp('50%'),
              }}>
              <PlaceSearch
                onPress={(data, details = null) => {
                  this.handleDeliveryBtn(data);
                }}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  orderBtnsView: {
    flexDirection: 'row',
    height: hp('5%'),
    marginVertical: hp('1%'),
  },
  buttonDelivery: {
    justifyContent: 'center',
    marginLeft: wp('5%'),
    alignItems: 'center',
    marginTop: hp('1%'),
    flexDirection: 'row',
    borderRadius: 50,
    position: 'relative',
  },
  textOrder: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
  },
});

export default OrderPreference;
