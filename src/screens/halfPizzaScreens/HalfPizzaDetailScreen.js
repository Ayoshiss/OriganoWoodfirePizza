import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Checkbox from '../../components/Checkbox';
import AsyncStorage from '@react-native-community/async-storage';
export class HalfPizzaDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftPizza: this.props.leftPizza,
      leftPizzaDescList: this.props.leftPizzaDescList,
      rightPizza: this.props.rightPizza,
      rightPizzaDescList: this.props.rightPizzaDescList,
      quantity: 1,
      newDescList: [],
      largePrice: 24,
      gfPrice: 24,
      ingredientPrice: 0,
      sizePrice: 0,
      badgeCount: 0,
      finalIngredients: [],
    };
  }

  componentDidMount() {
    let combinedDescList = [
      ...this.state.leftPizzaDescList,
      ...this.state.rightPizzaDescList,
    ];
    const uniqueArray = combinedDescList.filter(
      (item, index) => combinedDescList.indexOf(item) === index,
    );
    let newDescList = [];

    uniqueArray.map((item) => {
      let quantity = 1;
      newDescList = [...newDescList, {item, quantity}];
    });
    this.setState({newDescList});
  }
  onChangeQuat(i, type) {
    const {newDescList} = this.state;
    let newQuantity = newDescList[i].quantity;
    if (type && newQuantity < 1) {
      newQuantity = newQuantity + 1;
      newDescList[i].quantity = newQuantity;
      this.setState({newDescList});
    }
    if (!type && newQuantity > 0) {
      newQuantity = newQuantity - 1;
      newDescList[i].quantity = newQuantity;
      this.setState({newDescList});
    }
  }
  onSubmitCart = () => {
    let leftPizzaName = this.state.leftPizza
      .map((pizza) => {
        return pizza.name;
      })
      .toString();
    let rightPizzaName = this.state.rightPizza
      .map((pizza) => {
        return pizza.name;
      })
      .toString();
    let pizzaName =
      'Half/Half ' + ': ' + leftPizzaName + ' & ' + rightPizzaName;

    const {sizePrice} = this.state;
    if (sizePrice === 0) {
      Alert.alert('Alert', 'Please Select Pizza Size', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    let finalDesc = [];
    this.state.newDescList.map((item) => {
      if (item.quantity === 0) {
        finalDesc = [...finalDesc, item.item];
      }
    });
    let newArry = [...this.state.finalIngredients];
    const finalPrice = sizePrice;
    var food = {
      image:
        'https://firebasestorage.googleapis.com/v0/b/origanofirewood.appspot.com/o/pizzaImages%2Foriganopizza.jpg?alt=media&token=8df5cad2-f002-47c8-94e9-4d74d26f3ef0',
      name: pizzaName,
      size: this.state.checkSize,
    };
    var itemCart = {
      food: food,
      price: finalPrice,
      quantity: 1,
      ingredients: newArry,
      finalDesc,
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
        this.props.closeRB();
        this.props.badgeCount();

        Alert.alert('Success', 'Item Cdded to Cart', [{text: 'OK'}], {
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
  renderIngredients = () => {
    const {newDescList} = this.state;
    const {largePrice, gfPrice} = this.state;
    return (
      <View style={{paddingHorizontal: wp('5%')}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: hp('3%'),
              fontFamily: 'Lato-Black',
              alignSelf: 'center',
            }}>
            Pizza Ingredients
          </Text>
        </View>
        <ScrollView style={{height: hp('55%')}}>
          <View
            style={{
              ...(Platform.OS !== 'android'
                ? {
                    zIndex: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }
                : {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }),
            }}>
            <DropDownPicker
              items={[
                {
                  label: 'Large',
                  value: 'Large',
                },
                {
                  label: 'Gluten Free',
                  value: 'Gluten Free',
                },
              ]}
              placeholder="Select Size"
              defaultIndex={0}
              labelStyle={{
                fontSize: hp('2.2%'),
                textAlign: 'left',
                color: '#000',
                fontFamily: 'Lato-Regular',
              }}
              containerStyle={{
                height: hp('6%'),
                width: wp('60%'),
                // marginHorizontal: wp('5%'),
                marginVertical: hp('2%'),
              }}
              onChangeItem={(item) => {
                const checkSize = item.value;
                let temp = 0;
                if (checkSize === 'Large') {
                  temp = largePrice;
                }
                if (checkSize === 'Gluten Free') {
                  temp = gfPrice;
                }
                this.setState({checkSize, sizePrice: temp});
              }}
            />
            <Text style={{color: 'white'}}>$</Text>
            <Text style={styles.price}>${this.state.sizePrice}</Text>
            <Text style={{color: 'white'}}>$</Text>
          </View>
          <View>
            {newDescList.map((item, i) => {
              return (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: hp('0.5%'),
                  }}>
                  <View style={{width: wp('60%')}}>
                    <Text
                      style={{
                        fontSize: hp('2.2%'),
                        fontFamily: 'Lato-Regular',
                      }}>
                      {item.item}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.onChangeQuat(i, false)}>
                      <Icon
                        name={'ios-remove-circle'}
                        style={{color: '#EC942A'}}
                        size={30}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: 'Lato-Bold',
                        paddingHorizontal: wp('4%'),
                      }}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.onChangeQuat(i, true)}>
                      <Icon
                        name={'ios-add-circle'}
                        style={[{color: '#EC942A'}]}
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };
  renderItem = ({item}) => {
    let {ingredientPrice} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Checkbox
          ingredient={item.name}
          addIngredient={() => {
            if (!this.state[item.name]) {
              ingredientPrice = ingredientPrice + item.price;
            } else {
              ingredientPrice = ingredientPrice - item.price;
            }
            this.setState({
              [item.name]: !this.state[item.name],
              ingredientPrice,
            });
          }}
          checkValue={this.state[item.name]}
          price={item.price}
        />
      </SafeAreaView>
    );
  };
  render() {
    return (
      <View>
        {this.renderIngredients()}
        <View
          style={{
            backgroundColor: '#EC942A',
            height: hp('0.1%'),
            width: wp('90%'),
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            backgroundColor: '#EC942A',
            height: hp('0.1%'),
            width: wp('90%'),
            alignSelf: 'center',
          }}
        />
        <View style={styles.buttonContainer}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              paddingVertical: hp('1%'),
              fontFamily: 'Lato-Regular',
            }}>
            Total :
            <Text style={{color: 'green', fontFamily: 'Lato-Black'}}>
              {' '}
              {'$'}
              {this.state.ingredientPrice + this.state.sizePrice}{' '}
            </Text>
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#EC942A',
              width: wp('90%'),
              alignItems: 'center',
              padding: 10,
              borderRadius: 5,
            }}
            onPress={this.onSubmitCart}>
            <Text style={styles.checkOutButtontext}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: hp('2%'),
  },
  title: {
    fontSize: hp('2.2%'),
    paddingHorizontal: wp('5%'),
  },
  sizeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('2.2%'),
  },
  checkOutButtontext: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HalfPizzaDetailScreen;
